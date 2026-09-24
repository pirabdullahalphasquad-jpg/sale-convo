import React, { useState } from 'react';
import { WizardState } from '../../types';
import {
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Building2,
  Check,
} from 'lucide-react';

interface Step2Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2ConnectWhatsApp: React.FC<Step2Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(
    state.whatsappPhoneNumber || '+92 300 8492019'
  );

  const handleSimulateMetaConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      updateState({
        whatsappConnected: true,
        whatsappSkipped: false,
        whatsappPhoneNumber: selectedNumber,
        whatsappBusinessName: `${state.businessName || 'Urban Threads'} Official`,
      });
      setIsConnecting(false);
      setShowModal(false);
    }, 1200);
  };

  const handleDisconnect = () => {
    updateState({
      whatsappConnected: false,
      whatsappSkipped: false,
    });
  };

  const handleSkip = () => {
    updateState({
      whatsappConnected: false,
      whatsappSkipped: true,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 2 of 7
          </span>
          <span className="text-xs text-slate-400">• Official Channel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Connect your WhatsApp Business
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Connect your official WhatsApp Business account so SaleConvo can receive and respond to customer messages.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-6">
        {/* Main WhatsApp Card */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            state.whatsappConnected
              ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
              : 'bg-white border-slate-200/90 shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                  state.whatsappConnected ? 'bg-emerald-600' : 'bg-emerald-600/90'
                }`}
              >
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    WhatsApp Business
                  </h3>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      state.whatsappConnected
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {state.whatsappConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {state.whatsappConnected
                    ? `Active on ${state.whatsappPhoneNumber} • Official Meta Cloud API`
                    : 'Official Meta Embedded Signup (No manual tokens or passwords required)'}
                </p>
              </div>
            </div>

            {state.whatsappConnected ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="disconnect-whatsapp-btn"
                  onClick={handleDisconnect}
                  className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </div>
              </div>
            ) : (
              <button
                type="button"
                id="open-whatsapp-connect-modal-btn"
                onClick={() => setShowModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect WhatsApp</span>
              </button>
            )}
          </div>
        </div>

        {/* Explain briefly: What happens after connecting? */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            What happens after connecting?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/50">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="font-medium">Receive customer messages</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/50">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="font-medium">Send AI-powered replies</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/50">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="font-medium">Keep conversations in one place</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/50">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="font-medium">Let AI handle repetitive questions</span>
            </div>
          </div>
        </div>

        {/* Important Trust Message */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-emerald-900 block mb-0.5">
              Strict Privacy & Control Guardrail
            </span>
            SaleConvo only responds to customers through your connected business account. You can take over any conversation at any time.
          </div>
        </div>

        {/* Skipping Note if skipped or not connected */}
        {state.whatsappSkipped && !state.whatsappConnected && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">WhatsApp is not connected yet</span>
              Your AI Sales Agent will be configured and tested in this wizard, but it cannot respond to live customers until you connect your WhatsApp Business account.
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step2-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          {!state.whatsappConnected && (
            <button
              type="button"
              id="step2-skip-btn"
              onClick={handleSkip}
              className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2 cursor-pointer transition-colors"
            >
              I’ll do this later
            </button>
          )}

          {state.whatsappConnected ? (
            <button
              type="button"
              id="step2-continue-btn"
              onClick={onNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              id="step2-connect-and-continue-btn"
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
            >
              <span>Connect & Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Official Meta Embedded Signup Modal Simulation */}
      {showModal && (
        <div
          id="whatsapp-connect-modal"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#008069] text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Meta WhatsApp Onboarding
                  </h4>
                  <p className="text-[11px] text-slate-500">Official Cloud API Integration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Meta Business Manager Account</span>
                </div>
                <div className="text-slate-600 pl-5">
                  {state.businessName || 'Urban Threads'} (Verified Business ID: 849201948)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select WhatsApp Business Number
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-emerald-500 bg-emerald-50/40 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="phoneSelection"
                        checked={selectedNumber === '+92 300 8492019'}
                        onChange={() => setSelectedNumber('+92 300 8492019')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 text-xs block">
                          +92 300 8492019
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {state.businessName || 'Urban Threads'} Main Line (Verified)
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Available
                    </span>
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 space-y-1.5">
                <div className="font-medium text-slate-700">Permissions granted to SaleConvo:</div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Read incoming customer messages on this line</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Send AI replies and allow team manual override</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 text-[11px] text-emerald-800 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero manual API tokens or passwords needed. Secure OAuth flow.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-whatsapp-connection-btn"
                disabled={isConnecting}
                onClick={handleSimulateMetaConnect}
                className="bg-[#008069] hover:bg-[#00705a] disabled:opacity-60 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting with Meta...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Connect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

