import React from 'react';
import {
  Building2,
  PhoneCall,
  BookOpen,
  FileCheck2,
  ShoppingBag,
  Sliders,
  MessageSquareCode,
  Check,
} from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  completedSteps: number[];
}

const STEPS = [
  { step: 1, label: 'Business', fullLabel: 'Business Setup', icon: Building2 },
  { step: 2, label: 'WhatsApp', fullLabel: 'Connect WhatsApp', icon: PhoneCall },
  { step: 3, label: 'Knowledge', fullLabel: 'Business Knowledge', icon: BookOpen },
  { step: 4, label: 'Policies', fullLabel: 'Policies & Delivery', icon: FileCheck2 },
  { step: 5, label: 'Products', fullLabel: 'Add Products', icon: ShoppingBag },
  { step: 6, label: 'Configure', fullLabel: 'Configure AI', icon: Sliders },
  { step: 7, label: 'Test & Launch', fullLabel: 'Test & Activate', icon: MessageSquareCode },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-4 mb-6">
      {/* Top progress metadata */}
      <div className="flex items-center justify-between px-2 pb-3 mb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Progress
          </span>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
            Step {Math.min(currentStep, 7)} of 7
          </span>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {Math.round(((Math.min(currentStep, 7) - 1) / 6) * 100)}% completed
        </div>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1">
        {STEPS.map((item) => {
          const isActive = currentStep === item.step;
          const isCompleted = completedSteps.includes(item.step) || currentStep > item.step;
          const Icon = item.icon;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => onSelectStep(item.step)}
              className={`group flex flex-col items-center p-1.5 sm:p-2 rounded-xl transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-emerald-50/80 ring-1 ring-emerald-500/30'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                }`}
              >
                {isCompleted && !isActive ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-semibold truncate max-w-full leading-tight ${
                  isActive
                    ? 'text-emerald-950 font-bold'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              <span className="hidden md:block text-[10px] text-slate-400 truncate max-w-full">
                {item.fullLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

