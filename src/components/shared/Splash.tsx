import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContextProvider";
import { SubmitButton } from "@/components/shared/buttons";

export default function Splash() {
  const { authUser, isSigningInUser, registerUser } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center justify-start h-screen pt-24 gap-3">
      <Image src="/splash.png" alt="EscrowPi" width={180} height={180} priority />
      <SubmitButton 
      isLoading={isSigningInUser} 
      onClick={()=>registerUser()}
      />
    </div>
  );
}