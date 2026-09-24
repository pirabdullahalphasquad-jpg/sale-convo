import React from 'react';
import { CATEGORY_OPTIONS } from '../../data/initialData';
import { BusinessCategory, WizardState } from '../../types';
import {
  ArrowRight,
  Building2,
  Store,
  Globe,
  Instagram,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface Step1Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
}

const COUNTRIES = [
  'Pakistan',
  'United Arab Emirates',
  'Saudi Arabia',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Other',
];

export const Step1BusinessSetup: React.FC<Step1Props> = ({
  state,
  updateState,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 1 of 7
          </span>
          <span className="text-xs text-slate-400">• Business Profile</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Let’s set up your business
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Tell us a little about your business so SaleConvo can respond to customers accurately.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-5">
        {/* Business Name */}
        <div>
          <label
            htmlFor="business-name-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
          >
            Business Name <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              id="business-name-input"
              type="text"
              required
              value={state.businessName}
              onChange={(e) => updateState({ businessName: e.target.value })}
              placeholder="e.g. Urban Threads"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Business Category */}
        <div>
          <label
            htmlFor="business-category-select"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
          >
            Business Category <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Store className="w-4 h-4" />
            </div>
            <select
              id="business-category-select"
              required
              value={state.businessCategory}
              onChange={(e) =>
                updateState({ businessCategory: e.target.value as BusinessCategory })
              }
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Business Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="business-description-textarea"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Business Description <span className="text-emerald-600">*</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">Brief overview</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Briefly describe what your business sells or offers.
          </p>
          <textarea
            id="business-description-textarea"
            rows={3}
            required
            value={state.businessDescription}
            onChange={(e) => updateState({ businessDescription: e.target.value })}
            placeholder="e.g. We sell premium men’s and women’s clothing online across Pakistan."
            className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs resize-none"
          />
        </div>

        {/* Optional Online Links: Website & Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="business-website-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Business Website
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>
            <input
              id="business-website-input"
              type="url"
              value={state.businessWebsite || ''}
              onChange={(e) => updateState({ businessWebsite: e.target.value })}
              placeholder="https://urbanthreads.pk"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
          </div>

          <div>
            <label
              htmlFor="instagram-page-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-slate-400" />
                Instagram Page
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>
            <input
              id="instagram-page-input"
              type="text"
              value={state.instagramPage || ''}
              onChange={(e) => updateState({ instagramPage: e.target.value })}
              placeholder="@urbanthreads.official"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Business Location: Country & City */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Business Location
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="business-country-select"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Country <span className="text-emerald-600">*</span>
              </label>
              <select
                id="business-country-select"
                required
                value={state.country || 'Pakistan'}
                onChange={(e) => updateState({ country: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="business-city-input"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between"
              >
                <span>City</span>
                <span className="text-[11px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                id="business-city-input"
                type="text"
                value={state.city || ''}
                onChange={(e) => updateState({ city: e.target.value })}
                placeholder="e.g. Lahore, Karachi, Islamabad"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Quick sample loader prompt */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need inspiration? Try pre-filling with sample store details.</span>
          </div>
          <button
            type="button"
            id="load-sample-clothing-brand-btn"
            onClick={() => {
              updateState({
                businessName: 'Urban Threads',
                businessCategory: 'Fashion & Apparel',
                businessDescription:
                  'We sell premium men’s and women’s clothing online across Pakistan.',
                businessWebsite: 'https://urbanthreads.pk',
                instagramPage: '@urbanthreads.official',
                country: 'Pakistan',
                city: 'Lahore',
              });
            }}
            className="text-emerald-700 font-semibold hover:text-emerald-800 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Auto-fill Urban Threads
          </button>
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          id="step1-continue-btn"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </form>
  );
};

