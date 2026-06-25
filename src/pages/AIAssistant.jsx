import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Mic, Plus, MessageSquare, Clock, Download,
  User, Sparkles, ChevronRight, X, RefreshCw, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ── Simulated AI Responses ────────────────────────────────────
const AI_RESPONSES = {
  'Which customers have pending payments?': {
    type: 'table',
    intro: 'I found **3 customers** with pending or overdue payments. Here are the details:',
    rows: [
      { customer: 'Priya Shah',   policy: 'POL-2024-002', amount: '₹12,000', status: 'Partial',  due: 'Jul 1, 2026' },
      { customer: 'Suresh Kumar', policy: 'POL-2024-005', amount: '₹15,000', status: 'Partial',  due: 'Jul 10, 2026' },
      { customer: 'Deepak Rao',   policy: 'POL-2024-009', amount: '₹22,000', status: 'Overdue',  due: 'Jun 28, 2026' },
    ],
    cols: ['Customer', 'Policy', 'Pending Amount', 'Status', 'Due Date'],
    outro: '💡 **Total pending amount: ₹49,000.** I recommend sending reminders to Deepak Rao immediately as their payment is overdue.',
  },
  'Show policies expiring this week': {
    type: 'table',
    intro: 'I found **2 policies** expiring within the next 7 days that need immediate attention:',
    rows: [
      { customer: 'Vikram Singh', policy: 'POL-2024-003', type: 'Life',    expiry: 'Jun 29, 2026', daysLeft: '4 days', insurer: 'LIC India' },
      { customer: 'Anita Desai',  policy: 'POL-2024-004', type: 'Vehicle', expiry: 'Jun 26, 2026', daysLeft: '1 day',  insurer: 'Bajaj Allianz' },
    ],
    cols: ['Customer', 'Policy', 'Type', 'Expiry Date', 'Days Left', 'Insurer'],
    outro: '⚠️ **Anita Desai\'s policy expires in just 1 day!** I recommend calling her immediately and initiating renewal.',
  },
  'What is revenue this month?': {
    type: 'revenue',
    intro: 'Here is the revenue breakdown for **June 2026**:',
    summary: {
      total: '₹4,20,000',
      target: '₹3,80,000',
      growth: '+10.5% vs May',
      policies: '31 new policies',
    },
    breakdown: [
      { type: 'Vehicle Insurance', amount: '₹1,89,000', pct: 45 },
      { type: 'Health Insurance',  amount: '₹1,26,000', pct: 30 },
      { type: 'Life Insurance',    amount: '₹84,000',   pct: 20 },
      { type: 'Other',             amount: '₹21,000',   pct: 5  },
    ],
    outro: '🏆 **Target exceeded by ₹40,000!** This is the best performing month in 2026 so far.',
  },
  'Which vehicle policies need renewal?': {
    type: 'table',
    intro: 'I found **3 vehicle policies** due for renewal in the next 30 days:',
    rows: [
      { customer: 'Anita Desai',  vehicle: 'GJ03CD5678', expiry: 'Jun 26, 2026', premium: '₹12,000', status: 'Sent' },
      { customer: 'Sunita Verma', vehicle: 'DL01IJ7890', expiry: 'Jun 24, 2026', premium: '₹14,500', status: 'Sent' },
      { customer: 'Rahul Patel',  vehicle: 'GJ05AB1234', expiry: 'Jul 14, 2026', premium: '₹18,500', status: 'Pending' },
    ],
    cols: ['Customer', 'Vehicle No.', 'Expiry Date', 'Premium', 'Reminder'],
    outro: '🚗 **2 reminders already sent.** Rahul Patel\'s renewal is pending — consider sending a WhatsApp message.',
  },
};

const GENERIC_RESPONSE = (q) => ({
  type: 'generic',
  intro: `I searched the Able system for your query: **"${q}"**`,
  content: `I found relevant results across customers, policies, and payments. Here are the top insights:\n\n• **Customers:** 167 total active customers in the system\n• **Policies:** 142 active policies (45% Vehicle, 30% Health, 20% Life)\n• **Revenue:** ₹4,20,000 collected this month\n• **Renewals:** 8 policies expiring this month\n\nFor more specific queries, try asking about pending payments, expiring policies, or revenue breakdowns.`,
  outro: '💡 You can also try: "Show overdue payments" or "List customers in Gujarat"',
});

