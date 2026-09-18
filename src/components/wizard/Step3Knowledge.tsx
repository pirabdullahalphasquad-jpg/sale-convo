import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  HelpCircle,
  Lightbulb,
  Plus,
  RotateCcw,
  Trash2,
  Truck,
} from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: Faq[] = [
  {
    id: "faq-1",
    question: "Do you offer Cash on Delivery?",
    answer: "Yes, we offer Cash on Delivery across Pakistan.",
  },
  {
    id: "faq-2",
    question: "How long does nationwide delivery take?",
    answer: "Delivery takes 2 to 4 working days for major cities and up to 5 days for remote areas.",
  },
];

function SectionHeading({
  index,
  title,
  aside,
  subtitle,
}: {
  index: number;
  title: string;
  aside: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary text-xs font-bold uppercase tracking-wide text-foreground">
            {index}
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">{title}</h3>
        </div>
        {subtitle ? <p className="mt-0.5 pl-7 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <span className="shrink-0 text-xs font-medium text-muted-foreground">{aside}</span>
    </div>
  );
}

export function Step3Knowledge() {
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);
  const updateWizardData = useWizardStore((s) => s.updateWizardData);

  const [about, setAbout] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQS);
  const [deliveryPolicy, setDeliveryPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [paymentMethods, setPaymentMethods] = useState(
    "Cash on Delivery, Bank Transfer, Easypaisa, Nayapay",
  );

  const [showFaqForm, setShowFaqForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const syncCount = (next: Faq[]) => {
    setFaqs(next);
    updateWizardData({ knowledgeArticles: next.length });
  };

  const saveFaq = () => {
    const question = newQuestion.trim();
    const answer = newAnswer.trim();
    if (!question || !answer) return;
    syncCount([...faqs, { id: `faq-${Date.now()}`, question, answer }]);
    setNewQuestion("");
    setNewAnswer("");
    setShowFaqForm(false);
  };

  const cancelFaq = () => {
    setNewQuestion("");
    setNewAnswer("");
    setShowFaqForm(false);
  };

  const removeFaq = (id: string) => syncCount(faqs.filter((faq) => faq.id !== id));

  return (
    <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-brand-border bg-brand-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand">
          Step 3 of 7
        </span>
        <span className="text-xs text-muted-foreground">• Core Knowledge Base</span>
      </div>

      <h1 className="mt-1.5 text-3xl font-bold leading-tight tracking-tight text-foreground">
        Teach your AI about your business
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Give your AI the information it needs to answer customer questions accurately.
      </p>

      <div className="mt-6 border-t border-border pt-6">
        {/* 1 — About your business */}
        <SectionHeading index={1} title="About your business" aside="Core Brand Story" />
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={3}
          placeholder="Example: We are a women's clothing brand based in Lahore. We offer nationwide delivery and accept Cash on Delivery."
          className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3.5 text-sm leading-relaxed text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
        />

        {/* 2 — FAQs */}
        <div className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <SectionHeading
              index={2}
              title="Frequently asked questions"
              aside=""
              subtitle="Common customer inquiries your AI can answer instantly"
            />
            <button
              type="button"
              onClick={() => setShowFaqForm((open) => !open)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-border bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand-soft/80"
            >
              <Plus className="h-3.5 w-3.5" />
              Add FAQ
            </button>
          </div>

          {showFaqForm ? (
            <div className="mt-3 rounded-xl border border-brand-border/60 bg-card p-4 shadow-sm">
              <div>
                <label
                  htmlFor="faq-question"
                  className="pb-1.5 text-xs font-semibold text-foreground"
                >
                  Question
                </label>
                <input
                  id="faq-question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. Do you offer Cash on Delivery?"
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="faq-answer"
                  className="pb-1.5 text-xs font-semibold text-foreground"
                >
                  Answer
                </label>
                <textarea
                  id="faq-answer"
                  rows={2}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write the answer your AI should give customers."
                  className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
              <div className="mt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={cancelFaq}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveFaq}
                  disabled={!newQuestion.trim() || !newAnswer.trim()}
                  className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong disabled:opacity-50"
                >
                  Save FAQ
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-3 space-y-2.5">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-secondary/60 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-3.5 w-3.5 shrink-0 text-brand" />
                    <h4 className="text-xs font-bold text-foreground">{faq.question}</h4>
                  </div>
                  <p className="mt-1.5 pl-[22px] text-xs leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(faq.id)}
                  aria-label={`Delete FAQ: ${faq.question}`}
                  className="rounded-md p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3 — Policies */}
        <div className="mt-8">
          <SectionHeading index={3} title="Policies" aside="Customer Guidelines" />

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="delivery-policy"
                className="flex items-center gap-1.5 pb-1.5 text-xs font-semibold text-foreground"
              >
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                Delivery policy
              </label>
              <textarea
                id="delivery-policy"
                rows={2}
                value={deliveryPolicy}
                onChange={(e) => setDeliveryPolicy(e.target.value)}
                placeholder="Tell customers about delivery areas, delivery time and charges."
                className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
              />
            </div>

            <div>
              <label
                htmlFor="return-policy"
                className="flex items-center gap-1.5 pb-1.5 text-xs font-semibold text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                Return &amp; exchange policy
              </label>
              <textarea
                id="return-policy"
                rows={2}
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                placeholder="Tell customers when and how they can return or exchange products."
                className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
              />
            </div>

            <div>
              <label
                htmlFor="payment-methods"
                className="flex items-center gap-1.5 pb-1.5 text-xs font-semibold text-foreground"
              >
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                Payment methods
              </label>
              <input
                id="payment-methods"
                value={paymentMethods}
                onChange={(e) => setPaymentMethods(e.target.value)}
                className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Helpful tip */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/70 p-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-900">
            <span className="font-bold">Helpful tip:</span> The more accurate information you
            provide, the better your AI can answer customers and close orders without needing human
            intervention.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
