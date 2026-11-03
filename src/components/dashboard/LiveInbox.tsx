import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Hand, Search, Send, User, UserCog } from 'lucide-react';
import { WizardState } from '../../types';
import { supabase } from '../../lib/chatApi';

type Sender = 'customer' | 'ai' | 'human';
type ChatStatus = 'ai' | 'human';

interface InboxMessage {
  id: string;
  sender: Sender;
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  phone: string;
  status: ChatStatus;
  unread: number;
  messages: InboxMessage[];
}

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

interface LiveInboxProps {
  state: WizardState;
}

export const LiveInbox: React.FC<LiveInboxProps> = ({ state }) => {
  const agentName = state.agentName || 'Sara';
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInbox() {
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
          setConversations([]);
          return;
        }

        const loaded: Conversation[] = await Promise.all(
          convs.map(async (c) => {
            const { data: msgs, error: msgError } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', c.id)
              .order('created_at', { ascending: true });

            if (msgError) {
              console.error('Error fetching messages:', msgError);
            }

            const messages: InboxMessage[] = (msgs || []).map((m: any) => {
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

            return {
              id: c.id,
              name: c.customer_name || 'Customer',
              phone: c.customer_phone || '',
              status: 'ai',
              unread: 0,
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

        setConversations(loaded);
        setActiveId((prev) => (prev && loaded.some(c => c.id === prev) ? prev : loaded[0]?.id || ''));
      } catch (err) {
        console.error('Failed to load inbox:', err);
      }
    }

    fetchInbox();

    const channel = supabase
      .channel('public:conversations_and_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchInbox();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchInbox();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    );
  }, [conversations, search]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages?.length, activeId]);

  const selectConversation = (id: string) => {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const toggleTakeover = () => {
    if (!active) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, status: c.status === 'ai' ? 'human' : 'ai' } : c))
    );
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !active || active.status !== 'human') return;

    try {
      const { data, error } = await supabase.from('messages').insert([{
        conversation_id: active.id,
        direction: 'outbound',
        sender: 'human',
        body: text,
      }]).select('*').single();

      if (error) {
        console.error('Error inserting message:', error);
      }

      const msg: InboxMessage = {
        id: data?.id || `m-${Date.now()}`,
        sender: 'human',
        text,
        time: nowTime(),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, msg] } : c))
      );
      setReply('');
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  if (!active) {
    return (
      <div
        id="live-inbox"
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[640px]"
      >
        <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="inbox-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
          <div className="p-8 text-center text-sm text-slate-400">No conversations found in database.</div>
        </aside>
        <section className="md:col-span-8 flex flex-col items-center justify-center bg-[#efeae2]/60 text-slate-400 text-sm p-6">
          <p>No active conversation selected.</p>
          <p className="text-xs text-slate-500 mt-1">Incoming WhatsApp messages will appear here automatically.</p>
        </section>
      </div>
    );
  }

  const isHuman = active.status === 'human';
  const lastMsg = (c: Conversation) => c.messages[c.messages.length - 1];

  return (
    <div
      id="live-inbox"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[640px]"
    >
      {/* Left: conversations */}
      <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col min-h-0">
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="inbox-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 && (
            <li className="p-6 text-center text-sm text-slate-400">No conversations found.</li>
          )}
          {filtered.map((c) => {
            const last = lastMsg(c);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  id={`conversation-${c.id}`}
                  onClick={() => selectConversation(c.id)}
                  className={`w-full text-left p-3.5 flex gap-3 transition-colors cursor-pointer ${
                    c.id === active.id ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900 truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{last?.time || ''}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{c.phone}</div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-slate-600 truncate">
                        {last && last.sender !== 'customer' && (
                          <span className="text-slate-400">{last.sender === 'ai' ? `${agentName}: ` : 'You: '}</span>
                        )}
                        {last?.text ? last.text.replace(/\n/g, ' ') : 'No messages'}
                      </p>
                      {c.unread > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'ai'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {c.status === 'ai' ? 'AI Responding' : 'Human Takeover'}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Right: chat window */}
      <section className="md:col-span-8 flex flex-col min-h-0 bg-[#efeae2]/60">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
              {active.name[0]}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 truncate">{active.name}</h3>
              <p className="text-xs text-slate-500">{active.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold ${isHuman ? 'text-amber-700' : 'text-emerald-700'}`}>
              {isHuman ? <Hand className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              {isHuman ? 'Taking Over as Human' : 'AI Assistant Active'}
            </span>
            <button
              type="button"
              id="ai-toggle"
              role="switch"
              aria-checked={!isHuman}
              aria-label="AI Assistant Active"
              onClick={toggleTakeover}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                isHuman ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  isHuman ? 'translate-x-0' : 'translate-x-6'
                }`}
              />
            </button>
          </div>
        </header>

        {isHuman && (
          <div
            id="human-takeover-banner"
            className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 flex items-center gap-2"
          >
            <UserCog className="w-4 h-4 shrink-0" />
            AI is paused for this chat. You are responding directly as a human agent.
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {active.messages.map((m) => {
            const isCustomer = m.sender === 'customer';
            const bubble =
              m.sender === 'customer'
                ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                : m.sender === 'ai'
                ? 'bg-[#d9fdd3] border border-[#bbf7b0] text-slate-900 rounded-tr-xs'
                : 'bg-amber-100 border border-amber-300 text-amber-950 rounded-tr-xs';
            return (
              <div key={m.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-2xs whitespace-pre-wrap ${bubble}`}>
                  <div className="text-[10px] font-bold mb-1 opacity-70 flex items-center gap-1">
                    {m.sender === 'customer' && (<><User className="w-3 h-3" />{active.name}</>)}
                    {m.sender === 'ai' && (<><Bot className="w-3 h-3" />{agentName} (AI Agent)</>)}
                    {m.sender === 'human' && (<><UserCog className="w-3 h-3" />You (Merchant)</>)}
                  </div>
                  {m.text}
                  <div className="text-[10px] text-slate-400 text-right mt-1">{m.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply bar */}
        <form onSubmit={sendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            id="inbox-reply-input"
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            disabled={!isHuman}
            placeholder={isHuman ? 'Type a reply as a human agent…' : 'Switch the toggle off AI to reply manually'}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            id="inbox-send-btn"
            disabled={!isHuman || !reply.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl shadow-xs cursor-pointer shrink-0"
            aria-label="Send reply"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>
    </div>
  );
};
