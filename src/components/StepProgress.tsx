import type { WizardStep } from "../types/property";

const STEPS = [
  { label: "Basics",  number: 1 },
  { label: "Details", number: 2 },
  { label: "Preview", number: 3 },
];

export default function StepProgress({ currentStep }: { currentStep: WizardStep }) {
  return (
    <div className="flex items-center px-5 pb-5">
      {STEPS.map((step, idx) => {
        const isDone   = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Step circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center
                             text-xs font-bold transition-all duration-300
                             ${!isDone && isActive  ? "bg-white text-[#1e5f74]"   : ""}
                             ${!isDone && !isActive ? "bg-white/20 text-white/60" : ""}`}
                style={isDone ? { background: "#f0a500", color: "#143d4d" } : undefined}
              >
                {isDone ? "✓" : step.number}
              </div>
              {/* Label */}
              <span className={`text-[11px] font-semibold whitespace-nowrap
                                ${isActive ? "text-white" : "text-white/55"}`}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className="flex-1 h-[2px] mx-3 rounded-full transition-all duration-300 bg-white/20"
                style={isDone ? { background: "#f0a500" } : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}