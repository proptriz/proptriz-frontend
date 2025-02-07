"use client";

import 'react-toastify/dist/ReactToastify.css';

import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useEffect
} from 'react';
import { useRouter } from "next/navigation";
import axiosClient, {setAuthToken} from '@/config/client';
import { UserType } from '../src/definitions';
import { toast } from 'react-toastify';


interface IAppContextProps {
  authUser: UserType | null;
  setAuthUser: React.Dispatch<SetStateAction<UserType | null>>;
  isSigningInUser: boolean;
  reload: boolean;
  alertMessage: string | null;
  setAlertMessage: React.Dispatch<SetStateAction<string | null>>;
  showAlert: (message: string) => void;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  authenticateUser: () => void;
}

const initialState: IAppContextProps = {
  authUser: null,
  setAuthUser: () => {},
  isSigningInUser: false,
  reload: false,
  alertMessage: null,
  setAlertMessage: () => {},
  showAlert: () => {},
  setReload: () => {},
  authenticateUser: () => {}
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const router = useRouter();
  
  const [authUser, setAuthUser] = useState<UserType | null>(null);
  const [isSigningInUser, setIsSigningInUser] = useState(false);
  const [reload, setReload] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
  };

  const authenticateUser = async () => {
    if (!authUser) {
      toast.warn("user not login");
      return router.push("/profile/login")
    }
    return authUser
  };

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, isSigningInUser, reload, setReload, showAlert, alertMessage, setAlertMessage, authenticateUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
