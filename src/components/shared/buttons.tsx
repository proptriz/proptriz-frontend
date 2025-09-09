'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoChevronBack } from "react-icons/io5";



export const BackButton = ()=> {
    const router = useRouter();

    return (
        <button className="top-5 left-0 text-xl" onClick={()=>router.back()}>
            <FaArrowLeft className="text-xl" />
        </button>
    )
}

export const Button = (isLoading:boolean)=> {
  const router = useRouter();

  return (
    <button
    type="submit"
    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {isLoading ? 
      <span className='flex items-center justify-center'>
        <ImSpinner2 className="animate-spin mr-2 ml-1" /> {/* Spinner Icon */}
          Login...
      </span> : "Login"
      }
    </button>
  )
}

import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "toggle";
  active?: boolean; // for toggle buttons like Buy/Rent
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = "primary",
  active = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none";

  const variants = {
    primary:
      "bg-estate-primary text-white hover:bg-estate-primary/90 border border-estate-primary",
    outline:
      "border border-estate-secondary text-estate-primary bg-white hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    toggle: active
      ? "bg-estate-primary text-white border border-estate-primary"
      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      {...props}
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