// ── Pre-seeded Chat History ────────────────────────────────────
const HISTORY_CHATS = [
  {
    id: 'hist-1',
    title: 'Pending payments query',
    preview: 'Which customers have pending payments?',
    time: '10:30 AM',
    messages: [
      { id: 'm1', role: 'user', text: 'Which customers have pending payments?', ts: '10:30 AM' },
      { id: 'm2', role: 'ai',   data: AI_RESPONSES['Which customers have pending payments?'], ts: '10:30 AM' },
    ],
  },
  {
    id: 'hist-2',
    title: 'Expiring policies this week',
    preview: 'Show policies expiring this week',
    time: '9:15 AM',
    messages: [
      { id: 'm1', role: 'user', text: 'Show policies expiring this week', ts: '9:15 AM' },
      { id: 'm2', role: 'ai',   data: AI_RESPONSES['Show policies expiring this week'], ts: '9:15 AM' },
    ],
  },
  {
    id: 'hist-3',
    title: 'Revenue this month',
    preview: 'What is revenue this month?',
    time: 'Yesterday',
    messages: [
      { id: 'm1', role: 'user', text: 'What is revenue this month?', ts: 'Yesterday' },
      { id: 'm2', role: 'ai',   data: AI_RESPONSES['What is revenue this month?'], ts: 'Yesterday' },
    ],
  },
];

const SUGGESTED_PROMPTS = [
  'Which customers have pending payments?',
  'Show policies expiring this week',
  'What is revenue this month?',
  'Which vehicle policies need renewal?',
];

