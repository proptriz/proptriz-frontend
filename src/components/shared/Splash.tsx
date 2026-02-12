import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContextProvider";
import { SubmitButton } from "@/components/shared/buttons";
import Footer from "./Footer";
import GoogleLoginButton from "../GoogleLoginButton";

export default function Splash({showFooter=false}: {showFooter?: boolean}) {
  const { isSigningInUser, authenticateUser, loginStage} = useContext(AppContext);
  return (
  <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-100">
    <main className="flex-grow flex items-center justify-center p-4">
      {isSigningInUser ? <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <Image 
              src="/splash.png" 
              alt="Proptriz" 
              width={150} 
              height={150} 
              loading="eager" 
              className={`transition-all duration-700 ease-in-out ${
                isSigningInUser ? "animate-pulse scale-90" : "hover:scale-110"
              }`}
            />
          </div>
          
          <p className="text-sm text-slate-800 tracking-tight text-center">
            Signing you in...
          </p>
          
          {loginStage && (
             <span className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wide">
                {loginStage}
             </span>
          )}
        </div> : 
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 animate-in fade-in zoom-in duration-500">
          
          {/* Branding Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <Image 
                src="/logo.png" 
                alt="Proptriz" 
                width={100} 
                height={100} 
                loading="eager" 
                className={`transition-all duration-700 ease-in-out ${
                  isSigningInUser ? "animate-pulse scale-90" : "hover:scale-110"
                }`}
              />
            </div>
            
            {/* <h1 className="text-xl text-slate-800 tracking-tight text-center">
              {isSigningInUser ? "Signing you in..." : "Welcome to Proptriz"}
            </h1> */}
            
            {loginStage && (
              <span className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wide">
                  {loginStage}
              </span>
            )}
          </div>

          {/* Login Actions */}
          <div className="space-y-5">
            {/* Method 1: Google */}
            <div className="flex justify-center w-full transform transition-all active:scale-95">
              <GoogleLoginButton />
            </div>

            {/* Elegant Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">OR</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Method 2: Pi Network (Emphasized) */}
            <div className="relative group overflow-hidden rounded-2xl border-2 border-purple-100 bg-purple-50/30 p-5 transition-all hover:border-purple-200">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-wider">Required: Pi Browser</p>
                </div>

                <p className="text-sm text-slate-600 leading-tight">
                  To use your Pi Wallet and Identity, you <strong>must</strong> be browsing within the <strong>Pi Browser</strong> app.
                </p>

                {/* Branded Pi Network Login Button */}
                <button
                  onClick={() => authenticateUser()}
                  disabled={isSigningInUser}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg
                            bg-[#8a348e] hover:bg-[#702a74]
                            text-white font-semibold text-sm
                            shadow-lg transition-all duration-200
                            active:scale-[0.98] disabled:opacity-70"
                >
                <Image
                src="/pi_logo.png"
                alt="Pi Network"
                width={24}
                height={24}
              />

                {isSigningInUser ? "Connecting to Pi..." : "Continue with Pi Network"}
              </button>


              </div>
            </div>
          </div>

          {/* Support Link */}
          <p className="mt-8 text-center text-xs text-slate-400">
            Trouble signing in? <span className="text-indigo-500 font-medium cursor-pointer hover:underline">Get Help</span>
          </p>
        </div>
      }
    </main>

    {showFooter && (
      <footer className="pb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Footer />
      </footer>
    )}
  </div>
);
}