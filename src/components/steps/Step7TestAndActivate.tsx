import React, { useState, useRef, useEffect } from 'react';
import { SUGGESTED_TEST_QUESTIONS } from '../../data/initialData';
import { ChatMessage, WizardState } from '../../types';
import {
  ArrowLeft,
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  User,
  CheckCheck,
  RotateCcw,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  MessageSquare,
  QrCode,
  ExternalLink,
  Loader2,
  Check,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';

interface Step7Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onActivate: () => void;
  onBack: () => void;
  onJumpToStep: (step: number) => void;
}

export const Step7TestAndActivate: React.FC<Step7Props> = ({
  state,
  updateState,
  onActivate,
  onBack,
  onJumpToStep,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'test' | 'activate'>('test');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isActivatedLocal, setIsActivatedLocal] = useState(state.isActivated);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSubTab === 'test') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.testChatMessages, isTyping, activeSubTab]);

  const cleanPhone = (state.whatsappPhoneNumber || '+92 300 1234567').replace(/[^0-9]/g, '');
  const whatsappTestUrl = `https://wa.me/${cleanPhone}?text=Hi%2C%20I%20have%20a%20question%20about%20your%20products`;

  // Dynamic AI reply generator grounded in user's real business setup
  const generateAIResponse = (userQuestion: string): string => {
    const q = userQuestion.toLowerCase();
    const brand = state.businessName || 'Urban Threads';
    const firstProduct = state.products[0] || {
      name: 'Premium Cotton T-Shirt',
      price: 'PKR 2,499',
      sizes: 'S, M, L, XL',
      variants: 'Black, White, Navy',
      availability: 'In stock',
    };

    // 1. Check exact FAQs first
    const matchedFaq = state.faqs.find((f) =>
      q.includes(f.question.toLowerCase().slice(0, 15))
    );
    if (matchedFaq) {
      return matchedFaq.answer;
    }

    // 2. Stock / products / t-shirts inquiry
    if (q.includes('stock') || q.includes('t-shirt') || q.includes('product') || q.includes('shirt') || q.includes('item') || q.includes('clothes')) {
      return `Yes! We currently have the ${firstProduct.name} in stock (${firstProduct.price}). Available in ${firstProduct.variants} with sizes ${firstProduct.sizes}. Would you like me to book one for you?`;
    }

    // 3. Delivery timeline inquiry
    if (q.includes('how long') || q.includes('delivery take') || q.includes('delivery time') || q.includes('arrive') || q.includes('ship')) {
      const time = state.deliveryTime || '2–5 business days';
      const charges =
        state.deliveryChargeType === 'Free delivery'
          ? 'We offer free delivery nationwide!'
          : state.deliveryChargeType === 'Fixed delivery fee'
          ? `Standard delivery fee is ${state.fixedDeliveryFee || 'PKR 200'}.`
          : 'Delivery fee is calculated based on destination.';
      return `Our typical delivery time is ${time}. ${charges} All parcels come with real-time courier tracking sent directly to your WhatsApp.`;
    }

    // 4. Payment methods inquiry
    if (q.includes('payment') || q.includes('pay') || q.includes('cash on delivery') || q.includes('cod') || q.includes('easypaisa') || q.includes('jazzcash') || q.includes('card')) {
      const methods = state.paymentMethods.length > 0
        ? state.paymentMethods.join(', ')
        : 'Cash on Delivery and Bank Transfer';
      return `We accept ${methods}! You can select your preferred payment option when confirming your order.`;
    }

    // 5. City delivery inquiry (Islamabad, Karachi, Lahore, etc.)
    if (q.includes('islamabad') || q.includes('lahore') || q.includes('karachi') || q.includes('deliver to') || q.includes('city')) {
      if (state.deliveryScope === 'Nationwide') {
        return `Yes, absolutely! We offer nationwide delivery across all cities, including Islamabad, Rawalpindi, Lahore, and Karachi. Delivery takes ${state.deliveryTime || '2–5 business days'}.`;
      } else if (state.deliveryScope === 'Selected cities') {
        return `We currently deliver to: ${state.deliveryAreas || 'all major cities'}. Would you like to check a specific address?`;
      } else {
        return `We currently operate on ${state.deliveryScope.toLowerCase()} delivery. Let us know your address and we'll confirm delivery coverage!`;
      }
    }

    // 6. Return & Exchange policy inquiry
    if (q.includes('return') || q.includes('exchange') || q.includes('refund')) {
      if (state.acceptReturns) {
        return `Yes! ${state.returnPolicy || 'Returns are accepted within 7 days if the product is unused and in original packaging.'}`;
      } else {
        return `Due to the nature of our catalog, all sales are final. However, if an item arrives damaged or defective, our human team will immediately assist with an exchange.`;
      }
    }

    // 7. Tone-based polite fallback with guardrail
    const agentName = state.agentName || 'Sara';
    if (state.tone === 'Professional & Polite') {
      return `Thank you for contacting ${brand}. This is ${agentName}. Regarding "${userQuestion}": our catalog is updated for seamless shopping. May I assist you with placing your order or checking sizing?`;
    } else if (state.tone === 'Casual & Energetic') {
      return `Hey there! ${agentName} from ${brand} here. We've got you covered! Check out our bestsellers like the ${firstProduct.name}. Want me to hold one in your size?`;
    } else if (state.tone === 'Luxury & Sophisticated') {
      return `Welcome to ${brand}. It is our pleasure to assist you. The ${firstProduct.name} reflects our commitment to premium craftsmanship. How may I further assist your selection today?`;
    } else {
      return `Hi! This is ${agentName} from ${brand}. We're glad you reached out! You can explore our ${firstProduct.name} starting at ${firstProduct.price}. Let me know if you would like me to reserve an item for you!`;
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: query,
      timestamp: time,
    };

    updateState({
      testChatMessages: [...state.testChatMessages, userMsg],
    });
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateState({
        testChatMessages: [...state.testChatMessages, userMsg, aiMsg],
      });
      setIsTyping(false);
    }, 650);
  };

  const handleFeedback = (msgId: string, type: 'good' | 'bad') => {
    updateState({
      testChatMessages: state.testChatMessages.map((m) =>
        m.id === msgId ? { ...m, feedback: type } : m
      ),
    });
    setFeedbackNotice(
      type === 'good'
        ? 'Great! Your AI will prioritize answers formatted like this.'
        : 'Feedback noted. Response parameters adjusted.'
    );
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleResetChat = () => {
    updateState({
      testChatMessages: [
        {
          id: 'msg-seed-1',
          sender: 'customer',
          text: 'Do you have any T-shirts in stock?',
          timestamp: '10:42 AM',
        },
        {
          id: 'msg-seed-2',
          sender: 'ai',
          text: `Yes! We have the ${state.products[0]?.name || 'Premium Cotton T-Shirt'} in stock (${state.products[0]?.price || 'PKR 2,499'}). Available in ${state.products[0]?.variants || 'Black, White'} with sizes ${state.products[0]?.sizes || 'S, M, L, XL'}. Would you like to place an order?`,
          timestamp: '10:42 AM',
          feedback: 'good',
        },
      ],
    });
  };

  const handleActivateSaleConvo = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsActivatedLocal(true);
      updateState({
        isActivated: true,
        activatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setTimeout(() => {
        onActivate();
      }, 900);
    }, 1100);
  };

  const checklistItems = [
    {
      title: 'Business Information',
      detail: `${state.businessName || 'Urban Threads'} • ${state.businessCategory}`,
      step: 1,
    },
    {
      title: 'WhatsApp Business API',
      detail: state.whatsappConnected
        ? `Connected to ${state.whatsappPhoneNumber}`
        : state.whatsappSkipped
        ? 'Connected via Cloud Sandbox (+92 300 1234567)'
        : `Connected to ${state.whatsappPhoneNumber || '+92 300 1234567'}`,
      step: 2,
    },
    {
      title: 'Business Knowledge & FAQs',
      detail: `${state.faqs.length} FAQs and custom business knowledge facts`,
      step: 3,
    },
    {
      title: 'Delivery, Payment & Policies',
      detail: `${state.deliveryScope} • ${state.deliveryTime} • ${state.paymentMethods.length} payment methods`,
      step: 4,
    },
    {
      title: 'Product Catalog',
      detail: `${state.products.length} products with prices, sizes, and stock availability`,
      step: 5,
    },
    {
      title: 'AI Agent Persona & Tone',
      detail: `Agent ${state.agentName || 'Sara'} • ${state.tone} • ${state.responseStyle}`,
      step: 6,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Step 7 of 7
            </span>
            <span className="text-xs text-slate-400">• The Finish Line</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeSubTab === 'test' ? 'Test your AI Sales Agent' : 'Your AI Sales Agent is ready!'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
            {activeSubTab === 'test'
              ? 'Chat with SaleConvo to see how it responds to real customer questions using your business details, products, and policies.'
              : 'SaleConvo is connected to your WhatsApp number and ready to respond to customers.'}
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('test')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'test'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Test AI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('activate')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'activate'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Activate & Launch</span>
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        {/* SUBTAB 1: TEST AI SANDBOX */}
        {activeSubTab === 'test' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Suggested Questions Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suggested test questions (click to test):</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Chat</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TEST_QUESTIONS.map((item) => (
                  <button
                    key={item.query}
                    type="button"
                    id={`suggested-q-${item.query.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleSendMessage(item.query)}
                    className="text-xs font-medium text-slate-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-full transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{item.query}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp-Style Chat UI */}
            <div className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs bg-[#f0f2f5]">
              {/* Chat Header */}
              <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-xs">
                    <Bot className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      {state.businessName || 'Urban Threads'} (Agent: {state.agentName || 'Sara'})
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] text-emerald-100 font-medium">
                        online • WhatsApp Cloud API Sandbox
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-200 bg-[#054c44] px-2.5 py-1 rounded-lg">
                  Tone: <strong className="text-white">{state.tone}</strong>
                </div>
              </div>

              {/* Messages scroll area */}
              <div className="p-4 sm:p-5 space-y-3.5 max-h-[360px] min-h-[260px] overflow-y-auto bg-[#efeae2]/60">
                {state.testChatMessages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-2xs text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                          isCustomer
                            ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-[#bbf7b0]'
                            : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                        }`}
                      >
                        <div className="font-semibold text-[11px] mb-1 opacity-70 flex items-center gap-1">
                          {isCustomer ? (
                            <>
                              <User className="w-3 h-3 text-slate-600" />
                              <span>Customer</span>
                            </>
                          ) : (
                            <>
                              <Bot className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-800 font-bold">{state.agentName || 'Sara'}</span>
                            </>
                          )}
                        </div>
                        {msg.text}
                        <div className="text-[10px] mt-1.5 flex items-center justify-end gap-1 text-slate-400">
                          <span>{msg.timestamp}</span>
                          {isCustomer && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                      </div>

                      {/* Feedback Section for AI messages */}
                      {!isCustomer && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 pl-1">
                          <span className="text-[10px] text-slate-400">
                            Does this answer look right?
                          </span>
                          <button
                            type="button"
                            id={`feedback-good-${msg.id}`}
                            onClick={() => handleFeedback(msg.id, 'good')}
                            className={`p-1 rounded-md transition-colors cursor-pointer text-[10px] flex items-center gap-1 ${
                              msg.feedback === 'good'
                                ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                : 'hover:bg-slate-200 text-slate-500'
                            }`}
                            title="Good answer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Good</span>
                          </button>
                          <button
                            type="button"
                            id={`feedback-bad-${msg.id}`}
                            onClick={() => handleFeedback(msg.id, 'bad')}
                            className={`p-1 rounded-md transition-colors cursor-pointer text-[10px] flex items-center gap-1 ${
                              msg.feedback === 'bad'
                                ? 'bg-red-100 text-red-800 font-semibold'
                                : 'hover:bg-slate-200 text-slate-500'
                            }`}
                            title="Needs improvement"
                          >
                            <ThumbsDown className="w-3 h-3" />
                            <span>Needs edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs w-28 shadow-2xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <span className="text-[11px] text-slate-400 ml-1">Typing...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Message input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  id="test-chat-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message to test your AI… (e.g. Can I return an item?)"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <button
                  type="submit"
                  id="test-chat-send-btn"
                  disabled={!inputText.trim() || isTyping}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {feedbackNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-medium animate-in fade-in">
                {feedbackNotice}
              </div>
            )}

            {/* Quick banner to proceed */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-950 block">
                  Satisfied with the responses?
                </span>
                <span className="text-xs text-emerald-800/80 block">
                  Proceed to activate your agent on your connected WhatsApp number.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('activate')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <span>Activate SaleConvo →</span>
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ACTIVATE & LAUNCH */}
        {activeSubTab === 'activate' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Status Card & WhatsApp Integration */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                {/* WhatsApp Connection info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#25d366]/15 border border-[#25d366]/30 flex items-center justify-center text-[#128c7e] shrink-0 shadow-2xs">
                    <MessageSquare className="w-6 h-6 text-[#128c7e]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      WhatsApp Number Connected
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-base font-bold text-slate-900">
                        {state.whatsappPhoneNumber || '+92 300 1234567'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent Status Badge */}
                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Agent Status
                  </span>
                  {isActivatedLocal ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs shadow-2xs animate-in fade-in">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>🟢 SaleConvo is Active</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Ready to Activate</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Test on WhatsApp Section (QR code & link) */}
              <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="space-y-1.5 text-center md:text-left max-w-md">
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Test your agent live on your own WhatsApp</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scan the QR code or tap the button to open a conversation directly in WhatsApp and chat with {state.agentName || 'Sara'}.
                  </p>
                  <div className="pt-1.5">
                    <a
                      href={whatsappTestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300/80 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp Web / App</span>
                    </a>
                  </div>
                </div>

                {/* Simulated Clean QR Code */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center shrink-0">
                  <div className="w-24 h-24 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center text-white">
                    <QrCode className="w-full h-full text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1.5">
                    Scan to test
                  </span>
                </div>
              </div>

              {/* Big CTA: Activate SaleConvo */}
              <div className="pt-2">
                <button
                  type="button"
                  id="activate-saleconvo-big-btn"
                  disabled={isActivating || isActivatedLocal}
                  onClick={handleActivateSaleConvo}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer ${
                    isActivatedLocal
                      ? 'bg-emerald-700 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg active:scale-[0.99]'
                  }`}
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Activating SaleConvo on WhatsApp...</span>
                    </>
                  ) : isActivatedLocal ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      <span>🟢 SaleConvo is Active</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      <span>Activate SaleConvo</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] text-slate-400 text-center block mt-2">
                  You can pause or update your agent’s responses anytime in your dashboard.
                </span>
              </div>
            </div>

            {/* Configuration Checklist Overview */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Configuration Overview
                </h4>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  All steps complete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {checklistItems.map((item) => (
                  <div
                    key={item.step}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/70 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div className="truncate">
                        <h5 className="font-bold text-slate-900 truncate">{item.title}</h5>
                        <p className="text-slate-500 text-[11px] truncate">{item.detail}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onJumpToStep(item.step)}
                      className="text-slate-400 hover:text-emerald-700 font-semibold px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step7-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configure AI</span>
        </button>

        {activeSubTab === 'test' ? (
          <button
            type="button"
            onClick={() => setActiveSubTab('activate')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
          >
            <span>Proceed to Activate</span>
            <Rocket className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleActivateSaleConvo}
            disabled={isActivating || isActivatedLocal}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-80 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>{isActivatedLocal ? '🟢 SaleConvo is Active' : 'Activate SaleConvo'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
