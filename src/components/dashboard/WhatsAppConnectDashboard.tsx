import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  Link2,
  KeyRound,
  ShieldCheck,
  Webhook,
} from 'lucide-react';
import { WizardState } from '../../types';
import { supabaseUrl } from '../../lib/chatApi';

interface WhatsAppConnectDashboardProps {
  state: WizardState;
  onBackToWizard: () => void;
}

const WEBHOOK_URL = `${supabaseUrl}/functions/v1/whatsapp-webhook`;
// Must match the WHATSAPP_VERIFY_TOKEN secret set on the whatsapp-webhook edge function.
const VERIFY_TOKEN = 'saleconvo_webhook_secret_2026';

export const WhatsAppConnectDashboard: React.FC<WhatsAppConnectDashboardProps> = ({
  state,
  onBackToWizard,
}) => {
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState<'url' | 'token' | null>(null);

  const storeName = state.businessName || 'Urban Threads';
  const agentName = state.agentName || 'Sara';
  const canSubmit = phoneNumberId.trim() && wabaId.trim() && accessToken.trim() && !isTesting;

  const copyText = async (value: string, which: 'url' | 'token') => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable; still show feedback */
    }
    setCopied(which);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleSaveAndTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsTesting(true);
    setConnectionStatus('idle');
    // TODO: replace with real backend call that stores credentials and pings the Graph API.
    setTimeout(() => {
      setIsTesting(false);
      setConnectionStatus('success');
    }, 1500);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all';

  const steps = [
    'Open Meta for Developers → your app → WhatsApp → Configuration.',
    'Under Webhook, click Edit and paste the Callback URL and Verify Token above.',
    'Click Verify and Save, then subscribe to the "messages" webhook field.',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-lg font-bold shadow-md">
              {storeName[0]}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {storeName}
              </h1>
              <p className="text-sm text-slate-500">
                Active agent: <span className="font-semibold text-slate-700">{agentName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span
              id="agent-active-badge"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Agent Active
            </span>
            <button
              type="button"
              id="back-to-wizard-btn"
              onClick={onBackToWizard}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Setup Wizard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Connection setup */}
      <form
        onSubmit={handleSaveAndTest}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25d366]/15 border border-[#25d366]/30 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#128c7e]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Connect WhatsApp Business Cloud API</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Connect your official Meta WhatsApp Business account to start answering customers
              automatically.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="phone-number-id" className="text-xs font-bold text-slate-800">
              Phone Number ID
            </label>
            <input
              id="phone-number-id"
              type="text"
              inputMode="numeric"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="e.g. 109823482347291"
              className={inputClass}
            />
            <p className="text-[11px] text-slate-500">
              Found in Meta for Developers → WhatsApp → API Setup.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="waba-id" className="text-xs font-bold text-slate-800">
              WhatsApp Business Account ID (WABA ID)
            </label>
            <input
              id="waba-id"
              type="text"
              inputMode="numeric"
              value={wabaId}
              onChange={(e) => setWabaId(e.target.value)}
              placeholder="e.g. 102938475610293"
              className={inputClass}
            />
            <p className="text-[11px] text-slate-500">
              Shown next to your Phone Number ID in API Setup.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="access-token" className="text-xs font-bold text-slate-800">
            Permanent Access Token
          </label>
          <div className="relative">
            <input
              id="access-token"
              type={showToken ? 'text' : 'password'}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your system user token"
              autoComplete="off"
              className={`${inputClass} pr-11 font-mono`}
            />
            <button
              type="button"
              id="toggle-token-visibility"
              onClick={() => setShowToken((v) => !v)}
              aria-label={showToken ? 'Hide token' : 'Show token'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Create it in Meta Business Settings → System Users. Keep it secret; it is stored
            encrypted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <button
            type="submit"
            id="save-test-whatsapp-btn"
            disabled={!canSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Testing connection…</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save &amp; Test WhatsApp Connection</span>
              </>
            )}
          </button>

          {connectionStatus === 'success' && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Connection saved (demo — backend not wired yet)
            </span>
          )}
        </div>
      </form>

      {/* Section 2: Webhook helper */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <Webhook className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Webhook Configuration</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Meta needs these two values to send customer messages to your agent.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              Webhook Callback URL
            </label>
            <div className="flex items-center gap-2">
              <code
                id="webhook-url"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 truncate"
              >
                {WEBHOOK_URL}
              </code>
              <button
                type="button"
                id="copy-webhook-url-btn"
                onClick={() => copyText(WEBHOOK_URL, 'url')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied === 'url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              Verify Token
            </label>
            <div className="flex items-center gap-2">
              <code
                id="verify-token"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 truncate"
              >
                {VERIFY_TOKEN}
              </code>
              <button
                type="button"
                id="copy-verify-token-btn"
                onClick={() => copyText(VERIFY_TOKEN, 'token')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied === 'token' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied === 'token' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <ol className="space-y-2.5 pt-1">
          {steps.map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="pt-0.5">{text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
