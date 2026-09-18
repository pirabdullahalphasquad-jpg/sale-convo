export type WizardStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WizardStepMeta {
  id: WizardStepId;
  label: string;
  subtitle: string;
}

export interface WizardData {
  businessName: string;
  businessCategory: string;
  businessDescription: string;
  isWhatsappConnected: boolean;
  knowledgeArticles: number;
  catalogProducts: number;
  toneOfVoice: string;
  languages: string[];
  humanHandoffConditions: number;
  neverGuessPolicy: string;
}

export const BUSINESS_CATEGORIES = [
  "Fashion & Apparel",
  "Electronics",
  "Beauty & Personal Care",
  "Food & Beverage",
  "Home & Living",
  "Health & Wellness",
  "Services & Consulting",
  "Other",
] as const;
