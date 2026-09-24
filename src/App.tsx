/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppView, WizardState } from './types';
import { INITIAL_WIZARD_STATE } from './data/initialData';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { AISummaryCard } from './components/AISummaryCard';
import { Step1BusinessSetup } from './components/steps/Step1BusinessSetup';
import { Step2ConnectWhatsApp } from './components/steps/Step2ConnectWhatsApp';
import { Step3BusinessKnowledge } from './components/steps/Step3BusinessKnowledge';
import { Step4DeliveryPolicies } from './components/steps/Step4DeliveryPolicies';
import { Step5AddProducts } from './components/steps/Step5AddProducts';
import { Step5ConfigureAI } from './components/steps/Step5ConfigureAI';
import { Step7TestAndActivate } from './components/steps/Step7TestAndActivate';
import { ActivationSuccess } from './components/ActivationSuccess';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { LiveInboxModal } from './components/LiveInboxModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('wizard');
  const [wizardState, setWizardState] = useState<WizardState>(INITIAL_WIZARD_STATE);
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState((prev) => ({ ...prev, ...updates }));
  };

  const handleNextStep = () => {
    setWizardState((prev) => {
      const nextStep = prev.currentStep + 1;
      const completed = Array.from(new Set([...prev.completedSteps, prev.currentStep]));
      return {
        ...prev,
        currentStep: nextStep,
        completedSteps: completed,
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToStep = (step: number) => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: step,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivateAgent = () => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: 8, // Success screen state
      isActivated: true,
      completedSteps: [1, 2, 3, 4, 5, 6, 7],
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleResetSetup = () => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: 1,
    }));
    setCurrentView('wizard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        currentStep={wizardState.currentStep}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: Outcome Landing Page */}
        {currentView === 'landing' && (
          <LandingPage
            onStartWizard={() => {
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 2: Post-Activation Dashboard */}
        {currentView === 'dashboard' && (
          <DashboardView
            state={wizardState}
            onEditWizard={(step = 1) => {
              handleJumpToStep(step);
              setCurrentView('wizard');
            }}
            onOpenInbox={() => setShowInboxModal(true)}
          />
        )}

        {/* VIEW 3: Clean Minimal 7-Step Wizard Flow */}
        {currentView === 'wizard' && (
          <div>
            {/* Step Progress Indicator (Steps 1-7) */}
            {wizardState.currentStep <= 7 && (
              <StepIndicator
                currentStep={wizardState.currentStep}
                onSelectStep={handleJumpToStep}
                completedSteps={wizardState.completedSteps}
              />
            )}

            {/* If Step 8: Render Activation Success Screen */}
            {wizardState.currentStep === 8 ? (
              <ActivationSuccess
                state={wizardState}
                onGoToDashboard={handleGoToDashboard}
                onOpenInbox={() => setShowInboxModal(true)}
                onResetSetup={handleResetSetup}
              />
            ) : (
              /* Steps 1-7 Split View with Live AI Employee Summary */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Main Card: Current Step Content */}
                <div
                  id="wizard-step-container"
                  className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 transition-all"
                >
                  {wizardState.currentStep === 1 && (
                    <Step1BusinessSetup
                      state={wizardState}
                      updateState={updateWizardState}
                      onNext={handleNextStep}
                    />
                  )}

                  {wizardState.currentStep === 2 && (
                    <Step2ConnectWhatsApp
                      state={wizardState}
                      updateState={updateWizardState}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  )}

                  {wizardState.currentStep === 3 && (
                    <Step3BusinessKnowledge
                      state={wizardState}
                      updateState={updateWizardState}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  )}

                  {wizardState.currentStep === 4 && (
                    <Step4DeliveryPolicies
                      state={wizardState}
                      updateState={updateWizardState}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  )}

                  {wizardState.currentStep === 5 && (
                    <Step5AddProducts
                      state={wizardState}
                      updateState={updateWizardState}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  )}

                  {wizardState.currentStep === 6 && (
                    <Step5ConfigureAI
                      state={wizardState}
                      updateState={updateWizardState}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  )}

                  {wizardState.currentStep === 7 && (
                    <Step7TestAndActivate
                      state={wizardState}
                      updateState={updateWizardState}
                      onActivate={handleActivateAgent}
                      onBack={handleBackStep}
                      onJumpToStep={handleJumpToStep}
                    />
                  )}
                </div>

                {/* Right: AI Employee Summary Card (Inspired by reference summary card) */}
                <div className="lg:col-span-4">
                  <AISummaryCard state={wizardState} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Note */}
      <footer className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-semibold text-slate-700">WizeAgent</span>
            <span>•</span>
            <span>Meta Official WhatsApp Business Cloud API Architecture</span>
          </div>
          <p className="text-slate-400">
            “I'm setting up my AI employee. Not a complicated technical chatbot.”
          </p>
        </div>
      </footer>

      {/* Live Inbox Modal */}
      {showInboxModal && (
        <LiveInboxModal
          state={wizardState}
          onClose={() => setShowInboxModal(false)}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}
