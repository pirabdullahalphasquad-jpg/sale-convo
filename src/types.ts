export type BusinessCategory =
  | 'Fashion & Apparel'
  | 'Beauty & Cosmetics'
  | 'Electronics'
  | 'Food & Restaurant'
  | 'Home & Lifestyle'
  | 'Health & Wellness'
  | 'Services'
  | 'Education'
  | 'Other';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  description: string;
  category?: string;
  availability: 'In Stock' | 'Out of Stock' | 'Coming Soon' | 'In stock' | 'Out of stock' | 'Coming soon';
  sizes: string[] | string;
  colors?: string[] | string;
  variants?: string;
  image?: string;
  imageUrl?: string;
}

export type AgentTone =
  | 'Friendly'
  | 'Professional'
  | 'Casual'
  | 'Custom'
  | 'Friendly & Helpful'
  | 'Professional & Polite'
  | 'Casual & Energetic'
  | 'Luxury & Sophisticated';

export type ResponseStyle =
  | 'Short & direct'
  | 'Short & Direct'
  | 'Friendly & conversational'
  | 'Detailed & Informative'
  | 'Detailed when needed';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai';
  text: string;
  timestamp: string;
  feedback?: 'good' | 'bad';
  productSnippet?: {
    name: string;
    price: string;
    availability: string;
  };
}

export type DeliveryScope = 'Nationwide' | 'Selected cities' | 'International' | 'Pickup only';
export type DeliveryChargeType = 'Free delivery' | 'Fixed delivery fee' | 'Varies by location';

export interface WizardState {
  currentStep: number;
  completedSteps: number[];
  
  // Step 1: Tell Us About Your Business
  businessName: string;
  businessCategory: BusinessCategory | '';
  businessDescription: string;
  businessWebsite?: string;
  instagramPage?: string;
  country: string;
  city?: string;

  // Step 2: Connect WhatsApp
  whatsappConnected: boolean;
  whatsappPhoneNumber: string;
  whatsappBusinessName: string;
  whatsappSkipped: boolean;

  // Step 3: Teach SaleConvo About Your Business
  aboutBusiness: string;
  faqs: FAQItem[];

  // Step 4: Delivery, Payment & Policies
  deliveryScope: DeliveryScope;
  deliveryAreas: string;
  deliveryTime: string;
  deliveryChargeType: DeliveryChargeType;
  fixedDeliveryFee: string;
  paymentMethods: string[];
  otherPaymentMethod?: string;
  acceptReturns: boolean;
  returnPolicy: string;

  // Step 5: Add Your Products
  products: ProductItem[];

  // Step 6: Configure Your AI Sales Agent
  aiName: string;
  agentName?: string;
  tone: AgentTone;
  customToneText?: string;
  languages: string[];
  responseStyle: ResponseStyle;
  salesProactiveOrder: boolean;
  proactiveSales: {
    recommendProducts: boolean;
    askForSale: boolean;
    offerHelpIfInactive: boolean;
  };
  humanHandoffTriggers: string[];
  neverGuess: boolean;

  // Step 7: Test Your AI
  testChatMessages: ChatMessage[];

  // Final: Activate
  isActivated: boolean;
  activatedAt?: string;
}

export type AppView = 'wizard' | 'landing' | 'dashboard' | 'inbox';

