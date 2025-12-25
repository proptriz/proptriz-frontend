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
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// both HTTP 401 Unauthorized and HTTP 403 Forbidden errors are considered "hard fails" 
// in the sense that the server is actively denying access
const isHardFail = (err: any) => {
  const code = err?.response?.status || err?.status;
  return code === 401 || code === 403;
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

  const piSdkLoaded = useRef(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
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
      const Pi = await ensurePiSdkLoaded();
      const pioneerAuth: AuthResult = await Pi.authenticate(
        ["username", "payments", "wallet_address"],
        onIncompletePaymentFound
      );

      // Send accessToken to backend
      const res = await axiosClient.post(
        "/users/authenticate",
        {},
        {
          headers: { Authorization: `Bearer ${pioneerAuth.accessToken}` },
        }
      );

      setAuthToken(res.data?.token);
      setAuthUser(res.data.user);
      return true;
    } catch (error: any) {
      if (isHardFail(error)) throw error; // 401/403 must break retry loop
      return false; // soft failures become retry'able
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

  useEffect(() => {
    logger.info('AppContextProvider mounted.');

    if (authUser) return;
    
    // attempt to load and initialize Pi SDK in parallel
    ensurePiSdkLoaded().catch(err => logger.error('Pi SDK load/ init error:', err));

    authenticateUser();
  }, [authUser]);

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, authenticateUser, isSigningInUser, reload, setReload, showAlert, alertMessage }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
