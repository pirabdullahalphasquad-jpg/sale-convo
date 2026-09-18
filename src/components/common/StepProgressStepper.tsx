import {
  BookOpen,
  Building2,
  Check,
  MessageSquare,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import type { WizardStepId } from "@/types/wizard";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clipWhatsApp)">
        <path
          d="M7.58334 1.16666C8.97573 1.16666 10.3111 1.71978 11.2957 2.70435C12.2802 3.68891 12.8333 5.02427 12.8333 6.41666"
          stroke="currentColor"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.58334 3.5C8.35689 3.5 9.09876 3.80729 9.64574 4.35427C10.1927 4.90125 10.5 5.64312 10.5 6.41667"
          stroke="currentColor"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.06866 9.66466C8.18913 9.71998 8.32486 9.73262 8.45348 9.7005C8.5821 9.66837 8.69593 9.59339 8.77624 9.48791L8.98332 9.21666C9.09199 9.07176 9.23291 8.95416 9.39491 8.87316C9.55691 8.79216 9.73554 8.74999 9.91666 8.74999H11.6667C11.9761 8.74999 12.2728 8.87291 12.4916 9.0917C12.7104 9.31049 12.8333 9.60724 12.8333 9.91666V11.6667C12.8333 11.9761 12.7104 12.2728 12.4916 12.4916C12.2728 12.7104 11.9761 12.8333 11.6667 12.8333C8.88188 12.8333 6.21117 11.7271 4.24204 9.75794C2.2729 7.78881 1.16666 5.1181 1.16666 2.33332C1.16666 2.0239 1.28957 1.72716 1.50837 1.50837C1.72716 1.28957 2.0239 1.16666 2.33332 1.16666H4.08332C4.39274 1.16666 4.68949 1.28957 4.90828 1.50837C5.12707 1.72716 5.24999 2.0239 5.24999 2.33332V4.08332C5.24999 4.26444 5.20782 4.44307 5.12682 4.60507C5.04582 4.76707 4.92822 4.90799 4.78332 5.01666L4.51032 5.22141C4.40323 5.30318 4.32775 5.4195 4.2967 5.55061C4.26565 5.68172 4.28095 5.81954 4.33999 5.94066C5.13722 7.55991 6.4484 8.86945 8.06866 9.66466Z"
          stroke="currentColor"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clipWhatsApp">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ProductsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.33333 5.83334C9.33333 6.45218 9.0875 7.04567 8.64992 7.48326C8.21233 7.92084 7.61884 8.16668 7 8.16668C6.38116 8.16668 5.78767 7.92084 5.35009 7.48326C4.9125 7.04567 4.66667 6.45218 4.66667 5.83334"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.81008 3.51984H12.1899"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.98333 3.18907C1.83187 3.39102 1.75 3.63664 1.75 3.88907V11.6667C1.75 11.9761 1.87292 12.2728 2.09171 12.4916C2.3105 12.7104 2.60725 12.8333 2.91667 12.8333H11.0833C11.3928 12.8333 11.6895 12.7104 11.9083 12.4916C12.1271 12.2728 12.25 11.9761 12.25 11.6667V3.88907C12.25 3.63664 12.1681 3.39102 12.0167 3.18907L10.85 1.63332C10.7413 1.48843 10.6004 1.37082 10.4384 1.28982C10.2764 1.20883 10.0978 1.16666 9.91667 1.16666H4.08333C3.90221 1.16666 3.72358 1.20883 3.56158 1.28982C3.39959 1.37082 3.25867 1.48843 3.15 1.63332L1.98333 3.18907Z"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConfigureIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.83334 4.66666H8.16667"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12.25V7"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 4.66667V1.75"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.91666 9.33334H12.25"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0833 7V1.75"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0833 12.25V9.33334"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.75 8.16666H4.08333"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.91666 5.83333V1.75"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.91666 12.25V8.16666"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StepIcon = LucideIcon | React.ComponentType<{ className?: string }>;

const STEPS: { id: WizardStepId; label: string; icon: StepIcon }[] = [
  { id: 1, label: "Business", icon: Building2 },
  { id: 2, label: "WhatsApp", icon: WhatsAppIcon },
  { id: 3, label: "Knowledge", icon: BookOpen },
  { id: 4, label: "Products", icon: ProductsIcon },
  { id: 5, label: "Configure", icon: ConfigureIcon },
  { id: 6, label: "Test", icon: MessageSquare },
  { id: 7, label: "Activate", icon: Rocket },
];

export function StepProgressStepper() {
  const currentStep = useWizardStore((s) => s.currentStep);
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);
  const percent = Math.round(((currentStep - 1) / 7) * 100);

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground">
            PROGRESS
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-foreground">
            Step {currentStep} of 7
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{percent}% completed</span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-3">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          const Icon = isDone ? Check : step.icon;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className="group flex flex-col items-start gap-3 text-left"
            >
              <span className="flex items-center gap-2">
                <span
                  className={
                    isActive || isDone
                      ? "flex h-6 w-6 items-center justify-center rounded-md bg-brand text-brand-foreground"
                      : "flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-muted-foreground"
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span
                  className={
                    isActive
                      ? "text-sm font-bold text-foreground"
                      : isDone
                        ? "text-sm font-medium text-foreground"
                        : "text-sm font-medium text-muted-foreground"
                  }
                >
                  {step.label}
                </span>
              </span>
              <span
                className={
                  isActive || isDone
                    ? "h-1 w-full rounded-full bg-brand"
                    : "h-1 w-full rounded-full bg-secondary"
                }
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
