import { ArrowLeft, ArrowRight, Info, Lock, ShieldCheck } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";

/** Icon exported from the Figma design (icon(2).svg), inlined so it inherits currentColor. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.16667}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7.58334 1.16666C8.97573 1.16666 10.3111 1.71978 11.2957 2.70435C12.2802 3.68891 12.8333 5.02427 12.8333 6.41666" />
      <path d="M7.58334 3.5C8.35689 3.5 9.09876 3.80729 9.64574 4.35427C10.1927 4.90125 10.5 5.64312 10.5 6.41667" />
      <path d="M8.06866 9.66466C8.18913 9.71998 8.32486 9.73262 8.45348 9.7005C8.5821 9.66837 8.69593 9.59339 8.77624 9.48791L8.98332 9.21666C9.09199 9.07176 9.23291 8.95416 9.39491 8.87316C9.55691 8.79216 9.73554 8.74999 9.91666 8.74999H11.6667C11.9761 8.74999 12.2728 8.87291 12.4916 9.0917C12.7104 9.31049 12.8333 9.60724 12.8333 9.91666V11.6667C12.8333 11.9761 12.7104 12.2728 12.4916 12.4916C12.2728 12.7104 11.9761 12.8333 11.6667 12.8333C8.88188 12.8333 6.21117 11.7271 4.24204 9.75794C2.2729 7.78881 1.16666 5.1181 1.16666 2.33332C1.16666 2.0239 1.28957 1.72716 1.50837 1.50837C1.72716 1.28957 2.0239 1.16666 2.33332 1.16666H4.08332C4.39274 1.16666 4.68949 1.28957 4.90828 1.50837C5.12707 1.72716 5.24999 2.0239 5.24999 2.33332V4.08332C5.24999 4.26444 5.20782 4.44307 5.12682 4.60507C5.04582 4.76707 4.92822 4.90799 4.78332 5.01666L4.51032 5.22141C4.40323 5.30318 4.32775 5.4195 4.2967 5.55061C4.26565 5.68172 4.28095 5.81954 4.33999 5.94066C5.13722 7.55991 6.4484 8.86945 8.06866 9.66466Z" />
    </svg>
  );
}

const NEXT_STEPS = [
  "Connect your WhatsApp Business account via Meta dialog",
  "Select your business profile or Meta Business Manager",
  "Choose the phone number you want your AI employee to use",
  "Give us permission to manage conversations automatically",
];

export function Step2WhatsApp() {
  const isWhatsappConnected = useWizardStore((s) => s.isWhatsappConnected);
  const updateWizardData = useWizardStore((s) => s.updateWizardData);
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);

  return (
    <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-brand-border bg-brand-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand">
          Step 2 of 7
        </span>
        <span className="text-xs text-muted-foreground">• Communications Channel</span>
      </div>

      <h1 className="mt-1.5 text-3xl font-bold leading-tight tracking-tight text-foreground">
        Connect your WhatsApp
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Connect your business WhatsApp so your AI agent can respond to customer conversations.
      </p>

      <div className="mt-6 space-y-6 border-t border-border pt-6">
        {/* Account connection */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <WhatsAppGlyph className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  WhatsApp Business Account
                </h2>
                <span
                  className={
                    isWhatsappConnected
                      ? "rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand"
                      : "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {isWhatsappConnected ? "Connected" : "Not Connected"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Meta Cloud API v19.0 Official Sandbox &amp; Production
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => updateWizardData({ isWhatsappConnected: true })}
            disabled={isWhatsappConnected}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            {isWhatsappConnected ? "WhatsApp Connected" : "Connect WhatsApp"}
          </button>
        </div>

        {/* Control note */}
        <div className="rounded-2xl border border-border bg-secondary/60 p-5">
          <p className="flex items-center gap-2 text-base font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-brand" />
            Your account stays in your control.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We use Meta&apos;s official WhatsApp Business Platform to securely connect your business
            account. We never send messages without your explicit parameters and rules.
          </p>
        </div>

        {/* What happens next */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-foreground">
            <Info className="h-4 w-4 text-muted-foreground" />
            What happens next?
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {NEXT_STEPS.map((text, index) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-lg bg-secondary/60 p-3.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                  {index + 1}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4 text-sm">
            <Lock className="h-4 w-4 text-brand" />
            <span className="font-semibold text-foreground">Security note:</span>
            <span className="text-muted-foreground">We never need your WhatsApp password.</span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            I&apos;ll do this later
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
