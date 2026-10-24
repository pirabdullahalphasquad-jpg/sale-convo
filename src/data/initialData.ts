import { WizardState } from '../types';

export const INITIAL_WIZARD_STATE: WizardState = {
  currentStep: 1,
  completedSteps: [],

  // Step 1: Tell Us About Your Business
  businessName: '',
  businessCategory: '',
  businessDescription: '',
  businessWebsite: '',
  instagramPage: '',
  country: 'Pakistan',
  city: '',

  // Step 2: Connect WhatsApp
  whatsappConnected: false,
  whatsappPhoneNumber: '',
  whatsappBusinessName: '',
  whatsappSkipped: false,

  // Step 3: Teach SaleConvo About Your Business
  aboutBusiness: '',
  faqs: [],

  // Step 4: Delivery, Payment & Policies
  deliveryScope: 'Nationwide',
  deliveryAreas: '',
  deliveryTime: '',
  deliveryChargeType: 'Fixed delivery fee',
  fixedDeliveryFee: '',
  paymentMethods: [],
  acceptReturns: true,
  returnPolicy: '',

  // Step 5: Add Your Products
  products: [],

  // Step 6: Configure Your AI Sales Agent
  aiName: '',
  agentName: '',
  tone: 'Friendly & Helpful',
  languages: ['English', 'Urdu', 'Roman Urdu'],
  responseStyle: 'Short & Direct',
  salesProactiveOrder: true,
  proactiveSales: {
    recommendProducts: true,
    askForSale: true,
    offerHelpIfInactive: true,
  },
  humanHandoffTriggers: [
    'Customer asks for a human agent',
    'Customer is angry or dissatisfied',
    'Question cannot be answered by available information',
  ],
  neverGuess: true,

  // Step 7: Test Your AI
  testChatMessages: [],

  // Final: Activate
  isActivated: false,
};

export const CATEGORY_OPTIONS = [
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Electronics',
  'Food & Restaurant',
  'Home & Lifestyle',
  'Health & Wellness',
  'Services',
  'Education',
  'Other',
] as const;

export const SUGGESTED_FAQ_QUESTIONS = [
  {
    question: 'What are your payment methods?',
    answer: 'We accept Cash on Delivery, Bank Transfer, Easypaisa, and JazzCash.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Typical delivery time is 2–5 business days nationwide.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, we offer Cash on Delivery (COD) across Pakistan.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 7 days if the product is unused and in original condition.',
  },
  {
    question: 'How can I place an order?',
    answer: 'Simply share the item name, your preferred size, and complete delivery address with contact number.',
  },
  {
    question: 'Do you deliver nationwide?',
    answer: 'Yes, we deliver nationwide across Pakistan to all major cities and towns.',
  },
];

export const SUGGESTED_TEST_QUESTIONS = [
  { label: 'Check availability', query: 'Is the black T-shirt available in Medium?' },
  { label: 'Ask about price', query: "What's the price of the Premium Cotton T-Shirt?" },
  { label: 'Ask about delivery', query: 'How long does delivery take to Peshawar?' },
  { label: 'Ask about returns', query: 'What is your return and exchange policy?' },
  { label: 'Place an order', query: 'I want to order this in size Large with Cash on Delivery.' },
];

