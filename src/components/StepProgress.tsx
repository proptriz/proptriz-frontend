import type { WizardStep } from "../types/property";

// ─────────────────────────────────────────────────────────────────────────────
// The AI "step" is a pseudo-step inserted before Step 1.
// When the user taps "List with AI" they are on step "ai".
// Steps 1–3 are unchanged; the progress bar just shows the AI step when active.
// ─────────────────────────────────────────────────────────────────────────────

type StepView = WizardStep | "ai";

const NORMAL_STEPS = [
  { label: "Basics",  number: 1 as WizardStep },
  { label: "Details", number: 2 as WizardStep },
  { label: "Preview", number: 3 as WizardStep },
];

const AI_STEPS = [
  { label: "AI",      number: "ai" as const    },
  { label: "Basics",  number: 1  as WizardStep },
  { label: "Details", number: 2  as WizardStep },
  { label: "Preview", number: 3  as WizardStep },
];

interface StepProgressProps {
  currentStep: StepView;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  // Show 4 steps while in (or past) the AI step; 3 steps for the manual flow
  const steps = currentStep === "ai" ? AI_STEPS : NORMAL_STEPS;

  return (
    <div className="flex items-center px-5 pb-5">
      {steps.map((step, idx) => {
        const isAiStep = step.number === "ai";

        // Determine done / active state
        const isDone =
          isAiStep
            ? currentStep !== "ai"                   // AI step is done once user advances
            : typeof currentStep === "number" &&
              typeof step.number === "number" &&
              step.number < currentStep;

        const isActive = step.number === currentStep;

        return (
          <div key={String(step.number)} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Step circle */}
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300
                  ${!isDone &&  isActive  ? "bg-white text-[#1e5f74]"   : ""}
                  ${!isDone && !isActive  ? "bg-white/20 text-white/60" : ""}
                `}
                style={isDone ? { background: "#f0a500", color: "#143d4d" } : undefined}
              >
                {isDone ? "✓" : isAiStep ? (
                  // Sparkle icon for the AI step
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
                      fill={isActive ? "#1e5f74" : "currentColor"} />
                  </svg>
                ) : step.number}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-semibold whitespace-nowrap
                  ${isActive ? "text-white" : "text-white/55"}`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < steps.length - 1 && (
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