import { Bot, CircleHelp, Sparkles, Home } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";

export function TopNavbar() {
  const currentStep = useWizardStore((s) => s.currentStep);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-8 py-3.5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-sm">
              <Bot className="h-5 w-5 text-brand-foreground" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-foreground">
                  WizeAgent
                </span>
                <span className="rounded border border-brand-border/60 bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-brand">
                  AI EMPLOYEE
                </span>
              </div>
              <span className="text-xs text-muted-foreground">WhatsApp Sales &amp; Support</span>
            </div>
          </div>

          <div className="ml-2 hidden items-center gap-3 border-l border-border pl-4 text-sm text-muted-foreground md:flex">
            <span>Onboarding</span>
            <span className="text-border">/</span>
            <span className="rounded-full border border-brand-border/60 bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
              Step {currentStep} of 7
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border bg-secondary/60 p-1">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Product Story
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-brand" />
              Setup Wizard
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <CircleHelp className="h-4 w-4" />
            Need help?
          </button>
        </div>
      </div>
    </header>
  );
}
