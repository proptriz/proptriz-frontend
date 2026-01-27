import { useState } from "react";
import { normalizePhone } from "@/utils/normalizePhone";

export const PhoneInput = (props: any) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const normalized = normalizePhone(value);

    if (!normalized) {
      setError("Enter a valid phone number");
    } else {
      setError(null);
    }

    // Pass raw value upward (or normalized if you prefer)
    props.onChange?.({
      ...e,
      target: {
        ...e.target,
        value,
        normalizedPhone: normalized,
      },
    });
  };

  return (
    <div className="w-full">
      {props.label && (
        <label className="block text-[17px] mb-1" htmlFor={props.id}>
          {props.label}
        </label>
      )}

      <div
        className={`
          flex items-center p-[10px] w-full rounded-md border-[2px]
          bg-gray-100
          transition-colors
          ${
            error
              ? "border-red-500 focus-within:border-red-500"
              : "border-primary focus-within:border-secondary focus-within:bg-white"
          }
        `}
      >
        <input
          type="tel"
          id={props.id}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder ?? "+2348012345678"}
          onChange={handleChange}
          required={props.required ?? true}
          className="flex-1 outline-none bg-transparent"
        />

        {props.icon && (
          <span className="text-gray-500 ms-auto">{props.icon}</span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};