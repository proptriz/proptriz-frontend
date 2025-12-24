'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";

export const BackButton = ()=> {
  const router = useRouter();

  return (
    <button className="top-5 left-0 text-xl" onClick={()=>router.back()}>
      <FaArrowLeft className="text-xl" />
    </button>
  )
}

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "toggle";
  active?: boolean;
  fullWidth?: boolean;
  isLoading:boolean
}
export const SubmitButton:React.FC<SubmitButtonProps> = ({
  variant = "primary",
  active = false,
  fullWidth = false,
  isLoading=false,
  className,
  ...props
})=> {
  const router = useRouter();

  return (
    <button
    type="submit"
    {...props}
    className="bg-green-600 text-white p-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
import { Call3DIcon, GmailMinimalIcon, Text3DIcon, WhatsAppMinimalIcon } from "../Icons";

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

const ACTIONS = ({ phone, email }:{ phone: string; email: string }) => [
  {
    key: "call",
    href: `tel:${phone}`,
    Icon: Call3DIcon,
    label: "Call",
  },
  {
    key: "sms",
    href: `sms:${phone}`,
    Icon: Text3DIcon,
    label: "Text",
  },
  {
    key: "email",
    href: `mailto:${email}`,
    Icon: GmailMinimalIcon,
    label: "Email",
  },
  {
    key: "whatsapp",
    href: `https://wa.me/${String(phone).replace(/\D/g, "")}`,
    Icon: WhatsAppMinimalIcon,
    label: "WhatsApp",
  },
];

export const ContactActions = ({
  phone = "+2348012345678",
  email = "info@example.com",
}) => {
  return (
    <div className="ml-auto p-2 rounded-lg flex space-x-3">
      {ACTIONS({ phone, email }).map(({ key, href, Icon, label }) => (
        <a
          key={key}
          href={href}
          aria-label={label}
          className="p-2 rounded-lg hover:bg-gray-200 transition"
        >
          <Icon className="text-2xl hover:scale-110 transition-transform" />
        </a>
      ))}
    </div>
  );
};
