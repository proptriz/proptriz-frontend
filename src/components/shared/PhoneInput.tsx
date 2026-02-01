import { useCallback, useRef, useState } from "react";
import { normalizePhone, formatPhone } from "@/utils/normalizePhone";

type PhoneInputProps = {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
  onNormalize?: (normalized: string | null) => void;
};

export const PhoneInput = ({
  id,
  name,
  label,
  value,
  placeholder = "+234 801 234 5678",
  required,
  onChange,
  onNormalize,
}: PhoneInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const cursor = input.selectionStart ?? input.value.length;

      const formatted = formatPhone(input.value);
      const normalized = normalizePhone(formatted);

      setError(normalized ? null : "Enter a valid phone number");

      onChange(formatted);
      onNormalize?.(normalized);

      // Restore cursor position after formatting
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(cursor, cursor);
      });
    },
    [onChange, onNormalize]
  );

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[17px] mb-1">
          {label}
        </label>
      )}

      <div
        className={`
          flex items-center p-[10px] w-full rounded-md border-[2px]
          bg-gray-100 transition-colors
          ${
            error
              ? "border-red-500"
              : "border-primary focus-within:border-secondary focus-within:bg-white"
          }
        `}
      >
        <input
          ref={inputRef}
          type="tel"
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={handleChange}
          className="flex-1 bg-transparent outline-none"
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
