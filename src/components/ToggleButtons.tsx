import { styles } from "@/constant";
import React from "react";

interface ToggleProps<T> {
  label?:string;
  selected: T;
  options: T[];
  onChange: React.Dispatch<React.SetStateAction<T>>;
}

function ToggleButtons<T extends string>({label, selected, options, onChange }: ToggleProps<T>) {
  return (
    <>
    {label && <h3 className={styles.H2}>{label}</h3>}
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`px-4 py-2 rounded-md text-sm ${
            selected === option ? "bg-green text-white" : "card-bg"
          }`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
    </>
  );
}

export default ToggleButtons;
