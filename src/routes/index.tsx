import { createFileRoute } from "@tanstack/react-router";
import { AIEmployeeSummary } from "@/components/common/AIEmployeeSummary";
import { StepProgressStepper } from "@/components/common/StepProgressStepper";
import { TopNavbar } from "@/components/common/TopNavbar";
import { Step1Business } from "@/components/wizard/Step1Business";
import { Step2WhatsApp } from "@/components/wizard/Step2WhatsApp";
import { Step3Knowledge } from "@/components/wizard/Step3Knowledge";
import { Step4Products } from "@/components/wizard/Step4Products";
import { Step5Configure } from "@/components/wizard/Step5Configure";
import { Step6Test } from "@/components/wizard/Step6Test";
import { Step7Activate } from "@/components/wizard/Step7Activate";
import { useWizardStore } from "@/store/useWizardStore";

const title = "WizeAgent — WhatsApp Sales & Support AI Setup Wizard";
const description =
  "Set up your WizeAgent AI employee for WhatsApp sales and support in 7 guided steps: business, channel, knowledge, catalog, tone, testing and activation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingLayout,
});

function StepContent() {
  const currentStep = useWizardStore((s) => s.currentStep);

  switch (currentStep) {
    case 1:
      return <Step1Business />;
    case 2:
      return <Step2WhatsApp />;
    case 3:
      return <Step3Knowledge />;
    case 4:
      return <Step4Products />;
    case 5:
      return <Step5Configure />;
    case 6:
      return <Step6Test />;
    case 7:
      return <Step7Activate />;
    default:
      return <Step1Business />;
  }
}

function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-canvas font-sans">
      <TopNavbar />

      <main className="mx-auto max-w-7xl px-8 py-8">
        <StepProgressStepper />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <StepContent />
          </div>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <AIEmployeeSummary />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-secondary/40 px-8 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">WizeAgent</span> • Meta Official WhatsApp
            Business Cloud API Architecture
          </p>
          <p className="italic">
            &ldquo;I&apos;m setting up my AI employee. Not a complicated technical chatbot.&rdquo;
          </p>
        </div>
      </footer>
    </div>
  );
}
