'use client';
import React, { SetStateAction, useEffect, useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { IoHomeOutline } from "react-icons/io5";
interface PasswordInputProps {
    password: string, 
    setPassword: React.Dispatch<SetStateAction<string>>,
}

export const PasswordInput = ({password, setPassword}:PasswordInputProps )=> {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
        <label htmlFor="password" className="block text-green font-medium mb-1">Password</label>
        <div className="flex items-center">
            <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-green-600 bg-transparent"
            />
        </div>
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 text-gray-500 focus:outline-none"
        >
            {showPassword ? <ImEye /> : <ImEyeBlocked />}
        </button>
        </>
    )
}

interface EmailInputProps {
    email: string, 
    setEmail: React.Dispatch<SetStateAction<string>>,
}
export const EmailInput = (props:any )=> {

    return (
        <>
        <div className="mb-4">
            {props.label && <label htmlFor="email" className="block text-sm text-green font-medium mb-1">{props.label}</label>}
            <input
                type="email"
                id="email"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-green-600 bg-transparent"
            />
        </div>
        </>
    )
}

export const TextInput = (props:any )=> {

    return (
        <>
        <div className="mb-4">
            {props.label && <label htmlFor="text" className="block text-green font-medium mb-1">{props.label}</label>}
            <input
                type="text"
                id="text"
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
                required
                className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-green-600 bg-transparent"
            />
        </div>
        </>
    )
}
interface ListItem {
  title: string;
  value: string;
}

export const SelectButton: React.FC<{
  list: ListItem[];
  setValue: (value: string) => void;
  name: string;
}> = ({ list, setValue, name }) => {
  const [selectedValue, setSelectedValue] = useState<string>(list[0]?.value || "");

  useEffect(() => {
    // Set the default value as the first item's value
    setValue(selectedValue);
  }, [selectedValue, setValue]);

  const handleSelection = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="space-x-4 space-y-5 text-sm">
      {list &&
        list.map((item, index) => (
          <button
            key={index}
            name={name}
            className={`px-6 py-3 shadow-md rounded-md ${
              selectedValue === item.value ? "bg-green text-white" : "card-bg"
            }`}
            onClick={() => handleSelection(item.value)}
          >
            {item.title}
          </button>
        ))}
    </div>
  );
};


