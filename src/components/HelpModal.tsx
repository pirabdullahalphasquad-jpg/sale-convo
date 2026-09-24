import React from 'react';
import { HelpCircle, X, ShieldCheck, MessageCircle, BookOpen, Bot } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                AI Employee Setup Guide
              </h4>
              <p className="text-xs text-slate-500">Quick answers & best practices</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Do you need my WhatsApp password?
            </h5>
            <p className="leading-relaxed">
              Never. We use Meta's official WhatsApp Business Cloud API. Your account and
              credentials remain safely under your direct control at all times.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              What if the AI doesn't know the answer?
            </h5>
            <p className="leading-relaxed">
              With the "Never Guess" guardrail turned ON, your AI will never fabricate answers.
              It will politely inform the customer and immediately flag the thread for human
              review in your Live Inbox.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              Which languages are supported?
            </h5>
            <p className="leading-relaxed">
              Your AI handles English, Urdu script, and Roman Urdu seamlessly, understanding
              regional nuances, Pakistani sizing metrics, and Cash on Delivery queries.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Got it, continue setup
          </button>
        </div>
      </div>
    </div>
  );
};
