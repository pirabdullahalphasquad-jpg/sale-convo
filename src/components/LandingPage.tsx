import React from 'react';
import {
  ArrowRight,
  Bot,
  MessageCircle,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  ShoppingBag,
} from 'lucide-react';

interface LandingPageProps {
  onStartWizard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartWizard }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>The New Standard for WhatsApp Commerce</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
          Hire your 24/7 WhatsApp{' '}
          <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">
            sales & support
          </span>{' '}
          employee.
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Stop losing sales to late replies. Your AI employee answers product questions,
          recommends sizes, handles Cash on Delivery inquiries, and closes orders around the
          clock.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            id="hero-start-wizard-btn"
            onClick={onStartWizard}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm group"
          >
            <span>Set Up Your AI Employee</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs text-slate-400">Takes 5 minutes • No code required</span>
        </div>
      </section>

      {/* Outcome Metrics Strip */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="text-center sm:text-left sm:pr-6">
            <div className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
              <span>+38%</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Order Conversion
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Turn curious window-shoppers on WhatsApp into instant paid checkouts.
            </p>
          </div>

          <div className="text-center sm:text-left sm:px-6 pt-4 sm:pt-0">
            <div className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
              <span>&lt; 15s</span>
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Response Speed
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Zero drop-off during peak traffic hours, weekends, or late-night browsing.
            </p>
          </div>

          <div className="text-center sm:text-left sm:pl-6 pt-4 sm:pt-0">
            <div className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
              <span>85%</span>
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Routine Queries Handled
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Frees your human team to focus only on VIP clients and custom inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Product & WhatsApp Experience Preview */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Outcomes narrative */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Built for actual business outcomes, not tech demos
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your customers don't want to talk to a robot with confusing menus. They want
            fast, accurate answers about stock, prices, and delivery.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900">
                  Speaks everyday customer language:
                </strong>{' '}
                Fluent in English, Urdu, and Roman Urdu so customers feel naturally
                understood.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900">
                  Strict "Never Guess" guardrail:
                </strong>{' '}
                If your AI doesn't know a detail, it gracefully tags a human team member
                rather than making things up.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900">
                  Direct WhatsApp catalog integration:
                </strong>{' '}
                Understands your inventory, prices, sizes, and active return/delivery policies.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Realistic WhatsApp chat preview card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
                UW
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Urban Wear Official
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-300">WhatsApp Verified Business</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">AI Active</span>
          </div>

          <div className="p-4 space-y-3 bg-[#efeae2]/40 text-xs">
            {/* Customer msg */}
            <div className="flex justify-end">
              <div className="bg-emerald-700 text-white p-3 rounded-xl rounded-tr-xs max-w-[85%] shadow-2xs">
                Hi! Is the Premium Oversized T-shirt available in Medium black? Also do you
                do COD to Lahore?
                <div className="text-[9px] text-emerald-200 text-right mt-1">11:02 PM</div>
              </div>
            </div>

            {/* AI response */}
            <div className="flex justify-start">
              <div className="bg-white text-slate-900 p-3 rounded-xl rounded-tl-xs max-w-[85%] border border-slate-200 shadow-2xs space-y-1.5">
                <p>
                  Yes! The <strong>Premium Oversized T-Shirt</strong> in Black is in stock in
                  size M (Chest 42").
                </p>
                <p>
                  We offer Cash on Delivery to Lahore with delivery in 2-3 working days for
                  Rs. 2,499.
                </p>
                <p className="text-emerald-700 font-medium">
                  Would you like me to book one for you right now?
                </p>
                <div className="text-[9px] text-slate-400 text-right">11:02 PM • Instant</div>
              </div>
            </div>

            {/* Customer reply */}
            <div className="flex justify-end">
              <div className="bg-emerald-700 text-white p-2.5 rounded-xl rounded-tr-xs max-w-[85%] shadow-2xs">
                Yes please! Booking details: Ali Khan, Gulberg III, Lahore.
                <div className="text-[9px] text-emerald-200 text-right mt-1">11:03 PM</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onStartWizard}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Configure this for your own business →
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 text-center max-w-4xl mx-auto space-y-5">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Ready to set up your AI employee?
        </h3>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">
          No complex coding or chatbot engineering. Just answer 7 simple questions about
          your business and deploy your assistant to WhatsApp.
        </p>
        <button
          type="button"
          onClick={onStartWizard}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer text-sm"
        >
          <span>Start Onboarding Wizard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
