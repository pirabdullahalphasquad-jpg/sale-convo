import { Bot, CircleCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 py-2.5 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function AIEmployeeSummary() {
  const {
    businessName,
    businessCategory,
    isWhatsappConnected,
    knowledgeArticles,
    catalogProducts,
    toneOfVoice,
    languages,
    humanHandoffConditions,
    neverGuessPolicy,
  } = useWizardStore();

  return (
    <aside className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">AI Employee Summary</h2>
          <p className="mt-1 text-xs text-muted-foreground">Your 24/7 WhatsApp team member</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-brand-border/60 bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
          <CircleCheck className="h-3.5 w-3.5" />
          80% Ready
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand shadow-sm">
          <Bot className="h-5 w-5 text-brand-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {businessName || "Your business"} Assistant
          </p>
          <p className="truncate text-xs text-muted-foreground">{businessCategory}</p>
        </div>
      </div>

      <div className="mt-5">
        <Row label="Business" value={businessName || "—"} />
        <Row
          label="WhatsApp Channel"
          value={
            isWhatsappConnected ? (
              <span className="text-brand">Connected</span>
            ) : (
              <span className="inline-flex items-center gap-1 font-normal text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5" />
                Not Connected
              </span>
            )
          }
        />
        <Row label="Knowledge FAQs" value={`${knowledgeArticles} articles saved`} />
        <Row label="Catalog Products" value={`${catalogProducts} in catalog`} />
        <Row label="Tone of Voice" value={toneOfVoice} />
        <Row label="Languages" value={languages.join(", ")} />
        <Row label="Human Handoff" value={`${humanHandoffConditions} conditions`} />
        <Row
          label="Never Guess Policy"
          value={<span className="text-brand">{neverGuessPolicy}</span>}
        />
      </div>

      <div className="mt-5 flex gap-2.5 rounded-xl border border-brand-border/60 bg-brand-soft p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Meta Official Cloud API:</span> Secure,
          verified connection. Your data and private messages remain 100% in your control.
        </p>
      </div>
    </aside>
  );
}
