"use client";

import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useRef,
  useContext,
  useEffect,
  useCallback
} from 'react';
import axiosClient, { setAuthToken, ACCOUNT_SUSPENDED_EVENT, isAccountSuspendedError } from '@/config/client';
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
  | "failed"
  | "suspended";

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
  requiresOnboarding: boolean;
  setRequiresOnboarding: (value: boolean) => void;
  setIsNotificationConfigured: React.Dispatch<SetStateAction<boolean>>;
  /** Clears the session here and on the server (cookie). */
  signOut: () => Promise<void>;
  /** True after the server said this account is suspended; drives the notice. */
  accountSuspended: boolean;
  dismissAccountSuspended: () => void;
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
  setGoogleReady: () => {},
  requiresOnboarding: false,
  setRequiresOnboarding: () => {},
  setIsNotificationConfigured: () => {},
  signOut: async () => {},
  accountSuspended: false,
  dismissAccountSuspended: () => {},
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
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);
  const [isNotificationConfigured, setIsNotificationConfigured] = useState(false);

  const [accountSuspended, setAccountSuspended] = useState(false);
  const suspendedHandled = useRef(false);

  const piSdkLoaded = useRef(false);
  const router = useRouter()

  const signOut = useCallback(async () => {
    setAuthUser(null);
    setAuthToken("");
    setRequiresOnboarding(false);
    try {
      await axiosClient.post("/users/logout"); // clears the httpOnly cookie
    } catch (error) {
      logger.warn("Sign-out request failed; local session cleared anyway.", error);
    }
  }, []);

  // Any API call answered with ACCOUNT_SUSPENDED signs the person out and shows the notice.
  useEffect(() => {
    const onSuspended = () => {
      setLoginStage("suspended");
      // Several calls can fail at once (e.g. badge polling); sign out only once.
      if (suspendedHandled.current) return;
      suspendedHandled.current = true;
      setAccountSuspended(true);
      void signOut();
    };
    window.addEventListener(ACCOUNT_SUSPENDED_EVENT, onSuspended);
    return () => window.removeEventListener(ACCOUNT_SUSPENDED_EVENT, onSuspended);
  }, [signOut]);

  const dismissAccountSuspended = useCallback(() => {
    setAccountSuspended(false);
    suspendedHandled.current = false; // a later suspended sign-in attempt shows the notice again
  }, []);

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
    } catch (error) {
      if (isAccountSuspendedError(error)) throw error; // stop: no Pi fallback
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
        setRequiresOnboarding(true);
        router.push("/profile/edit");
      } 

      return true;
    } catch (error: any) {
      if (isAccountSuspendedError(error)) throw error; // never retry a suspended account

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
      await signInWithRetries();
    } catch (error) {
      // Suspended: the event handler has signed out and shown the notice; nothing to retry.
      if (isAccountSuspendedError(error)) {
        setLoginStage("suspended");
        return;
      }
      throw error;
    } finally {
      setIsSigningInUser(false);
    }
  };

  const signInWithRetries = async () => {
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
          if (isAccountSuspendedError(error)) throw error;
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
  };

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, authenticateUser, isSigningInUser, reload, setReload, showAlert, alertMessage, loginStage, googleReady, setGoogleReady, setRequiresOnboarding, requiresOnboarding, setIsNotificationConfigured, signOut, accountSuspended, dismissAccountSuspended }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}