// ── Sub-components ────────────────────────────────────────────
function AiResponseContent({ data }) {
  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Intro */}
      <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
        {data.intro.split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )}
      </p>

      {/* Table response */}
      {data.type === 'table' && data.rows && (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <table className="data-table" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {data.cols.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>
                      {val === 'Overdue' ? <span className="badge badge-danger">{val}</span>
                       : val === 'Partial' ? <span className="badge badge-warning">{val}</span>
                       : val === 'Sent'    ? <span className="badge badge-success">{val}</span>
                       : val === 'Pending' ? <span className="badge badge-muted">{val}</span>
                       : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Revenue response */}
      {data.type === 'revenue' && data.summary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem',
          }}>
            {Object.entries(data.summary).map(([k, v]) => (
              <div key={k} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '0.625rem 0.875rem',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {k === 'total' ? 'Total Revenue' : k === 'target' ? 'Target' : k === 'growth' ? 'Growth' : 'Policies'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{v}</div>
              </div>
            ))}
          </div>
          {data.breakdown && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.breakdown.map(b => (
                <div key={b.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '130px', fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{b.type}</div>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${b.pct}%` }} />
                    </div>
                  </div>
                  <div style={{ width: '70px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{b.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generic response */}
      {data.type === 'generic' && data.content && (
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '0.875rem',
          fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)',
          whiteSpace: 'pre-line',
        }}>
          {data.content}
        </div>
      )}

      {/* Outro */}
      {data.outro && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingTop: '0.25rem' }}>
          {data.outro.split('**').map((part, i) =>
            i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text-primary)' }}>{part}</strong> : part
          )}
        </p>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.5rem 0' }}>
      {/* AI avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-lighter))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Bot size={16} color="white" />
      </div>
      <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.75rem 1rem' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--text-muted)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AIAssistant() {
  const [chats, setChats]           = useState(HISTORY_CHATS);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput]           = useState('');
  const [typing, setTyping]         = useState(false);
  const messagesEndRef              = useRef(null);
  const inputRef                    = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat, typing]);

  const getAiResponse = (question) => {
    const key = Object.keys(AI_RESPONSES).find(k =>
      question.toLowerCase().includes(k.split(' ').slice(1, 4).join(' ').toLowerCase())
    );
    if (key) return AI_RESPONSES[key];
    // check exact match
    if (AI_RESPONSES[question]) return AI_RESPONSES[question];
    return GENERIC_RESPONSE(question);
  };

  const sendMessage = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      text: trimmed,
      ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    let chatId;
    if (activeChat) {
      chatId = activeChat;
      setChats(prev => prev.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      ));
    } else {
      chatId = `chat-${Date.now()}`;
      const newChat = {
        id: chatId,
        title: trimmed.length > 36 ? trimmed.slice(0, 36) + '…' : trimmed,
        preview: trimmed,
        time: 'Now',
        messages: [userMsg],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChat(chatId);
    }

    setTyping(true);
    setTimeout(() => {
      const aiData = getAiResponse(trimmed);
      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        data: aiData,
        ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChats(prev => prev.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, aiMsg] }
          : c
      ));
      setTyping(false);
    }, 850);
  };

  const startNewChat = () => {
    setActiveChat(null);
    setInput('');
    inputRef.current?.focus();
  };

  const handleExportChat = () => {
    if (!activeChat) { toast.error('No active chat to export'); return; }
    toast.success('Chat exported to PDF');
  };

  const handleVoiceInput = () => {
    toast('Voice input not available in demo', {
      icon: '🎤',
      style: { background: 'var(--primary)', color: 'white', border: 'none' },
    });
  };

  const currentMessages = activeChat
    ? (chats.find(c => c.id === activeChat)?.messages || [])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Business Assistant</h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} color="var(--gold)" />
            Powered by Able AI
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button id="ai-new-chat-header" className="btn btn-outline btn-sm" onClick={startNewChat}>
            <Plus size={14} /> New Chat
          </button>
          <button id="ai-export-chat" className="btn btn-ghost btn-sm" onClick={handleExportChat}>
            <Download size={14} /> Export Chat
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: '1.25rem', height: 'calc(100vh - 200px)', minHeight: 560 }}>

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* New Chat Button */}
          <button
            id="ai-new-chat-sidebar"
            className="btn btn-primary w-full"
            onClick={startNewChat}
            style={{ justifyContent: 'center' }}
          >
            <Plus size={15} /> New Chat
          </button>

          {/* History Card */}
          <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1rem 0.5rem', borderBottom: '1px solid var(--border)' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Today</div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
              {chats.map(chat => (
                <button
                  key={chat.id}
                  id={`chat-hist-${chat.id}`}
                  onClick={() => setActiveChat(chat.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activeChat === chat.id ? 'rgba(11,31,77,0.07)' : 'transparent',
                    border: activeChat === chat.id ? '1px solid rgba(11,31,77,0.15)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'var(--transition)',
                    display: 'flex', flexDirection: 'column', gap: '0.25rem',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={e => { if (activeChat !== chat.id) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  onMouseLeave={e => { if (activeChat !== chat.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                      <MessageSquare size={13} color={activeChat === chat.id ? 'var(--primary)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                      <span style={{
                        fontSize: '0.8rem', fontWeight: 600,
                        color: activeChat === chat.id ? 'var(--primary)' : 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{chat.title}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <Clock size={10} style={{ marginRight: 2 }} />{chat.time}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.73rem', color: 'var(--text-muted)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    paddingLeft: '1.375rem',
                  }}>{chat.preview}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT MAIN CHAT AREA ──────────────────────────── */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chat Header (when active) */}
          {activeChat && (
            <div style={{
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-lighter))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {chats.find(c => c.id === activeChat)?.title || 'New Chat'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--success)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                    Able AI is ready
                  </div>
                </div>
              </div>
              <button
                id="ai-clear-chat"
                className="btn btn-ghost btn-sm"
                onClick={startNewChat}
                style={{ color: 'var(--text-muted)' }}
              >
                <RefreshCw size={13} /> New
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {!activeChat ? (
              /* Empty State */
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', gap: '1.5rem',
              }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-lighter))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-primary)',
                  }}
                >
                  <Bot size={38} color="white" />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                    Ask Able AI anything
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 360 }}>
                    Get instant insights about your customers, policies, payments, and revenue — powered by AI.
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem', width: '100%', maxWidth: 640,
                }}>
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <motion.button
                      key={prompt}
                      id={`ai-prompt-${idx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.06 }}
                      onClick={() => {
                        const newId = `chat-${Date.now()}`;
                        setActiveChat(newId);
                        // send message after state update
                        setTimeout(() => sendMessage(prompt), 50);
                      }}
                      style={{
                        textAlign: 'left', padding: '0.875rem 1rem',
                        background: 'var(--surface)', border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius)', cursor: 'pointer',
                        transition: 'var(--transition)',
                        display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                        color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500,
                        lineHeight: 1.45,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--primary-lighter)';
                        e.currentTarget.style.background = 'rgba(11,31,77,0.03)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--surface)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Sparkles size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message List */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <AnimatePresence initial={false}>
                  {currentMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: 'flex',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: '0.875rem',
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                          : 'linear-gradient(135deg, var(--primary), var(--primary-lighter))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {msg.role === 'user'
                          ? <User size={15} color="white" />
                          : <Bot size={15} color="white" />
                        }
                      </div>

                      {/* Bubble */}
                      <div style={{ maxWidth: '80%' }}>
                        {msg.role === 'user' ? (
                          <div className="chat-bubble user" style={{ borderRadius: '12px 12px 4px 12px' }}>
                            {msg.text}
                          </div>
                        ) : (
                          <div className="chat-bubble ai" style={{ borderRadius: '12px 12px 12px 4px' }}>
                            <AiResponseContent data={msg.data} />
                          </div>
                        )}
                        <div style={{
                          fontSize: '0.68rem', color: 'var(--text-muted)',
                          marginTop: '0.3rem',
                          textAlign: msg.role === 'user' ? 'right' : 'left',
                        }}>
                          {msg.ts}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {typing && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              background: 'var(--bg)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '0.5rem 0.875rem',
              transition: 'var(--transition)',
            }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--primary-lighter)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <input
                id="ai-chat-input"
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about customers, policies, payments, revenue..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  background: 'transparent', fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                id="ai-voice-btn"
                onClick={handleVoiceInput}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                title="Voice input"
              >
                <Mic size={16} />
              </button>
              <button
                id="ai-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() && !typing}
                className="btn btn-gold btn-sm"
                style={{ borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.875rem' }}
              >
                <Send size={14} />
              </button>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
              Able AI can make mistakes. Verify critical business data independently.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
