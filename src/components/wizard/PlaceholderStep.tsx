import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import type { WizardStepId } from "@/types/wizard";

interface PlaceholderStepProps {
  step: WizardStepId;
  eyebrow: string;
  title: string;
  description: string;
}

export function PlaceholderStep({ step, eyebrow, title, description }: PlaceholderStepProps) {
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);

  return (
    <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold tracking-wide text-brand">
          STEP {step} OF 7
        </span>
        <span className="text-sm text-muted-foreground">• {eyebrow}</span>
      </div>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
        <p className="text-sm font-medium text-foreground">This step is coming next</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The layout is ready — content for this step will be added here.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep((step - 1) as WizardStepId)}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        {step < 7 && (
          <button
            type="button"
            onClick={() => setCurrentStep((step + 1) as WizardStepId)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
