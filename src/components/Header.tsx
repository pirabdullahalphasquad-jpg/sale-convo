import React from 'react';
import { Bot, HelpCircle, Home, Sparkles, MessageSquare, ShoppingBag, BarChart3 } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  currentStep: number;
  isActivated?: boolean;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  currentStep,
  isActivated = false,
  onOpenHelp,
}) => {
  const isPostActivation =
    isActivated ||
    currentStep === 8 ||
    currentView === 'dashboard' ||
    currentView === 'inbox' ||
    currentView === 'orders';

  const getBreadcrumbLabel = () => {
    if (currentView === 'landing') return 'Overview';
    if (currentView === 'dashboard') return 'Agent Dashboard';
    if (currentView === 'inbox') return 'Live WhatsApp Inbox';
    if (currentView === 'orders') return 'Orders Management';
    if (currentView === 'wizard') {
      return currentStep === 8 ? 'Agent Activated' : `Step ${currentStep} of 7`;
    }
    return 'Overview';
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-3.5">
          <button
            id="brand-logo-btn"
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                WizeAgent
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/60">
                  AI Employee
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">WhatsApp Sales & Support</p>
            </div>
          </button>

          {/* Breadcrumb separator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <span>Onboarding</span>
            <span>/</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {getBreadcrumbLabel()}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View switcher buttons pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60 text-xs font-medium">
            <button
              type="button"
              id="nav-landing-btn"
              onClick={() => onViewChange('landing')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Product Story</span>
            </button>

            <button
              type="button"
              id="nav-wizard-btn"
              onClick={() => onViewChange('wizard')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'wizard'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Setup Wizard</span>
            </button>

            {/* Post-activation navigation buttons */}
            {isPostActivation && (
              <>
                <button
                  type="button"
                  id="nav-dashboard-btn"
                  onClick={() => onViewChange('dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  id="nav-inbox-btn"
                  onClick={() => onViewChange('inbox')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'inbox'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live Inbox</span>
                </button>

                <button
                  type="button"
                  id="nav-orders-btn"
                  onClick={() => onViewChange('orders')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'orders'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Orders</span>
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            id="header-need-help-btn"
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Need help?</span>
          </button>
        </div>
      </div>
    </header>
  );
};
