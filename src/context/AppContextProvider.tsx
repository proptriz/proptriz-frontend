"use client";

import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useEffect
} from 'react';
import { useRouter } from "next/navigation";
import axiosClient, {setAuthToken} from '@/config/client';
import { AuthUserType,  } from '../types';
import { toast } from 'react-toastify';
import logger from '../../logger.config.mjs';
import { AuthResult } from '@/config/pi';
import { onIncompletePaymentFound } from '@/config/payment';

interface IAppContextProps {
  authUser: AuthUserType | null;
  setAuthUser: React.Dispatch<SetStateAction<AuthUserType | null>>;
  autoLoginUser: () => void;
  isSigningInUser: boolean;
  reload: boolean;
  alertMessage: string | null;
  setAlertMessage: React.Dispatch<SetStateAction<string | null>>;
  showAlert: (message: string) => void;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const initialState: IAppContextProps = {
  authUser: null,
  setAuthUser: () => {},
  autoLoginUser: () => {},
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
  const router = useRouter();
  
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isSigningInUser, setIsSigningInUser] = useState(false);
  const [reload, setReload] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
        setIsSigningInUser(true);
        const pioneerAuth: AuthResult = await window.Pi.authenticate([
          'username', 
          'payments', 
          'wallet_address'
        ], onIncompletePaymentFound);

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
      }
    } catch (error) {
      logger.error('Auto login unresolved; attempting Pi SDK authentication:', error);
      await registerUser();
    } finally {
      setTimeout(() => setIsSigningInUser(false), 2500);
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

  useEffect(() => {
    logger.info('AppContextProvider mounted.');
    if (isSigningInUser || authUser) return
    // autoLoginUser();

    // attempt to load and initialize Pi SDK in parallel
    loadPiSdk()
      .then(Pi => {
        Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });
        return Pi.nativeFeaturesList();
      })
      .catch(err => logger.error('Pi SDK load/ init error:', err));
  }, []);


  return (
    <AppContext.Provider value={{ authUser, setAuthUser, isSigningInUser, reload, setReload, showAlert, alertMessage, setAlertMessage, autoLoginUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
