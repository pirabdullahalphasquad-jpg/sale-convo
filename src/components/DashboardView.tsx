import React, { useState } from 'react';
import { WizardState } from '../types';
import {
  Bot,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Settings,
  ArrowRight,
  ExternalLink,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  state: WizardState;
  onEditWizard: (step?: number) => void;
  onOpenInbox: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onEditWizard,
  onOpenInbox,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              AI Employee Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {state.businessName || 'Urban Wear'} Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your WhatsApp agent is actively handling inquiries and routing orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenInbox}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open Live Inbox</span>
          </button>

          <button
            type="button"
            onClick={() => onEditWizard(1)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Edit Agent Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Conversations Today
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">48</div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24% vs yesterday</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            AI Automated Rate
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">91.4%</div>
          <p className="text-xs text-slate-500 mt-1">44 resolved without human</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Avg Response Time
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4.2s</div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Instant 24/7 delivery</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Orders Captured
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">19 Orders</div>
          <p className="text-xs text-slate-500 mt-1">Rs. 47,481 volume</p>
        </div>
      </div>

      {/* Grid: Live Setup Summary & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent WhatsApp Conversations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Recent WhatsApp Conversations
              </h3>
              <p className="text-xs text-slate-500">Live feed from customer inquiries</p>
            </div>
            <button
              type="button"
              onClick={onOpenInbox}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              View all →
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                  AK
                </div>
                <div>
                  <div className="font-bold text-slate-900">Ali Khan • +92 301 5592812</div>
                  <p className="text-slate-600 mt-0.5">
                    "Is size L available in black t-shirt? Can you ship to Lahore?"
                  </p>
                  <p className="text-emerald-700 font-medium mt-1">
                    AI: "Yes! Size L is in stock. Booked order #UW-9182."
                  </p>
                </div>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">2m ago</span>
            </div>

            <div className="py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                  ZF
                </div>
                <div>
                  <div className="font-bold text-slate-900">Zoya Fatima • +92 321 8840192</div>
                  <p className="text-slate-600 mt-0.5">
                    "Cash on delivery available hai Islamabad k liye?"
                  </p>
                  <p className="text-emerald-700 font-medium mt-1">
                    AI: "Jee bilkul! COD Islamabad samait pooray Pakistan mein dastiyaab hai."
                  </p>
                </div>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">14m ago</span>
            </div>

            <div className="py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  HM
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Hamza Malik • +92 333 4102983</span>
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      Human Handed Off
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    "Want to place a custom bulk order for 200 shirts."
                  </p>
                  <p className="text-slate-500 mt-1">
                    AI: "Routed to wholesale specialist as requested."
                  </p>
                </div>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">45m ago</span>
            </div>
          </div>
        </div>

        {/* Right Col: Active Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Active Configuration</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Business</span>
              <span className="font-semibold text-slate-800">{state.businessName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Category</span>
              <span className="font-semibold text-slate-800">{state.businessCategory}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tone</span>
              <span className="font-semibold text-slate-800">{state.tone}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Languages</span>
              <span className="font-semibold text-slate-800">
                {state.languages.join(', ')}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Products Active</span>
              <span className="font-semibold text-slate-800">{state.products.length}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Guardrail</span>
              <span className="font-semibold text-emerald-700">Strict Never Guess</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEditWizard(1)}
            className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Re-configure AI Employee</span>
          </button>
        </div>
      </div>
    </div>
  );
};
