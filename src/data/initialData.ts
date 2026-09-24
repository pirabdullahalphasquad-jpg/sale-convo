import { WizardState } from '../types';

export const INITIAL_WIZARD_STATE: WizardState = {
  currentStep: 1,
  completedSteps: [],

  // Step 1: Tell Us About Your Business
  businessName: 'Urban Threads',
  businessCategory: 'Fashion & Apparel',
  businessDescription:
    'We sell premium men’s and women’s clothing online across Pakistan.',
  businessWebsite: 'https://urbanthreads.pk',
  instagramPage: '@urbanthreads.official',
  country: 'Pakistan',
  city: 'Lahore',

  // Step 2: Connect WhatsApp
  whatsappConnected: false,
  whatsappPhoneNumber: '+92 300 8492019',
  whatsappBusinessName: 'Urban Threads Official',
  whatsappSkipped: false,

  // Step 3: Teach SaleConvo About Your Business
  aboutBusiness:
    'Urban Threads is an online fashion store offering premium casual clothing for men and women across Pakistan.',
  faqs: [
    {
      id: 'faq-1',
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on Delivery and bank transfer.',
    },
    {
      id: 'faq-2',
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 2–4 business days nationwide.',
    },
    {
      id: 'faq-3',
      question: 'Do you offer Cash on Delivery?',
      answer: 'Yes! Cash on Delivery is available across Pakistan.',
    },
  ],

  // Step 4: Delivery, Payment & Policies
  deliveryScope: 'Nationwide',
  deliveryAreas: 'All major cities and districts across Pakistan.',
  deliveryTime: '2–5 business days',
  deliveryChargeType: 'Fixed delivery fee',
  fixedDeliveryFee: 'PKR 200',
  paymentMethods: ['Cash on Delivery', 'Bank Transfer', 'Easypaisa', 'JazzCash'],
  acceptReturns: true,
  returnPolicy:
    'Returns are accepted within 7 days if the product is unused and in original condition.',

  // Step 5: Add Your Products
  products: [
    {
      id: 'prod-1',
      name: 'Premium Cotton T-Shirt',
      price: 'PKR 2,499',
      description: 'Premium 100% cotton oversized T-shirt with comfortable ribbed crewneck.',
      category: 'Fashion & Apparel',
      availability: 'In Stock',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
    },
    {
      id: 'prod-2',
      name: 'Relaxed Cargo Pants',
      price: 'PKR 3,899',
      description: 'Heavy-duty cotton twill relaxed fit cargo pants with 6 utility pockets.',
      category: 'Fashion & Apparel',
      availability: 'In Stock',
      sizes: ['M', 'L', 'XL'],
      colors: ['Charcoal', 'Khaki', 'Army Green'],
    },
  ],

  // Step 6: Configure Your AI Sales Agent
  aiName: 'Sara',
  agentName: 'Sara',
  tone: 'Friendly',
  languages: ['English', 'Urdu', 'Roman Urdu'],
  responseStyle: 'Short & direct',
  salesProactiveOrder: true,
  proactiveSales: {
    recommendProducts: true,
    askForSale: true,
    offerHelpIfInactive: true,
  },
  humanHandoffTriggers: [
    'Customer asks to speak to a person',
    'AI doesn’t have enough information',
    'Customer has a complaint',
    'Customer asks for something outside business policies',
    'High-value / high-intent customer',
  ],
  neverGuess: true,

  // Step 7: Test Your AI
  testChatMessages: [
    {
      id: 'msg-1',
      sender: 'customer',
      text: 'Hi, is the black T-shirt available in Medium?',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'Yes! The black T-shirt is available in Medium. Would you like to place an order?',
      timestamp: '10:42 AM',
      feedback: 'good',
    },
  ],

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

