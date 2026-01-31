'use client';
import { styles } from "@/constant";
import React, { SetStateAction, useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

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
export const EmailInput = (props:any )=> {
  return (
    <>
      <div className="w-full">
        {props.label && (
          <label className="block text-[17px] mb-1" htmlFor={props.id}>
            {props.label}
          </label>
        )}

        <div
          className="
            flex items-center p-[10px] w-full rounded-md border-[1px]
            bg-gray-100 border-primary
            focus-within:border-secondary
            focus-within:bg-white
            transition-colors
          "
        >
          <input
            type="email"
            id={props.id}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            required={props.required ?? true}
            className="flex-1 outline-none bg-transparent"
          />

          {props.icon && (
            <span className="text-gray-500 ms-auto">
              {props.icon}
            </span>
          )}
        </div>
      </div>

    </>
  )
}

export const TextInput = (props:any )=> {
  return (
    <>
      <div className="w-full">
        {props.label && (
          <label className="block text-[17px] mb-1" htmlFor={props.id}>
            {props.label}
          </label>
        )}

        <div
          className="
            flex items-center p-[10px] w-full rounded-md border-[1px]
            bg-gray-100 border-primary
            focus-within:border-secondary
            focus-within:bg-white
            transition-colors
          "
        >
          <input
            type="text"
            id={props.id}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            required={props.required ?? true}
            className="flex-1 outline-none bg-transparent"
          />

          {props.icon && (
            <span className="text-gray-500 ms-auto">
              {props.icon}
            </span>
          )}
        </div>
      </div>

    </>
  )
}
export const PhoneInput = (props:any )=> {
  return (
    <>
      <div className="w-full">
        {props.label && (
          <label className="block text-[17px] mb-1" htmlFor={props.id}>
            {props.label}
          </label>
        )}

        <div
          className="
            flex items-center p-[10px] w-full rounded-md border-[2px]
            bg-gray-100 border-primary
            focus-within:border-secondary
            focus-within:bg-white
            transition-colors
          "
        >
          <input
            type="tel"
            id={props.id}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            required={props.required ?? true}
            className="flex-1 outline-none bg-transparent"
          />

          {props.icon && (
            <span className="text-gray-500 ms-auto">
              {props.icon}
            </span>
          )}
        </div>
      </div>

    </>
  )
}

export const TextareaInput = (props:any )=> {
  return (
    <>
      <div className="w-full">
        {props.label && (
          <label className="block text-[17px] mb-1" htmlFor={props.id}>
            {props.label}
          </label>
        )}

        <div
          className="
            flex items-center p-[10px] w-full rounded-md border-[1px]
            bg-gray-100 border-primary
            focus-within:border-secondary
            focus-within:bg-white
            transition-colors
          "
        >
          <textarea
            id={props.id}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            required={props.required ?? true}
            rows={4}
            className="
              flex-1
              outline-none
              bg-transparent
              resize-none
              overflow-y-auto
            "
          />

          {props.icon && (
            <span className="text-gray-500 ms-auto">
              {props.icon}
            </span>
          )}
        </div>
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
    {label && <label className={styles.H2}>{label}</label>}
    <div className="space-x-4 text-sm overflow-x-auto whitespace-nowrap">
      {list &&
        list.map((item, index) => (
          <button
            key={index}
            name={name}
            className={`px-4 py-2 shadow-md rounded-md ${
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
  value?: [number, number];              // controlled
  defaultValue?: [number, number];       // uncontrolled
  min?: number;
  max: number;
  step?: number;
  className?: string;
  onValueChange?: (value: [number, number]) => void;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  defaultValue = [0, 0],
  min = 0,
  max,
  step = 1,
  className,
  onValueChange,
}) => {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] =
    React.useState<[number, number]>(defaultValue);

  const currentValue = isControlled ? value! : internalValue;

  const updateValue = (next: [number, number]) => {
    // prevent crossover
    if (next[0] > next[1]) return;

    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const handleChange = (idx: 0 | 1, val: number) => {
    updateValue(
      idx === 0
        ? [val, currentValue[1]]
        : [currentValue[0], val]
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={(e) =>
            handleChange(0, Number(e.target.value))
          }
          className="flex-1 accent-estate-primary"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[1]}
          onChange={(e) =>
            handleChange(1, Number(e.target.value))
          }
          className="flex-1 accent-estate-primary"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>₦{currentValue[0].toLocaleString()}</span>
        <span>₦{currentValue[1].toLocaleString()}</span>
      </div>
    </div>
  );
};


export const SelectInput = (props: any) => {
  return (
    <div className="rounded-md">
      {props.label && (
        <label className="block text-[17px]">{props.label}</label>
      )}
      <select 
        name={props.name} 
        value={props.value}
        onChange={props.onChange} 
        className="p-[10px] bg-gray-50 block w-full rounded-md border-primary outline-0 bg-transparent border-[1px] focus:border-secondary focus:bg-white"
      >
        {props.options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};