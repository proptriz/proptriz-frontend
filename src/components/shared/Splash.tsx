import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContextProvider";
import { SubmitButton } from "@/components/shared/buttons";
import Footer from "./Footer";
import GoogleLoginButton from "../GoogleLoginButton";

export default function Splash() {
  const { isSigningInUser, authenticateUser, loginStage} = useContext(AppContext);
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <Image 
        src="/splash.png" 
        alt="EscrowPi" 
        width={180} 
        height={180} 
        loading="eager" 
        className={`transition-transform duration-500 ease-in-out ${
          isSigningInUser 
            ? "animate-spin scale-110" 
            : "hover:scale-105"
        }`}
      />
      <SubmitButton 
      title="Login with Pi browser"
      isLoading={isSigningInUser} 
      disabled={isSigningInUser}
      onClick={()=>{authenticateUser()}}
      />
      <p className="text-primary">{loginStage}</p>

      <GoogleLoginButton />
    </div>
    
    <Footer />
    </>
  );
}