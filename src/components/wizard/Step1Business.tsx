import { ArrowRight, Sparkles } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import { BUSINESS_CATEGORIES } from "@/types/wizard";

export function Step1Business() {
  const businessName = useWizardStore((s) => s.businessName);
  const businessCategory = useWizardStore((s) => s.businessCategory);
  const businessDescription = useWizardStore((s) => s.businessDescription);
  const updateWizardData = useWizardStore((s) => s.updateWizardData);
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);

  return (
    <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-bold tracking-wide text-brand">
          STEP 1 OF 7
        </span>
        <span className="text-sm text-muted-foreground">• Business Foundation</span>
      </div>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground">
        Let&apos;s set up your business
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Tell us a little about your business. We&apos;ll use this information to help your AI agent
        understand who you are and how to help your customers.
      </p>

      <div className="mt-8 space-y-6 border-t border-border pt-8">
        <div>
          <label
            htmlFor="business-name"
            className="text-xs font-bold tracking-wide text-foreground"
          >
            BUSINESS NAME <span className="text-brand">*</span>
          </label>
          <input
            id="business-name"
            value={businessName}
            onChange={(e) => updateWizardData({ businessName: e.target.value })}
            placeholder="e.g. Urban Wear"
            className="mt-2 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
          />
        </div>

        <div>
          <label
            htmlFor="business-category"
            className="text-xs font-bold tracking-wide text-foreground"
          >
            BUSINESS CATEGORY <span className="text-brand">*</span>
          </label>
          <select
            id="business-category"
            value={businessCategory}
            onChange={(e) => updateWizardData({ businessCategory: e.target.value })}
            className="mt-2 h-12 w-full appearance-none rounded-xl border border-border bg-card bg-[length:16px] bg-[right_1rem_center] bg-no-repeat px-4 text-sm text-foreground outline-none transition-colors focus:border-brand"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">Select a category</option>
            {BUSINESS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="business-description"
              className="text-xs font-bold tracking-wide text-foreground"
            >
              BUSINESS DESCRIPTION
            </label>
            <span className="text-xs text-muted-foreground">Brief overview</span>
          </div>
          <textarea
            id="business-description"
            rows={5}
            value={businessDescription}
            onChange={(e) => updateWizardData({ businessDescription: e.target.value })}
            placeholder="Tell us what your business sells or what services you provide."
            className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/50 px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-brand" />
            Need inspiration? Try pre-filling with sample store details.
          </p>
          <button
            type="button"
            onClick={() =>
              updateWizardData({
                businessName: "Urban Wear",
                businessCategory: "Fashion & Apparel",
                businessDescription:
                  "Urban Wear is a Karachi-based streetwear label selling premium tees, hoodies and denim online, with nationwide delivery and easy exchanges.",
              })
            }
            className="shrink-0 text-sm font-bold text-brand underline underline-offset-4 hover:text-brand-strong"
          >
            Auto-fill Urban Wear
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
