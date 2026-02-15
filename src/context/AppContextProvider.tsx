"use client";

import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useRef
} from 'react';
import axiosClient, {setAuthToken} from '@/config/client';
import { AuthUserType,  } from '../types';
import logger from '../../logger.config.mjs';
import { AuthResult } from '@/config/pi';
import { onIncompletePaymentFound } from '@/config/payment';
import { useRouter } from 'next/navigation';

export type PiLoginStage =
  | ""
  | "auto_login"
  | "pi_sdk_loading"
  | "pi_authenticating"
  | "backend_authenticating"
  | "authenticated"
  | "timeout"
  | "failed";

const MAX_LOGIN_RETRIES = 3;
const BASE_DELAY_MS = 5000; // 5s → 15s → 45s

interface IAppContextProps {
  authUser: AuthUserType | null;
  setAuthUser: React.Dispatch<SetStateAction<AuthUserType | null>>;
  authenticateUser: () => void;
  isSigningInUser: boolean;
  reload: boolean;
  alertMessage: string | null;
  showAlert: (message: string) => void;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  loginStage: PiLoginStage;
  googleReady: boolean;
  setGoogleReady: (value: boolean) => void;
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// both HTTP 401 Unauthorized and HTTP 403 Forbidden errors are considered "hard fails" 
// in the sense that the server is actively denying access

const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("PI_AUTH_TIMEOUT"));
    }, timeoutMs);

    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
};


const initialState: IAppContextProps = {
  authUser: null,
  setAuthUser: () => {},
  authenticateUser: () => {},
  isSigningInUser: false,
  reload: false,
  alertMessage: null,
  showAlert: () => {},
  setReload: () => {},
  loginStage: "",
  googleReady: false,
  setGoogleReady: () => {}
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isSigningInUser, setIsSigningInUser] = useState(false);
  const [reload, setReload] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loginStage, setLoginStage] = useState<PiLoginStage>("");
  const [googleReady, setGoogleReady] = useState(false);

  const piSdkLoaded = useRef(false);
  const router = useRouter()

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
  };

  const loadPiSdk = (): Promise<typeof window.Pi> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      script.onload = () => resolve(window.Pi);
      script.onerror = () => reject(new Error('Failed to load Pi SDK'));
      document.head.appendChild(script);
    });
  };

  const ensurePiSdkLoaded = async () => {
    if (piSdkLoaded.current) {
      return window.Pi;
    }
    
    const Pi = await loadPiSdk();
    piSdkLoaded.current = true;

    Pi.init({
      version: '2.0',
      sandbox: process.env.NODE_ENV === 'development'
    });

    return Pi;
  };

  /* Login helper functions */
  const autoLoginProcess = async (): Promise<boolean> => {
    try {
      setLoginStage("auto_login");

      const res = await axiosClient.get("/users/me");
      if (res.status === 200) {
        setAuthUser(res.data.user);
        setLoginStage("authenticated");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };


  const PI_AUTH_TIMEOUT_MS = 30_000; // 30 seconds

  const piSdkLoginProcess = async (): Promise<boolean> => {
    try {
      setLoginStage("pi_sdk_loading");
      const Pi = await ensurePiSdkLoaded();

      setLoginStage("pi_authenticating");

      const pioneerAuth: AuthResult = await withTimeout(
        Pi.authenticate(
          ["username", "payments", "wallet_address"],
          onIncompletePaymentFound
        ),
        PI_AUTH_TIMEOUT_MS
      );

      setLoginStage("backend_authenticating");

      const res = await axiosClient.post(
        "/users/authenticate/pi",
        {},
        {
          headers: {
            Authorization: `Bearer ${pioneerAuth.accessToken}`,
          },
        }
      );

      setAuthToken(res.data?.token);
      setAuthUser(res.data.user);
      setLoginStage("authenticated");

      if (res.data.requiresOnboarding) {
        router.push("/profile/edit");
      } 

      return true;
    } catch (error: any) {
      if (error?.message === "PI_AUTH_TIMEOUT") {
        logger.error("Pi authentication timed out.");
        setLoginStage("timeout");
        throw error; // ONLY hard throw
      }

      logger.warn("Soft Pi SDK login failure:", error);
      return false;
    }
  };

  /* Attempt Auto Login (fallback to Pi auth) */
  const authenticateUser = async () => {
    if (isSigningInUser) return;

    setIsSigningInUser(true);
    setLoginStage("");

    try {
      const autoLoggedIn = await autoLoginProcess();
      if (autoLoggedIn) {
        logger.info("Auto-login successful.");
        return;
      }

      for (let attempt = 0; attempt < MAX_LOGIN_RETRIES; attempt++) {
        try {
          const sdkLoggedIn = await piSdkLoginProcess();
          if (sdkLoggedIn) {
            logger.info("Pi SDK login successful.");
            return;
          }
        } catch (error: any) {
          if (error?.message === "PI_AUTH_TIMEOUT") {
            logger.error("Stopping retries due to Pi timeout.");
            throw error;
          }

          logger.warn(`Soft failure on attempt ${attempt + 1}`, error);
        }

        const backoff = BASE_DELAY_MS * Math.pow(3, attempt);
        const jitter = Math.random() * 1000;
        await sleep(backoff + jitter);
      }

      setLoginStage("failed");
      throw new Error("Login retries exhausted");
    } finally {
      setIsSigningInUser(false);
    }
  };

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, authenticateUser, isSigningInUser, reload, setReload, showAlert, alertMessage, loginStage, googleReady, setGoogleReady }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
