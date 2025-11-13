'use client';
import { styles } from "@/constant";
import React, { SetStateAction, useEffect, useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { IoHomeOutline } from "react-icons/io5";
interface PasswordInputProps {
    password: string, 
    setPassword: React.Dispatch<SetStateAction<string>>,
    name: string
}

export const PasswordInput = ({password, setPassword, name}:PasswordInputProps )=> {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
        <label htmlFor="password" className="block text-green font-medium mb-1">Password</label>
        <div className="flex items-center">
            <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                name={name}
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
interface ListItem {
  title: string;
  value: string;
}

interface SelectButtonProps<T> {
  label?: string;
  list: ListItem[];
  setValue: React.Dispatch<React.SetStateAction<T>>;
  value: string;
  name: string;
}

export function SelectButton<T extends string>({
  label,
  list,
  setValue,
  value,
  name,
}: SelectButtonProps<T>) {

  return (
    <>
    {label && <h3 className={styles.H2}>{label}</h3>}
    <div className="space-x-4 space-y-5 text-sm overflow-x-auto whitespace-nowrap">
      {list &&
        list.map((item, index) => (
          <button
            key={index}
            name={name}
            className={`px-6 py-3 shadow-md rounded-md ${
              value === item.value ? "bg-green text-white" : "card-bg"
            }`}
            onClick={() => setValue(item.value as T)}
          >
            {item.title}
          </button>
        ))}
    </div>
    </>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  ...props
}) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

interface SliderProps {
  defaultValue: [number, number];
  max: number;
  step?: number;
  className?: string;
  onChange?: (value: [number, number]) => void;
}

export const Slider: React.FC<SliderProps> = ({
  defaultValue,
  max,
  step = 1,
  className,
  onChange,
}) => {
  const [value, setValue] = React.useState<[number, number]>(defaultValue);

  const handleChange = (idx: number, val: number) => {
    const newValue: [number, number] = idx === 0 ? [val, value[1]] : [value[0], val];
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={className}>
      <div className="flex space-x-2 items-center">
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={value[0]}
          onChange={e => handleChange(0, Number(e.target.value))}
          className="flex-1"
        />
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={value[1]}
          onChange={e => handleChange(1, Number(e.target.value))}
          className="flex-1"
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>₦{value[0].toLocaleString()}</span>
        <span>₦{value[1].toLocaleString()}</span>
      </div>
    </div>
  );
};