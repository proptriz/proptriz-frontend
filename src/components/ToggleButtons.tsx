import React from "react";

interface ToggleProps {
  selected: string;
  options: string[];
  onChange: (value: string) => void;
}

const ToggleButtons: React.FC<ToggleProps> = ({
  selected,
  options,
  onChange,
}) => {
  return (
    <div className="flex space-x-2 my-4">
      {options.map((option) => (
        <button
          key={option}
          className={`px-4 py-2 rounded-md text-sm ${
            selected === option
              ? "bg-green text-white"
              : "card-bg"
          }`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButtons;
