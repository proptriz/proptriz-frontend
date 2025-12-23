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
  autoLoginUser: () => void;
  registerUser: () => void;
  isSigningInUser: boolean;
  reload: boolean;
  alertMessage: string | null;
  setAlertMessage: React.Dispatch<SetStateAction<string | null>>;
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
  autoLoginUser: () => {},
  registerUser: () => {},
  isSigningInUser: false,
  reload: false,
  alertMessage: null,
  setAlertMessage: () => {},
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
  const [adsSupported, setAdsSupported] = useState<boolean>(false);

    const piSdkLoaded = useRef(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
  };

   /* Register User via Pi SDK */
  const registerUser = async () => {
    logger.info('Starting user registration.');
    if (isSigningInUser || authUser) return

    if (typeof window !== 'undefined' && window.Pi?.initialized) {
      try {
        logger.info('interacting with Pi SDK for authentication.');
        setIsSigningInUser(true);
        const pioneerAuth: AuthResult = await window.Pi.authenticate([
          'username', 
          'payments', 
          'wallet_address'
        ], onIncompletePaymentFound);

        if (!pioneerAuth?.accessToken) {
          logger.error('No access token received from Pi SDK.');
          throw new Error('Authentication failed: No access token.');
        }

        logger.info('Pioneer details:', pioneerAuth);
        // Send accessToken to backend
        const res = await axiosClient.post(
          "/users/authenticate", 
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${pioneerAuth.accessToken}`,
            },
          }
        );

        if (res.status === 200) {
          setAuthToken(res.data?.token);
          setAuthUser(res.data.user);
          logger.info('User authenticated successfully.');
        } else {
          setAuthUser(null);
          logger.error('User authentication failed.');
        }
      } catch (error) {
        logger.error('Error during user registration:', error);
      } finally {
        setTimeout(() => setIsSigningInUser(false), 2500);
      }
    } else {
      logger.error('PI SDK failed to initialize.');
    }
  };

  /* Attempt Auto Login (fallback to Pi auth) */
  const autoLoginUser = async () => {
    logger.info('Attempting to auto-login user.');
    try {
      setIsSigningInUser(true);

      const res = await axiosClient.get('/users/me');

      if (res.status === 200) {
        logger.info('Auto-login successful.');
        setAuthUser(res.data.user);
      } else {
        logger.warn('Auto-login failed.');
        setAuthUser(null);
        await registerUser();
      }
    } catch (error) {
      logger.error('Auto login unresolved; attempting Pi SDK authentication:', error);
      await registerUser();
    } finally {
      setTimeout(() => setIsSigningInUser(false), 2500);
    }
  };

  const loginWithRetry = async (attempt = 0): Promise<void> => {
    try {
      await autoLoginUser();
      return; // exit function upon successful registration
  
    } catch (error: any) {
      logger.warn(`Login attempt ${attempt + 1} failed:`, error);
  
      if (isHardFail(error)) {
        logger.warn("401/403 Hard login failure. Retry attempt not executed.");
        throw error;
      }
  
      if (attempt >= MAX_LOGIN_RETRIES) {
        logger.warn("Max retries reached. Stopping auto-login attempts..");
        throw error;
      }
  
      // exponential backoff + jitter
      const backoff = BASE_DELAY_MS * Math.pow(3, attempt);
      const jitter = Math.random() * 1000;
      const delay = backoff + jitter;
  
      logger.warn(`Retrying login in ${Math.round(delay)}ms..`);
  
      await sleep(delay);
      return loginWithRetry(attempt + 1);
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
    Pi.init({
      version: '2.0',
      sandbox: process.env.NODE_ENV === 'development'
    });

    piSdkLoaded.current = true;

    return Pi;
  };


  useEffect(() => {
    logger.info('AppContextProvider mounted.');
    if (isSigningInUser || authUser) return

    // attempt to load and initialize Pi SDK in parallel
    ensurePiSdkLoaded()
      .then(Pi => {
        Pi.nativeFeaturesList().then((features: string | string[]) => {
          setAdsSupported(features.includes("ad_network"));
        })
      })
      .catch(err => logger.error('Pi SDK load/ init error:', err));
    loginWithRetry();
  }, [isSigningInUser]);

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, registerUser, isSigningInUser, reload, setReload, showAlert, alertMessage, setAlertMessage, autoLoginUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
