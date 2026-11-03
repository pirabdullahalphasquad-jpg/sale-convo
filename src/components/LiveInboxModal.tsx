import React, { useEffect, useState } from 'react';
import { WizardState } from '../types';
import { supabase } from '../lib/chatApi';
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

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const LiveInboxModal: React.FC<LiveInboxProps> = ({ state, onClose }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [takeOverMode, setTakeOverMode] = useState(false);

  useEffect(() => {
    async function fetchModalInbox() {
      try {
        const { data: convs, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .order('created_at', { ascending: false });

        if (convError) {
          console.error('Error fetching conversations:', convError);
          return;
        }

        if (!convs || convs.length === 0) {
          setThreads([]);
          return;
        }

        const loadedThreads: Thread[] = await Promise.all(
          convs.map(async (c, index) => {
            const { data: msgs, error: msgError } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', c.id)
              .order('created_at', { ascending: true });

            if (msgError) {
              console.error('Error fetching messages:', msgError);
            }

            const messages = (msgs || []).map((m: any) => {
              const timeStr = m.created_at
                ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : nowTime();
              return {
                id: m.id,
                sender: m.sender || (m.direction === 'inbound' ? 'customer' : 'ai'),
                text: m.body || '',
                time: timeStr,
              };
            });

            const lastMsg = messages[messages.length - 1]?.text || 'No messages';
            const lastTime = messages[messages.length - 1]?.time || nowTime();
            const avatarColors = ['bg-emerald-600', 'bg-indigo-600', 'bg-amber-600', 'bg-purple-600', 'bg-blue-600'];

            return {
              id: c.id,
              name: c.customer_name || 'Customer',
              phone: c.customer_phone || '',
              avatarColor: avatarColors[index % avatarColors.length],
              lastMessage: lastMsg,
              time: lastTime,
              unreadCount: 0,
              isHumanHandedOff: false,
              messages: messages.length > 0 ? messages : [
                {
                  id: 'init',
                  sender: 'ai',
                  text: 'Conversation initialized.',
                  time: nowTime(),
                }
              ],
            };
          })
        );

        setThreads(loadedThreads);
        setActiveThreadId((prev) => (prev && loadedThreads.some(t => t.id === prev) ? prev : loadedThreads[0]?.id || ''));
      } catch (err) {
        console.error('Failed to load modal inbox:', err);
      }
    }

    fetchModalInbox();

    const channel = supabase
      .channel('public:modal_conversations_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchModalInbox();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchModalInbox();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const text = replyText.trim();
    const sender = takeOverMode ? ('human' as const) : ('ai' as const);

    try {
      const { data, error } = await supabase.from('messages').insert([{
        conversation_id: activeThread.id,
        direction: 'outbound',
        sender,
        body: text,
      }]).select('*').single();

      if (error) {
        console.error('Error sending reply:', error);
      }

      const newMsg = {
        id: data?.id || `m-${Date.now()}`,
        sender,
        text,
        time: nowTime(),
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? {
                ...t,
                messages: [...t.messages, newMsg],
                lastMessage: text,
                time: nowTime(),
              }
            : t
        )
      );
      setReplyText('');
    } catch (err) {
      console.error('Error in handleSendReply:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base">WhatsApp Live Business Inbox</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Webhook Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time customer conversations for {state.businessName || 'Your Business'} via Supabase & WhatsApp Cloud API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        {!activeThread ? (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
            No conversations found in the database. Send a message to your WhatsApp webhook to start chatting.
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Threads */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
              <div className="p-3 border-b border-slate-200 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setThreads((prev) =>
                        prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
                      );
                    }}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      thread.id === activeThread.id ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${thread.avatarColor} text-white font-bold flex items-center justify-center shrink-0`}>
                      {thread.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-slate-900 truncate">{thread.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{thread.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{thread.phone}</div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className="text-[11px] text-slate-600 truncate">{thread.lastMessage}</p>
                        {thread.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      {thread.isHumanHandedOff && (
                        <span className="inline-block mt-1 bg-amber-50 text-amber-700 text-[9px] font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                          Human Handover
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col bg-[#efeae2]/40 min-w-0">
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full ${activeThread.avatarColor} text-white font-bold flex items-center justify-center shrink-0`}>
                    {activeThread.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{activeThread.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {activeThread.phone} • WhatsApp Customer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setTakeOverMode(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        !takeOverMode ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5 inline mr-1" /> AI Active ({state.agentName || 'Sara'})
                    </button>
                    <button
                      onClick={() => setTakeOverMode(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        takeOverMode ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Human Takeover
                    </button>
                  </div>
                </div>
              </div>

              {takeOverMode && (
                <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 flex items-center justify-between shrink-0">
                  <span className="flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-4 h-4 text-amber-600" /> You are manually replying as a human agent. AI is paused for this thread.
                  </span>
                  <button
                    onClick={() => setTakeOverMode(false)}
                    className="text-xs underline font-semibold text-amber-900 hover:text-amber-950 cursor-pointer"
                  >
                    Return to AI Mode
                  </button>
                </div>
              )}

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeThread.messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                          isCustomer
                            ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                            : msg.sender === 'ai'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-tr-xs'
                            : 'bg-amber-50 border border-amber-200 text-amber-950 rounded-tr-xs'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-bold text-[10px] mb-1 opacity-70">
                          {isCustomer ? (
                            <><User className="w-3 h-3" /> {activeThread.name}</>
                          ) : msg.sender === 'ai' ? (
                            <><Bot className="w-3 h-3" /> {state.agentName || 'Sara'} (AI Assistant)</>
                          ) : (
                            <><UserCheck className="w-3 h-3" /> You (Merchant)</>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                          {msg.time}
                          {!isCustomer && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    takeOverMode
                      ? 'Type a reply as a human agent...'
                      : 'Switch to "Human Takeover" above to reply manually, or let AI handle...'
                  }
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
