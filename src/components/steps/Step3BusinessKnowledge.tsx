import React, { useState } from 'react';
import { FAQItem, WizardState } from '../../types';
import { SUGGESTED_FAQ_QUESTIONS } from '../../data/initialData';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface Step3Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3BusinessKnowledge: React.FC<Step3Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };

    updateState({
      faqs: [...state.faqs, newFaq],
    });

    setNewQuestion('');
    setNewAnswer('');
    setShowAddFaqModal(false);
  };

  const handleSelectSuggestedQuestion = (item: { question: string; answer: string }) => {
    // If not already in faqs, pre-populate modal
    setNewQuestion(item.question);
    setNewAnswer(item.answer);
    setShowAddFaqModal(true);
  };

  const handleQuickAddSuggested = (item: { question: string; answer: string }) => {
    if (state.faqs.some((f) => f.question.toLowerCase() === item.question.toLowerCase())) {
      return;
    }
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      question: item.question,
      answer: item.answer,
    };
    updateState({
      faqs: [...state.faqs, newFaq],
    });
  };

  const handleRemoveFaq = (id: string) => {
    updateState({
      faqs: state.faqs.filter((faq) => faq.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 3 of 7
          </span>
          <span className="text-xs text-slate-400">• Business Knowledge</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Give your AI the information it needs
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Add the information customers ask about most often. SaleConvo will use this information to answer accurately.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-7">
        {/* Section 1: About your business */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="about-business-textarea"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              About Your Business
            </label>
            <span className="text-xs text-slate-400 font-medium">Core information</span>
          </div>
          <p className="text-xs text-slate-500">
            Tell customers about your business, products, or services.
          </p>
          <textarea
            id="about-business-textarea"
            rows={3}
            value={state.aboutBusiness}
            onChange={(e) => updateState({ aboutBusiness: e.target.value })}
            placeholder="e.g. Urban Threads is an online fashion store offering premium casual clothing for men and women."
            className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs resize-none"
          />
        </div>

        {/* Section 2: Frequently asked questions */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>Frequently Asked Questions</span>
                <span className="text-xs font-normal text-slate-400">({state.faqs.length} added)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Common questions your AI Sales Agent can answer instantly on WhatsApp.
              </p>
            </div>
            <button
              type="button"
              id="add-faq-modal-btn"
              onClick={() => {
                setNewQuestion('');
                setNewAnswer('');
                setShowAddFaqModal(true);
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add FAQ</span>
            </button>
          </div>

          {/* Pre-populate suggested question chips */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Popular suggested questions (click to quickly add):</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTED_FAQ_QUESTIONS.map((item) => {
                const isAdded = state.faqs.some(
                  (f) => f.question.toLowerCase() === item.question.toLowerCase()
                );
                return (
                  <button
                    type="button"
                    key={item.question}
                    onClick={() => {
                      if (!isAdded) handleQuickAddSuggested(item);
                      else handleSelectSuggestedQuestion(item);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium'
                        : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {isAdded ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <Plus className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                    <span>{item.question}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-2.5">
            {state.faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start justify-between gap-3 group hover:border-slate-300 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
                  </div>
                  <p className="text-xs text-slate-600 pl-5.5 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(faq.id)}
                  title="Remove FAQ"
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg opacity-70 group-hover:opacity-100 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {state.faqs.length === 0 && (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-500">
                No FAQs added yet. Click "+ Add FAQ" or select any suggested question above.
              </div>
            )}
          </div>
        </div>

        {/* Informational reassurance */}
        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Next up: </span>
            In Step 4, you will configure your exact delivery, payment methods, and return policy so your AI never has to guess financial or delivery terms.
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step3-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="step3-continue-btn"
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Add FAQ Modal */}
      {showAddFaqModal && (
        <div
          id="add-faq-modal"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">Add FAQ Item</h4>
              <button
                type="button"
                onClick={() => setShowAddFaqModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFaq} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Question
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What payment methods do you accept?"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AI Answer
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. We accept Cash on Delivery and bank transfer."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-faq-btn"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

