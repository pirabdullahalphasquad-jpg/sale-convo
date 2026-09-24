import React from 'react';
import { AgentTone, ResponseStyle, WizardState } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Smile,
  Briefcase,
  Sparkles,
  Crown,
  User,
  MessageSquare,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface Step6Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TONE_OPTIONS: Array<{
  value: AgentTone;
  label: string;
  description: string;
  recommended?: boolean;
  icon: React.ElementType;
}> = [
  {
    value: 'Friendly & Helpful',
    label: 'Friendly & Helpful',
    description: 'Warm, inviting, and conversational (Default)',
    recommended: true,
    icon: Smile,
  },
  {
    value: 'Professional & Polite',
    label: 'Professional & Polite',
    description: 'Clear, courteous, and business-focused',
    icon: Briefcase,
  },
  {
    value: 'Casual & Energetic',
    label: 'Casual & Energetic',
    description: 'Lively, modern, and enthusiastic tone',
    icon: Sparkles,
  },
  {
    value: 'Luxury & Sophisticated',
    label: 'Luxury & Sophisticated',
    description: 'Refined, discreet, and high-end concierge',
    icon: Crown,
  },
];

const RESPONSE_STYLES: Array<{
  value: ResponseStyle;
  label: string;
  desc: string;
  recommended?: boolean;
}> = [
  {
    value: 'Short & Direct',
    label: 'Short & Direct',
    desc: 'Bite-sized, natural WhatsApp chat replies (Recommended)',
    recommended: true,
  },
  {
    value: 'Detailed & Informative',
    label: 'Detailed & Informative',
    desc: 'Comprehensive answers with rich item descriptions',
  },
];

const PROACTIVE_SALES_OPTIONS = [
  { id: 'recommend', label: 'Recommend matching products', desc: 'Cross-sell accessories or popular pairings' },
  { id: 'askSale', label: 'Ask for the sale when customer shows interest', desc: 'Send order link or offer to confirm details' },
  { id: 'followup', label: 'Offer help if customer stops responding', desc: 'Gentle follow-up message after 15 minutes of silence' },
];

const HANDOFF_OPTIONS = [
  'Customer asks for a human agent',
  'Customer is angry or dissatisfied',
  'Question cannot be answered by available information',
];

export const Step5ConfigureAI: React.FC<Step6Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const toggleHandoff = (trigger: string) => {
    if (state.humanHandoffTriggers.includes(trigger)) {
      updateState({
        humanHandoffTriggers: state.humanHandoffTriggers.filter((t) => t !== trigger),
      });
    } else {
      updateState({
        humanHandoffTriggers: [...state.humanHandoffTriggers, trigger],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 6 of 7
          </span>
          <span className="text-xs text-slate-400">• Persona & Guardrails</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Configure your AI Sales Agent
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Customize how your AI talks to customers, recommends products, and closes sales on WhatsApp.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-7">
        {/* Section 1: Agent Persona */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Agent Persona</span>
          </div>

          {/* Agent Name */}
          <div className="max-w-md">
            <label
              htmlFor="agent-name-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Agent Name <span className="text-emerald-600">*</span>
            </label>
            <input
              id="agent-name-input"
              type="text"
              value={state.agentName}
              onChange={(e) => updateState({ agentName: e.target.value })}
              placeholder="e.g. Sara, Alex, Zara"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Your AI will introduce itself by this name on WhatsApp.
            </span>
          </div>

          {/* Tone of Voice */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Tone of Voice
              </label>
              <span className="text-xs text-slate-400">Default: Friendly & Helpful</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TONE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = state.tone === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateState({ tone: item.value })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/30 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-xs text-slate-900">
                          {item.label}
                        </span>
                        {item.recommended && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Response Style (Message Length) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Response Style & Message Length</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RESPONSE_STYLES.map((style) => {
              const isSelected = state.responseStyle === style.value;
              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => updateState({ responseStyle: style.value })}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{style.label}</span>
                      {style.recommended && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{style.desc}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Sales Behavior (Proactive Sales) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Sales Behavior • Proactive Sales</span>
          </div>

          <p className="text-xs text-slate-500">
            SaleConvo doesn’t just answer support questions—it actively guides customer conversations toward completed orders.
          </p>

          <div className="space-y-2.5">
            {PROACTIVE_SALES_OPTIONS.map((opt) => {
              const isChecked =
                (opt.id === 'recommend' && state.proactiveSales.recommendProducts) ||
                (opt.id === 'askSale' && state.proactiveSales.askForSale) ||
                (opt.id === 'followup' && state.proactiveSales.offerHelpIfInactive);

              const handleToggle = () => {
                if (opt.id === 'recommend') {
                  updateState({
                    proactiveSales: {
                      ...state.proactiveSales,
                      recommendProducts: !state.proactiveSales.recommendProducts,
                    },
                  });
                } else if (opt.id === 'askSale') {
                  updateState({
                    proactiveSales: {
                      ...state.proactiveSales,
                      askForSale: !state.proactiveSales.askForSale,
                    },
                  });
                } else if (opt.id === 'followup') {
                  updateState({
                    proactiveSales: {
                      ...state.proactiveSales,
                      offerHelpIfInactive: !state.proactiveSales.offerHelpIfInactive,
                    },
                  });
                }
              };

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={handleToggle}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-medium shadow-2xs'
                      : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-xs font-bold text-slate-900 block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {opt.desc}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Handoff to Human */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Handoff to Human</span>
          </div>

          <p className="text-xs text-slate-500">
            When should SaleConvo automatically pause and transfer the conversation to your team?
          </p>

          <div className="space-y-2">
            {HANDOFF_OPTIONS.map((trigger) => {
              const isChecked = state.humanHandoffTriggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => toggleHandoff(trigger)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'border-slate-300 bg-slate-50 text-slate-900 font-medium'
                      : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">{trigger}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Strict "Never Guess" Guardrail */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Never Guess Rule
              </h4>
              <span className="text-[10px] font-bold uppercase bg-emerald-200/70 text-emerald-900 px-1.5 py-0.2 rounded">
                Active Guardrail
              </span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              If a customer asks a question not in your business facts or catalog, SaleConvo will politely state that it doesn’t have that detail and can connect them with your human support team.
            </p>
          </div>

          <div className="w-10 h-6 rounded-full bg-emerald-600 p-1 flex items-center justify-end shrink-0 shadow-2xs">
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step6-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="step6-continue-btn"
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
        >
          <span>Continue to Test AI</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
