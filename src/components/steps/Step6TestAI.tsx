import React, { useState, useRef, useEffect } from 'react';
import { SUGGESTED_TEST_QUESTIONS } from '../../data/initialData';
import { ChatMessage, WizardState } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  User,
  CheckCheck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface Step7Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step6TestAI: React.FC<Step7Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.testChatMessages, isTyping]);

  // Generate an authentic answer based on what the user configured in steps 1-6
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

    // 1. Check FAQs first
    const matchedFaq = state.faqs.find((f) =>
      q.includes(f.question.toLowerCase().slice(0, 15))
    );
    if (matchedFaq) {
      return matchedFaq.answer;
    }

    // 2. Questions about stock / t-shirts / products
    if (q.includes('stock') || q.includes('t-shirt') || q.includes('product') || q.includes('shirt') || q.includes('item')) {
      return `Yes! We currently have the ${firstProduct.name} in stock (${firstProduct.price}). Available in ${firstProduct.variants} with sizes ${firstProduct.sizes}. Would you like me to book one for you?`;
    }

    // 3. Questions about delivery time
    if (q.includes('how long') || q.includes('delivery take') || q.includes('delivery time') || q.includes('arrive') || q.includes('when')) {
      const time = state.deliveryTime || '2–5 business days';
      const charges =
        state.deliveryChargeType === 'Free delivery'
          ? 'Free delivery nationwide!'
          : state.deliveryChargeType === 'Fixed delivery fee'
          ? `Delivery fee is ${state.fixedDeliveryFee || 'PKR 200'}.`
          : 'Delivery fee varies slightly by city.';
      return `Our typical delivery time is ${time}. ${charges} All parcels are dispatched with tracked courier service.`;
    }

    // 4. Questions about payment methods
    if (q.includes('payment') || q.includes('pay') || q.includes('cash on delivery') || q.includes('cod') || q.includes('easypaisa') || q.includes('jazzcash')) {
      const methods = state.paymentMethods.length > 0
        ? state.paymentMethods.join(', ')
        : 'Cash on Delivery and Bank Transfer';
      return `We accept ${methods}! You can select your preferred payment option when confirming your order.`;
    }

    // 5. Questions about specific delivery cities (e.g. Islamabad, Lahore, etc.)
    if (q.includes('islamabad') || q.includes('lahore') || q.includes('karachi') || q.includes('deliver to') || q.includes('city')) {
      if (state.deliveryScope === 'Nationwide') {
        return `Yes, absolutely! We offer nationwide delivery across all cities, including Islamabad and Rawalpindi. Delivery takes ${state.deliveryTime || '2–5 business days'}.`;
      } else if (state.deliveryScope === 'Selected cities') {
        return `We currently deliver to: ${state.deliveryAreas || 'all major cities'}. Would you like to check a specific address?`;
      } else {
        return `We currently operate on ${state.deliveryScope.toLowerCase()} delivery. Let us know your address and we'll check shipping feasibility!`;
      }
    }

    // 6. Questions about return & exchange policy
    if (q.includes('return') || q.includes('exchange') || q.includes('refund')) {
      if (state.acceptReturns) {
        return `Yes! ${state.returnPolicy || 'Returns are accepted within 7 days if the product is unused and in original condition.'}`;
      } else {
        return `Due to nature of our catalog, all sales are final and we do not accept returns unless an item arrives defective or damaged.`;
      }
    }

    // 7. Tone-styled default answer with strict guardrail adherence
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

    // Realistic WhatsApp latency
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 7 of 7
          </span>
          <span className="text-xs text-slate-400">• Interactive WhatsApp Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Test your AI Sales Agent
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Chat with SaleConvo to see how it responds to real customer questions using your business details, products, and policies.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-4">
        {/* Suggested Questions Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Suggested test questions (click to ask):</span>
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
                  {state.businessName || 'Urban Threads'} (AI Agent: {state.agentName || 'Sara'})
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-100 font-medium">
                    online • WhatsApp Cloud API
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
              placeholder="Type a message to test your AI… (e.g. What is your return policy?)"
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

        {/* Feedback notice toast */}
        {feedbackNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-medium animate-in fade-in">
            {feedbackNotice}
          </div>
        )}

        {/* Reassurance Guardrail */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI strictly answers from your knowledge base and products. Never hallucinates.</span>
          </div>
          <span className="font-semibold text-emerald-700 text-[11px]">Ready to Activate</span>
        </div>
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
          <span>Back</span>
        </button>

        <button
          type="button"
          id="step7-continue-btn"
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
        >
          <span>Continue to Activate Agent</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
