import React, { useState } from 'react';
import { WizardState } from '../types';
import {
  MessageCircle,
  Search,
  CheckCheck,
  Send,
  User,
  Bot,
  UserCheck,
  ShieldCheck,
  X,
  Phone,
  MoreVertical,
  ChevronLeft,
} from 'lucide-react';

interface LiveInboxProps {
  state: WizardState;
  onClose: () => void;
}

interface Thread {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isHumanHandedOff?: boolean;
  messages: Array<{
    id: string;
    sender: 'customer' | 'ai' | 'human';
    text: string;
    time: string;
  }>;
}

export const LiveInboxModal: React.FC<LiveInboxProps> = ({ state, onClose }) => {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 't-1',
      name: 'Ali Khan',
      phone: '+92 301 5592812',
      avatarColor: 'bg-emerald-600',
      lastMessage: 'I would like to order the Premium Oversized T-Shirt in size L.',
      time: '11:20 AM',
      unreadCount: 0,
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Hi, is this shirt available in black?',
          time: '11:18 AM',
        },
        {
          id: 'm2',
          sender: 'ai',
          text: 'Yes! The Premium Oversized T-Shirt is available in Black. We currently have sizes S, M, L and XL. Would you like to place an order?',
          time: '11:18 AM',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'I would like to order the Premium Oversized T-Shirt in size L. Can you deliver to Lahore with Cash on Delivery?',
          time: '11:20 AM',
        },
        {
          id: 'm4',
          sender: 'ai',
          text: 'Absolutely! We offer Cash on Delivery across Pakistan. Please provide your full delivery address and contact number to confirm the booking for Rs. 2,499.',
          time: '11:20 AM',
        },
      ],
    },
    {
      id: 't-2',
      name: 'Zoya Fatima',
      phone: '+92 321 8840192',
      avatarColor: 'bg-indigo-600',
      lastMessage: 'Delivery charges kitnay hain?',
      time: '10:45 AM',
      unreadCount: 1,
      messages: [
        {
          id: 'm21',
          sender: 'customer',
          text: 'Delivery charges kitnay hain?',
          time: '10:45 AM',
        },
        {
          id: 'm22',
          sender: 'ai',
          text: 'Delivery standard charges Rs. 250 hain, aur Rs. 4,500 se ooper k orders pe free shipping milti hai!',
          time: '10:45 AM',
        },
      ],
    },
    {
      id: 't-3',
      name: 'Hamza Malik',
      phone: '+92 333 4102983',
      avatarColor: 'bg-amber-600',
      lastMessage: 'I want to speak with a human manager regarding wholesale discount.',
      time: '09:15 AM',
      unreadCount: 0,
      isHumanHandedOff: true,
      messages: [
        {
          id: 'm31',
          sender: 'customer',
          text: 'I want to place a custom order for 200 shirts.',
          time: '09:12 AM',
        },
        {
          id: 'm32',
          sender: 'ai',
          text: 'I am immediately transferring you to our wholesale team manager. A team member will reply here shortly!',
          time: '09:12 AM',
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('t-1');
  const [replyText, setReplyText] = useState('');
  const [takeOverMode, setTakeOverMode] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: takeOverMode ? ('human' as const) : ('ai' as const),
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: replyText.trim(),
            }
          : t
      )
    );
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>WhatsApp Live Business Inbox</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Meta Official API Connected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {state.businessName || 'Urban Wear'} • AI Auto-Responder Active
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Threads List Sidebar */}
          <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search WhatsApp chats..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border border-transparent focus:bg-white focus:border-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {threads.map((thread) => {
                const isSelected = thread.id === activeThread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-white shadow-2xs border-l-4 border-emerald-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${thread.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                    >
                      {thread.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {thread.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{thread.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{thread.lastMessage}</p>
                      {thread.isHumanHandedOff && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          Human Handled
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="flex-1 flex flex-col bg-[#efeae2]/30">
            {/* Conversation Header */}
            <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${activeThread.avatarColor} text-white font-bold text-xs flex items-center justify-center`}
                >
                  {activeThread.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    {activeThread.name}
                    <span className="text-[11px] font-normal text-slate-500 font-mono">
                      {activeThread.phone}
                    </span>
                  </h4>
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    AI Agent Active ({state.tone} tone)
                  </div>
                </div>
              </div>

              {/* Human Takeover Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTakeOverMode(!takeOverMode)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    takeOverMode
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{takeOverMode ? 'Human Mode Active' : 'Take Over Chat'}</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
              {activeThread.messages.map((m) => {
                const isCustomer = m.sender === 'customer';
                const isHuman = m.sender === 'human';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed ${
                        isCustomer
                          ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                          : isHuman
                          ? 'bg-amber-600 text-white rounded-tr-xs'
                          : 'bg-emerald-700 text-white rounded-tr-xs'
                      }`}
                    >
                      <div className="text-[10px] font-semibold opacity-75 mb-1 flex items-center gap-1">
                        {isCustomer ? (
                          'Customer'
                        ) : isHuman ? (
                          'Store Manager (Human)'
                        ) : (
                          <>
                            <Bot className="w-3 h-3 inline" />
                            <span>AI Employee</span>
                          </>
                        )}
                      </div>
                      {m.text}
                      <div className="text-[10px] opacity-70 text-right mt-1 flex items-center justify-end gap-1">
                        <span>{m.time}</span>
                        {!isCustomer && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Bar */}
            <form
              onSubmit={handleSendReply}
              className="bg-white border-t border-slate-200 p-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  takeOverMode
                    ? 'Reply manually as store team member...'
                    : 'Simulate AI reply or type response...'
                }
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
