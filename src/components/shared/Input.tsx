'use client';
import Image from "next/image";
import React, { SetStateAction, useEffect, useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { IoHomeOutline } from "react-icons/io5";
interface PasswordInputProps {
  password: string;
  setPassword: React.Dispatch<SetStateAction<string>>;
  name: string;
}

const getPasswordStrength = (password: string): string => {
  if (password.length === 0) {
    return '';
  } else if (password.length < 6) {
    return 'Weak';
  } else if (password.length < 10) {
    return 'Moderate';
  } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
    return 'Strong';
  } else {
    return 'Moderate';
  }
};

export const PasswordInput = ({ password, setPassword, name }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strength, setStrength] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(getPasswordStrength(value));
  };

  return (
    <>
      <label htmlFor="password" className="block text-green font-medium mb-1">Password</label>
      <div className="flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          name={name}
          onChange={handleChange}
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
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {strength && (
        <p className={`text-sm mt-1 ${strength === 'Weak' ? 'text-red-600' : strength === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}`}>
          Password strength: {strength}
        </p>
      )}
    </>
  );
};

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
                name={props.name}
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
                required
                className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-green-600 bg-transparent"
            />
        </div>
        </>
    )
}

export const UsernameInput = (props: any) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/\s/.test(value)) {
      setError('Invalid input: spaces are not allowed.');
      props.setIsValid(false)
    } else {
      setError(null);
      props.setIsValid(true)
    }
    props.setValue(value);
  };

  return (
    <div className="mb-4">
      {props.label && <label htmlFor="text" className="block text-green font-medium mb-1">{props.label}</label>}
      <input
        type="text"
        id="text"
        name={props.name}
        value={props.value}
        onChange={handleChange}
        required
        className={`w-full px-4 py-2 border-b ${error ? 'border-red-600 focus:border-red-600 ' : 'border-gray-700'} focus:outline-none focus:border-green-600 bg-transparent`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};
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

export const FileInput = (props: any) => {
  const isImageUploaded = props.imageUrl && props.imageUrl.trim() !== ""; // Check if an image has been uploaded
  const imageLabel = isImageUploaded ? props.label : 'upload pics';

  return (
    <div className="">
      {props.label && (
        <label className="block text-[17px] text-[#333333] font-bold">{imageLabel}</label>
      )}
      {props.describe && (
        <label className="block pb-3 text-sm text-gray-400">{props.describe}</label>
      )}
      <div className="flex flex-col items-center justify-center overflow-hidden p-3 rounded-md relative">
        <div className={`w-full ${props.height? props.height: 'h-[200px]'} relative mb-4`}>
          <Image
            src={isImageUploaded ? props.imageUrl : 'https://placehold.co/40'}
            alt="Upload image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain', maxHeight: '200px', maxWidth: '100%' }}
          />
        </div>
        {!props.hideCaption && !isImageUploaded && (
          <div className="text-center text-[#828282]">
            <div>
              Upload image
            </div>
            <span className="text-[11px] mt-1">
              image for profile pics
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className={`absolute scale-[5] opacity-0 cursor-pointer`}
          onChange={(e) => props.handleAddImage(e)}
        />
      </div>
    </div>
  );
};
