import React from 'react';
import { WizardState, DeliveryScope, DeliveryChargeType } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  MapPin,
  Clock,
  Coins,
  Check,
} from 'lucide-react';

interface Step4Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SCOPE_OPTIONS: { id: DeliveryScope; label: string; desc: string }[] = [
  { id: 'Nationwide', label: 'Nationwide', desc: 'All cities and regions across country' },
  { id: 'Selected cities', label: 'Selected cities', desc: 'Specific metropolitans & hubs' },
  { id: 'International', label: 'International', desc: 'Worldwide global shipping' },
  { id: 'Pickup only', label: 'Pickup only', desc: 'Self-pickup at store location' },
];

const STANDARD_PAYMENTS = [
  'Cash on Delivery',
  'Bank Transfer',
  'Card (Debit / Credit)',
  'Easypaisa',
  'JazzCash',
];

export const Step4DeliveryPolicies: React.FC<Step4Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const togglePaymentMethod = (method: string) => {
    if (state.paymentMethods.includes(method)) {
      updateState({
        paymentMethods: state.paymentMethods.filter((m) => m !== method),
      });
    } else {
      updateState({
        paymentMethods: [...state.paymentMethods, method],
      });
    }
  };

  const handleDeliveryChargeType = (type: DeliveryChargeType) => {
    updateState({ deliveryChargeType: type });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 4 of 7
          </span>
          <span className="text-xs text-slate-400">• High-Risk Business Facts</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Set your business policies
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Delivery, payment terms, and return rules are high-risk facts. SaleConvo uses these exact rules so customers get 100% accurate commitments.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-8">
        {/* Important AI Rule Banner */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 flex items-start gap-3 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-900 block mb-0.5">
              Important AI Rule
            </strong>
            SaleConvo will only use the information you provide here. It will never guess missing policy information or offer discounts and delivery terms you haven’t authorized.
          </div>
        </div>

        {/* Section 1: Delivery */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Delivery & Shipping Terms</span>
          </div>

          {/* Where do you deliver? */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Where do you deliver? <span className="text-emerald-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SCOPE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => updateState({ deliveryScope: opt.id })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    state.deliveryScope === opt.id
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        state.deliveryScope === opt.id
                          ? 'text-emerald-900'
                          : 'text-slate-800'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {state.deliveryScope === opt.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* If selected cities or custom areas */}
          {state.deliveryScope === 'Selected cities' && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <label
                htmlFor="delivery-areas-input"
                className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Delivery Areas</span>
              </label>
              <input
                id="delivery-areas-input"
                type="text"
                value={state.deliveryAreas}
                onChange={(e) => updateState({ deliveryAreas: e.target.value })}
                placeholder="e.g. Lahore, Karachi, Islamabad, Rawalpindi"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          )}

          {/* Delivery Time & Delivery Charges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label
                htmlFor="delivery-time-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Typical Delivery Time <span className="text-emerald-600">*</span></span>
              </label>
              <input
                id="delivery-time-input"
                type="text"
                value={state.deliveryTime}
                onChange={(e) => updateState({ deliveryTime: e.target.value })}
                placeholder="e.g. 2–5 business days"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                The AI will use this timeframe when customers ask when their parcel arrives.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>Delivery Charges</span>
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium mb-2">
                {(['Free delivery', 'Fixed delivery fee', 'Varies by location'] as DeliveryChargeType[]).map(
                  (type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleDeliveryChargeType(type)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        state.deliveryChargeType === type
                          ? 'bg-white text-slate-900 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {type === 'Free delivery'
                        ? 'Free'
                        : type === 'Fixed delivery fee'
                        ? 'Fixed Fee'
                        : 'Varies'}
                    </button>
                  )
                )}
              </div>

              {state.deliveryChargeType === 'Fixed delivery fee' && (
                <input
                  id="fixed-delivery-fee-input"
                  type="text"
                  value={state.fixedDeliveryFee}
                  onChange={(e) => updateState({ fixedDeliveryFee: e.target.value })}
                  placeholder="e.g. PKR 200 or Rs. 250"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Payment Methods */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Accepted Payment Methods</span>
          </div>

          <p className="text-xs text-slate-500">
            Select all payment options your business supports. SaleConvo will advise customers accordingly at checkout.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {STANDARD_PAYMENTS.map((method) => {
              const isChecked = state.paymentMethods.includes(method);
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => togglePaymentMethod(method)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span className="text-xs">{method}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
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

          <div className="pt-2">
            <label
              htmlFor="other-payment-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Other Payment Method (Optional)
            </label>
            <input
              id="other-payment-input"
              type="text"
              value={state.otherPaymentMethod || ''}
              onChange={(e) => updateState({ otherPaymentMethod: e.target.value })}
              placeholder="e.g. Nayapay, Sadapay, Cryptocurrency"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Section 3: Return & Exchange */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>Return & Exchange Policy</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Do you accept returns?</span>
              <button
                type="button"
                onClick={() => updateState({ acceptReturns: !state.acceptReturns })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  state.acceptReturns
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {state.acceptReturns ? 'Yes, we accept returns' : 'No returns'}
              </button>
            </div>
          </div>

          {state.acceptReturns && (
            <div className="space-y-1.5">
              <label
                htmlFor="return-policy-textarea"
                className="block text-xs font-bold text-slate-700"
              >
                Return Policy Details
              </label>
              <p className="text-xs text-slate-500">
                Specify timeframe, condition requirements, and how the customer should initiate.
              </p>
              <textarea
                id="return-policy-textarea"
                rows={2}
                value={state.returnPolicy}
                onChange={(e) => updateState({ returnPolicy: e.target.value })}
                placeholder="e.g. Returns are accepted within 7 days if the product is unused and in original condition."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step4-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="step4-continue-btn"
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
