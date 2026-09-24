import React from 'react';
import { Bot, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { WizardState } from '../types';

interface AISummaryCardProps {
  state: WizardState;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ state }) => {
  // Calculate readiness score
  let score = 0;
  if (state.businessName) score += 15;
  if (state.businessCategory) score += 10;
  if (state.whatsappConnected) score += 20;
  else if (state.whatsappSkipped) score += 10;
  if (state.aboutBusiness || state.faqs.length > 0) score += 15;
  if (state.products.length > 0) score += 15;
  if (state.tone && state.languages.length > 0) score += 15;
  if (state.testChatMessages.length >= 2) score += 10;

  const readinessPercent = Math.min(100, score);

  return (
    <div
      id="ai-employee-summary-card"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 sticky top-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            AI Employee Summary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your 24/7 WhatsApp team member
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            readinessPercent >= 80
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
          }`}
        >
          {readinessPercent >= 80 ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-amber-600" />
          )}
          {readinessPercent}% Ready
        </span>
      </div>

      {/* AI Profile Pill */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Bot className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {state.businessName ? `${state.businessName} Assistant` : 'Your AI Employee'}
          </h4>
          <p className="text-xs text-slate-500 truncate">
            {state.businessCategory || 'Business category pending'}
          </p>
        </div>
      </div>

      {/* Specifications list matching reference style */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Business</span>
          <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">
            {state.businessName || '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">WhatsApp Channel</span>
          <span
            className={`font-semibold text-right flex items-center gap-1 ${
              state.whatsappConnected
                ? 'text-emerald-700'
                : state.whatsappSkipped
                ? 'text-amber-600'
                : 'text-slate-400'
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            {state.whatsappConnected
              ? 'Connected'
              : state.whatsappSkipped
              ? 'Pending (Later)'
              : 'Not Connected'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Knowledge FAQs</span>
          <span className="font-semibold text-slate-800">
            {state.faqs.length} articles saved
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Catalog Products</span>
          <span className="font-semibold text-slate-800">
            {state.products.length} in catalog
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Agent Persona</span>
          <span className="font-semibold text-slate-800">
            {state.agentName || 'Sara'} ({state.tone})
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Delivery & Returns</span>
          <span className="font-semibold text-slate-800 text-right truncate max-w-[150px]">
            {state.deliveryScope} • {state.acceptReturns ? 'Returns OK' : 'Final Sale'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Proactive Sales</span>
          <span className="font-semibold text-emerald-700">
            {[state.proactiveSales.recommendProducts, state.proactiveSales.askForSale, state.proactiveSales.offerHelpIfInactive].filter(Boolean).length} behaviors
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Tone of Voice</span>
          <span className="font-semibold text-slate-800">{state.tone}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Languages</span>
          <span className="font-semibold text-slate-800 text-right truncate max-w-[150px]">
            {state.languages.join(', ')}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Human Handoff</span>
          <span className="font-semibold text-slate-800">
            {state.humanHandoffTriggers.length} conditions
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500">Never Guess Policy</span>
          <span
            className={`font-semibold ${
              state.neverGuess ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {state.neverGuess ? 'Active (Strict Safe)' : 'Off'}
          </span>
        </div>
      </div>

      {/* Trust badge */}
      <div className="mt-5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed text-emerald-800">
          <strong className="font-semibold">Meta Official Cloud API:</strong> Secure,
          verified connection. Your data and private messages remain 100% in your control.
        </div>
      </div>
    </div>
  );
};
