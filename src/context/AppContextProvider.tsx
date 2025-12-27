"use client";

import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useEffect,
  useRef
} from 'react';
import axiosClient, {setAuthToken} from '@/config/client';
import { AuthUserType,  } from '../types';
import logger from '../../logger.config.mjs';
import { AuthResult } from '@/config/pi';
import { onIncompletePaymentFound } from '@/config/payment';

type PiLoginStage =
  | "idle"
  | "loading-sdk"
  | "authenticating"
  | "waiting-user"
  | "try-pi-browser"
  | "verifying-backend"
  | "success"
  | "error";

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
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// both HTTP 401 Unauthorized and HTTP 403 Forbidden errors are considered "hard fails" 
// in the sense that the server is actively denying access
const isHardFail = (err: any) => {
  const code = err?.response?.status || err?.status;
  return code === 401 || code === 403;
};

let piSdkPromise: Promise<typeof window.Pi> | null = null;

const loadPiSdk = (timeoutMs = 1000): Promise<typeof window.Pi> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Pi SDK cannot load on server"));
  }

  if (window.Pi) {
    return Promise.resolve(window.Pi);
  }

  if (piSdkPromise) return piSdkPromise;

  piSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;

    const timeout = setTimeout(() => {
      piSdkPromise = null; // allow retry
      reject(new Error("Pi SDK load timeout"));
    }, timeoutMs);

    script.onload = () => {
      clearTimeout(timeout);
      if (window.Pi) {
        resolve(window.Pi);
      } else {
        piSdkPromise = null;
        reject(new Error("Pi SDK loaded but Pi object missing"));
      }
    };

    script.onerror = () => {
      clearTimeout(timeout);
      piSdkPromise = null;
      reject(new Error("Failed to load Pi SDK"));
    };

    document.head.appendChild(script);
  });

  return piSdkPromise;
};

const authenticateWithTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Authentication timeout"));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

const isPiBrowser = (Pi: any): boolean => {
  return typeof Pi?.isPiBrowser === "function" && Pi.isPiBrowser();
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
  loginStage: "idle",
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
  const [loginStage, setLoginStage] = useState<PiLoginStage>("idle");

  const piSdkLoaded = useRef(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
  };

  const ensurePiSdkLoaded = async () => {
    if (piSdkLoaded.current && window.Pi) {
      return window.Pi;
    }

    logger.info("Loading Pi SDK...");
    const Pi = await loadPiSdk();

    Pi.init({
      version: "2.0",
      sandbox: process.env.NODE_ENV === "development",
    });

    piSdkLoaded.current = true;
    logger.info("Pi SDK initialized");

    return Pi;
  };

  /* Login helper functions */
  const autoLoginProcess = async (): Promise<boolean> => {
    try {
      const res = await axiosClient.get("/users/me");
      if (res.status === 200) {
        setAuthUser(res.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const piSdkLoginProcess = async (): Promise<boolean> => {
    try {
      setLoginStage("loading-sdk");
      const Pi = await ensurePiSdkLoaded();

      const inPiBrowser = isPiBrowser(Pi);
      const isDev = process.env.NODE_ENV === "development";

      // 🚨 Production protection
      if (!isDev && !inPiBrowser) {
        setLoginStage("try-pi-browser");
        logger.warn("User not in Pi Browser (production)");
        return false;
      }

      // 🧪 Development warning (but allow)
      if (isDev && !inPiBrowser) {
        logger.warn("Development mode: not in Pi Browser");
      }

      setLoginStage("authenticating");

      const pioneerAuth: AuthResult = await authenticateWithTimeout(
        Pi.authenticate(
          ["username", "payments", "wallet_address"],
          onIncompletePaymentFound
        ),
        10000
      );

      if (!pioneerAuth?.accessToken) {
        throw new Error("Pi authentication returned no access token");
      }

      setLoginStage("verifying-backend");

      const res = await axiosClient.post(
        "/users/authenticate",
        {},
        { headers: { Authorization: `Bearer ${pioneerAuth.accessToken}` } }
      );

      setAuthToken(res.data.token);
      setAuthUser(res.data.user);
      setLoginStage("success");

      return true;
    } catch (error) {
      logger.error("Pi login failed:", error);
      setLoginStage("error");

      if (isHardFail(error)) throw error;
      return false;
    }
  };



  /* Attempt Auto Login (fallback to Pi auth) */
  const authenticateUser = async () => {
    if (isSigningInUser) return;

    setIsSigningInUser(true);

    try {
      // Process #1 : Attempt Auto-Login
      const autoLoggedIn = await autoLoginProcess();
      if (autoLoggedIn) {
        logger.info("Auto-login successful.");
        return;
      }

      // Process #2 : Fallback to Pi SDK login and registration
      for (let attempt = 0; attempt < MAX_LOGIN_RETRIES; attempt++) {
        try {
          logger.info(`Pi SDK login attempt ${attempt + 1}...`);

          const sdkLoggedIn = await piSdkLoginProcess();
          if (sdkLoggedIn) {
            logger.info("Pi SDK login successful.");
            return;
          }
        } catch (error: any) {
          if (isHardFail(error)) {
            logger.warn("401/403 Hard login failure. Stopping retries.");
            throw error;
          }
          logger.warn(`Soft failure on attempt ${attempt + 1}:`, error);
        }
        
        // Process #3. Continue retry logic for 'soft failures'
        // exponential backoff + jitter
        const backoff = BASE_DELAY_MS * Math.pow(3, attempt);
        const jitter = Math.random() * 1000;
        const delay = backoff + jitter;
        logger.info(`Retrying login in ${Math.round(delay)}ms...`);
        await sleep(delay);
      }
      // if we reach here, all attempts failed
      logger.error("Max retries reached. Stopping retries.");
      throw new Error("Login retries exhausted");
    } finally {
      setIsSigningInUser(false);
    }
  };

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, authenticateUser, isSigningInUser, reload, setReload, showAlert, alertMessage, loginStage }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
