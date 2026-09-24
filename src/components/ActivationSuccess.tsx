import React from 'react';
import { WizardState } from '../types';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Bot,
  Activity,
  Layers,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface ActivationSuccessProps {
  state: WizardState;
  onGoToDashboard: () => void;
  onOpenInbox: () => void;
  onResetSetup: () => void;
}

export const ActivationSuccess: React.FC<ActivationSuccessProps> = ({
  state,
  onGoToDashboard,
  onOpenInbox,
  onResetSetup,
}) => {
  return (
    <div
      id="activation-success-screen"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-10 max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Celebration Icon */}
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-xs relative">
        <Bot className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
          ✓
        </span>
      </div>

      {/* Heading & Description */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Your AI agent is live 🎉
      </h2>
      <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
        Your AI is now ready to help answer customer questions on WhatsApp.
      </p>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 text-left">
        {/* AI Status */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            AI Status
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-bold text-slate-900">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ready for chats 24/7</p>
        </div>

        {/* WhatsApp */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            WhatsApp
          </span>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="text-base font-bold text-slate-900">
              {state.whatsappConnected ? 'Connected' : 'Active (Demo)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {state.whatsappPhoneNumber || 'Meta Official Cloud'}
          </p>
        </div>

        {/* Products */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Products
          </span>
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span className="text-base font-bold text-slate-900">
              {state.products.length || 12}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Live in AI Catalog</p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          id="go-to-dashboard-btn"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </button>

        <button
          type="button"
          id="open-inbox-btn"
          onClick={onOpenInbox}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <MessageSquare className="w-4 h-4 text-emerald-700" />
          <span>Open Inbox</span>
        </button>
      </div>

      {/* Re-edit / Reconfigure option */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onResetSetup}
          className="text-xs text-slate-400 hover:text-slate-700 underline underline-offset-4 cursor-pointer"
        >
          Modify setup or re-run wizard
        </button>
      </div>
    </div>
  );
};
