"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import { handleSignOut, login } from "@/utils/actions";
import { Skeleton } from "@/components/ui/skeleton";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  signIn: (credentials: FormData) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  const signIn = async (formData: FormData) => {
    await login("credentials", formData);
  };

  const signOut = () => {
    handleSignOut();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto space-y-6 p-6 bg-white rounded-lg shadow-lg">
          <div className="space-y-2 text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
