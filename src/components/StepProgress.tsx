import type { WizardStep } from "../types/property";
import { useLanguage } from "@/i18n/LanguageContext";

type StepView = WizardStep | "ai";

interface StepProgressProps {
  currentStep: StepView;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const { t } = useLanguage();

  const NORMAL_STEPS = [
    { label: t("add_step_basics"),  number: 1 as WizardStep },
    { label: t("add_step_details"), number: 2 as WizardStep },
    { label: t("add_step_preview"), number: 3 as WizardStep },
  ];

  const AI_STEPS = [
    { label: t("add_step_ai"),      number: "ai" as const    },
    { label: t("add_step_basics"),  number: 1  as WizardStep },
    { label: t("add_step_details"), number: 2  as WizardStep },
    { label: t("add_step_preview"), number: 3  as WizardStep },
  ];

  const steps = currentStep === "ai" ? AI_STEPS : NORMAL_STEPS;

  return (
    <div className="flex items-center px-5 pb-5">
      {steps.map((step, idx) => {
        const isAiStep = step.number === "ai";
        const isDone =
          isAiStep
            ? currentStep !== "ai"
            : typeof currentStep === "number" &&
              typeof step.number === "number" &&
              step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={String(step.number)} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300
                  ${!isDone &&  isActive  ? "bg-white text-[#1e5f74]"   : ""}
                  ${!isDone && !isActive  ? "bg-white/20 text-white/60" : ""}`}
                style={isDone ? { background: "#f0a500", color: "#143d4d" } : undefined}
              >
                {isDone ? "✓" : isAiStep ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
                      fill={isActive ? "#1e5f74" : "currentColor"} />
                  </svg>
                ) : step.number}
              </div>
              <span className={`text-[11px] font-semibold whitespace-nowrap
                ${isActive ? "text-white" : "text-white/55"}`}>
                {step.label}
              </span>
            </div>
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
