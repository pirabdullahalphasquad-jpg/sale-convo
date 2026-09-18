import { create } from "zustand";
import type { WizardData, WizardStepId } from "@/types/wizard";

interface WizardState extends WizardData {
  currentStep: WizardStepId;
  setCurrentStep: (step: WizardStepId) => void;
  updateWizardData: (partialData: Partial<WizardData>) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  businessName: "Urban Wear",
  businessCategory: "Fashion & Apparel",
  businessDescription: "",
  isWhatsappConnected: false,
  knowledgeArticles: 2,
  catalogProducts: 2,
  toneOfVoice: "Friendly",
  languages: ["English", "Urdu", "Roman Urdu"],
  humanHandoffConditions: 4,
  neverGuessPolicy: "Active (Strict Safe)",
  setCurrentStep: (step) => set({ currentStep: step }),
  updateWizardData: (partialData) => set(partialData),
}));
