import React from "react";

interface CounterProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const Counter: React.FC<CounterProps> = ({
  label,
  value,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex justify-between items-center my-3">
      <span className="text-lg font-semibold">{label}</span>
      <div className="flex items-center">
        <button
          className="bg-gray-200 px-3 py-1 rounded-md"
          onClick={onDecrement}
        >
          -
        </button>
        <span className="mx-4 text-lg">{value}</span>
        <button
          className="bg-gray-200 px-3 py-1 rounded-md"
          onClick={onIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
