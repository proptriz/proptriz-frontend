import type { WizardStep } from "../types/property";

interface StepConfig {
  label: string;
  number: number;
}

const STEPS: StepConfig[] = [
  { label: "Basics", number: 1 },
  { label: "Details", number: 2 },
  { label: "Preview", number: 3 },
];

interface StepProgressProps {
  currentStep: WizardStep;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center px-5 pb-4 bg-[#1a7a4a]">
      {STEPS.map((step, idx) => {
        const isDone = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isDone
                    ? "bg-[#f5a623] text-[#111]"
                    : isActive
                    ? "bg-white text-[#1a7a4a]"
                    : "bg-white/25 text-white"
                }`}
              >
                {isDone ? "✓" : step.number}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isActive ? "text-white font-semibold" : "text-white/70"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                  isDone ? "bg-[#f5a623]" : "bg-white/25"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
