import React, { useState } from 'react';
import { WizardState } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Bot,
  MessageSquare,
  QrCode,
  ExternalLink,
  Loader2,
  Sparkles,
  Phone,
  BarChart3,
  Check,
} from 'lucide-react';

interface Step7Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onActivate: () => void;
  onBack: () => void;
  onJumpToStep: (step: number) => void;
}

export const Step7ActivateAgent: React.FC<Step7Props> = ({
  state,
  updateState,
  onActivate,
  onBack,
  onJumpToStep,
}) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isActivatedLocal, setIsActivatedLocal] = useState(state.isActivated);

  const cleanPhone = (state.whatsappPhoneNumber || '+92 300 1234567').replace(/[^0-9]/g, '');
  const whatsappTestUrl = `https://wa.me/${cleanPhone}?text=Hi%2C%20I%20have%20a%20question%20about%20your%20products`;

  const checklistItems = [
    {
      title: 'Business Information',
      detail: `${state.businessName || 'Urban Threads'} • ${state.businessCategory}`,
      step: 1,
    },
    {
      title: 'WhatsApp Business API',
      detail: state.whatsappConnected
        ? `Connected to ${state.whatsappPhoneNumber}`
        : state.whatsappSkipped
        ? 'Connected via Cloud Sandbox (+92 300 1234567)'
        : `Connected to ${state.whatsappPhoneNumber || '+92 300 1234567'}`,
      step: 2,
    },
    {
      title: 'Business Knowledge & FAQs',
      detail: `${state.faqs.length} FAQs and custom business knowledge facts`,
      step: 3,
    },
    {
      title: 'Delivery, Payment & Policies',
      detail: `${state.deliveryScope} • ${state.deliveryTime} • ${state.paymentMethods.length} payment methods`,
      step: 4,
    },
    {
      title: 'Product Catalog',
      detail: `${state.products.length} products with prices, sizes, and stock availability`,
      step: 5,
    },
    {
      title: 'AI Agent Persona & Tone',
      detail: `Agent ${state.agentName || 'Sara'} • ${state.tone} • ${state.responseStyle}`,
      step: 6,
    },
  ];

  const handleActivateSaleConvo = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsActivatedLocal(true);
      updateState({
        isActivated: true,
        activatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      // Fire celebration / dashboard navigation
      setTimeout(() => {
        onActivate();
      }, 900);
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Activation & Launch
          </span>
          <span className="text-xs text-slate-400">• The Finish Line</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Your AI Sales Agent is ready!
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          SaleConvo is connected to your WhatsApp number and ready to respond to customers.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-6">
        {/* Status Card & WhatsApp Integration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* WhatsApp Connection info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#25d366]/15 border border-[#25d366]/30 flex items-center justify-center text-[#128c7e] shrink-0 shadow-2xs">
                <MessageSquare className="w-6 h-6 text-[#128c7e]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  WhatsApp Number Connected
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-base font-bold text-slate-900">
                    {state.whatsappPhoneNumber || '+92 300 1234567'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Status Badge */}
            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Agent Status
              </span>
              {isActivatedLocal ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs shadow-2xs animate-in fade-in">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🟢 SaleConvo is Active</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Ready to Activate</span>
                </div>
              )}
            </div>
          </div>

          {/* Test on WhatsApp Section (QR code & link) */}
          <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center md:text-left max-w-md">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Test your agent live on your own WhatsApp</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan the QR code or tap the button to open a conversation directly in WhatsApp and chat with {state.agentName || 'Sara'}.
              </p>
              <div className="pt-1.5">
                <a
                  href={whatsappTestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300/80 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in WhatsApp Web / App</span>
                </a>
              </div>
            </div>

            {/* Simulated Clean QR Code */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center shrink-0">
              <div className="w-24 h-24 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center text-white">
                <QrCode className="w-full h-full text-white" />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 mt-1.5">
                Scan to test
              </span>
            </div>
          </div>

          {/* Big CTA: Activate SaleConvo */}
          <div className="pt-2">
            <button
              type="button"
              id="activate-saleconvo-big-btn"
              disabled={isActivating || isActivatedLocal}
              onClick={handleActivateSaleConvo}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer ${
                isActivatedLocal
                  ? 'bg-emerald-700 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg active:scale-[0.99]'
              }`}
            >
              {isActivating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Activating SaleConvo on WhatsApp...</span>
                </>
              ) : isActivatedLocal ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>🟢 SaleConvo is Active</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Activate SaleConvo</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400 text-center block mt-2">
              You can pause or update your agent’s responses anytime in your dashboard.
            </span>
          </div>
        </div>

        {/* Configuration Checklist Overview */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Configuration Overview
            </h4>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              All steps complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {checklistItems.map((item) => (
              <div
                key={item.step}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/70 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="truncate">
                    <h5 className="font-bold text-slate-900 truncate">{item.title}</h5>
                    <p className="text-slate-500 text-[11px] truncate">{item.detail}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onJumpToStep(item.step)}
                  className="text-slate-400 hover:text-emerald-700 font-semibold px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="activate-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Test AI</span>
        </button>

        <button
          type="button"
          onClick={handleActivateSaleConvo}
          disabled={isActivating || isActivatedLocal}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
        >
          {isActivatedLocal ? 'Agent is Active' : 'Direct Activation'}
        </button>
      </div>
    </div>
  );
};
