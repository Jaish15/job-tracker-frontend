import { useState, useRef, useEffect } from 'react';
import '../styles/chatbot.css';

/* ── Smart response engine ─────────────────────────────────── */
const RESPONSES = [
  {
    keywords: ['resume', 'cv'],
    reply: "📄 Great news — we have a **Resume Builder** built right in! Head to **Resume** in the sidebar to choose from beautiful templates and customize your resume. Want tips on what to include?",
  },
  {
    keywords: ['interview', 'prepare', 'prep'],
    reply: "🎯 Interview prep tips:\n\n1. **Research the company** — their mission, products & recent news\n2. **STAR method** — Situation, Task, Action, Result for behavioral questions\n3. **Prepare 3–5 questions** to ask the interviewer\n4. **Practice out loud** — record yourself or use a mirror\n\nWant a mock interview question?",
  },
  {
    keywords: ['cover letter', 'covering'],
    reply: "✍️ A strong cover letter should:\n\n• Open with a hook — why *you* for *this* role\n• Highlight 2–3 specific achievements with numbers\n• Show you know the company's challenges\n• End with a clear call to action\n\nShall I help you draft one?",
  },
  {
    keywords: ['salary', 'pay', 'compensation', 'negotiate'],
    reply: "💰 Salary negotiation tips:\n\n• **Never give a number first** — ask for their range\n• Use sites like **Levels.fyi**, **Glassdoor**, or **Blind** to research\n• Always negotiate — 70% of employers expect it\n• Counter with 10–15% above your target\n\nWhat industry are you in?",
  },
  {
    keywords: ['reject', 'rejected', 'no response', 'ghosted'],
    reply: "😔 Rejections are tough but part of the process. Here's what to do:\n\n• **Follow up once** — a polite reply asking for feedback\n• **Keep applying** — treat it as a numbers game\n• **Analyze patterns** — is it your resume, interview, or fit?\n• **Take a short break** — mental health matters!\n\nYou've got this! 💪",
  },
  {
    keywords: ['linkedin', 'network', 'networking'],
    reply: "🔗 LinkedIn tips:\n\n• Connect with **employees before applying** — it boosts visibility\n• Send a personalised note (not the default message)\n• Comment on posts in your target companies\n• Ask for **informational interviews** — people love talking about their work\n\nWant tips on writing a LinkedIn headline?",
  },
  {
    keywords: ['how many', 'apply', 'applications', 'per week'],
    reply: "📊 Quality over quantity! Aim for:\n\n• **5–10 tailored applications** per week\n• Spend 30 min personalising each resume/cover letter\n• Track everything in your **Jobs** tab here\n• Follow up after 5–7 business days\n\nConsistency beats volume every time! 🚀",
  },
  {
    keywords: ['thank you', 'thanks', 'great', 'helpful', 'awesome'],
    reply: "😊 You're so welcome! Best of luck with your job search. Remember — the right opportunity is out there. Keep going! 🌟",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    reply: "👋 Hey there! I'm your **JobTracker AI Assistant**. I can help you with:\n\n• 📄 Resume tips & our built-in Resume Builder\n• 🎯 Interview preparation\n• ✍️ Cover letter advice\n• 💰 Salary negotiation\n• 🔗 Networking strategies\n\nWhat would you like help with today?",
  },
  {
    keywords: ['template', 'resume builder', 'resume page'],
    reply: "🎨 Our **Resume Builder** lets you choose from professional templates and customise them — similar to Canva! Click **Resume** in the sidebar on the left to get started. You can edit your name, experience, skills, and more.",
  },
];

function getSmartReply(text) {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.reply;
  }
  return "🤔 That's a great question! I'm best at helping with **resumes, interviews, cover letters, salary negotiation, and networking**. Could you rephrase or ask about one of those topics?";
}

/* ── Format bot message (basic markdown-ish) ──────────────── */
function BotMessage({ text }) {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}

/* ── Quick reply chips ─────────────────────────────────────── */
const QUICK_REPLIES = [
  '📄 Resume tips',
  '🎯 Interview prep',
  '✍️ Cover letter',
  '💰 Salary advice',
];

/* ── Main Chatbot Component ────────────────────────────────── */
export function Chatbot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([
    { id: 1, sender: 'bot', text: "👋 Hi! I'm your **JobTracker AI Assistant**. I can help with resumes, interviews, cover letters, salary tips, and more!\n\nWhat would you like help with?" },
  ]);
  const [input,     setInput]     = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const [unread,    setUnread]    = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Pulse unread badge when closed
  useEffect(() => {
    if (!isOpen) setUnread((n) => n + 0); // don't auto-increment
  }, [isOpen]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getSmartReply(text);
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
      if (!isOpen) setUnread((n) => n + 1);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
  };

  return (
    <div className="cb-wrapper">
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="cb-window" role="dialog" aria-label="AI Job Assistant">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-info">
              <div className="cb-avatar">
                <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
                  <circle cx="18" cy="18" r="18" fill="url(#cbGrad)"/>
                  <defs>
                    <linearGradient id="cbGrad" x1="0" y1="0" x2="36" y2="36">
                      <stop stopColor="#6366f1"/>
                      <stop offset="1" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                  <text x="18" y="23" textAnchor="middle" fontSize="16" fill="white">✦</text>
                </svg>
              </div>
              <div>
                <div className="cb-header-title">JobTracker AI</div>
                <div className="cb-header-status">
                  <span className="cb-online-dot" /> Online • Always here to help
                </div>
              </div>
            </div>
            <button className="cb-close" onClick={() => setIsOpen(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`cb-bubble cb-${msg.sender}`}>
                {msg.sender === 'bot' ? <BotMessage text={msg.text} /> : msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="cb-bubble cb-bot cb-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="cb-quick-replies">
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="cb-quick-btn" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="cb-input-row" onSubmit={handleSubmit}>
            <input
              className="cb-input"
              type="text"
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="cb-send" disabled={!input.trim()} aria-label="Send">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── FAB Button ── */}
      {!isOpen && (
        <button className="cb-fab" onClick={handleOpen} aria-label="Open AI Assistant">
          {unread > 0 && <span className="cb-unread">{unread}</span>}
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="cb-fab-label">AI Assistant</span>
        </button>
      )}
    </div>
  );
}
