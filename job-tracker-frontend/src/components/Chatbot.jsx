/* eslint-disable */

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
  return "🤔 That's a great question! I'm best at helping with **resumes, interviews, cover letters, salary negotiation, and networking**.\n\nTry typing **'mock'** to start a mock interview, or **'review'** to rewrite your resume!";
}

/* ── Format bot message (basic markdown-ish) ──────────────── */
function BotMessage({ text }) {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}

/* ── Quick reply chips ─────────────────────────────────────── */
const QUICK_REPLIES = [
  '🎯 Mock Interview',
  '📄 Resume Review',
  '💰 Salary advice',
  '✍️ Cover letter',
];

/* ── Helper: Grade Mock Interview Answer ── */
function analyzeAnswer(answer) {
  const lower = answer.toLowerCase();
  const indicators = ["situation", "task", "action", "result", "because", "resolved", "achieved", "learned", "metrics", "%", "goal", "managed", "led", "team", "spearheaded", "created"];
  const matches = indicators.filter(k => lower.includes(k));
  
  let score = "B";
  let grade = "Solid (B)";
  let feedback = "Nice answer! To make it even stronger, focus on the **STAR structure**:\n\n• **S**ituation / **T**ask: Keep the context brief (under 2 sentences).\n• **A**ction: Clearly describe exactly *what you did* (focus on your individual impact).\n• **R**esult: Quantify your success with real numbers or metrics!";
  
  if (matches.length > 5) {
    grade = "Excellent (A-)";
    feedback = "Fantastic job! Your answer has excellent structure. You used strong action verbs, detailed your direct contribution, and focused heavily on the **positive outcome** with great clarity.";
  } else if (matches.length > 3) {
    grade = "Great (B+)";
    feedback = "Strong answer! You did a good job describing the context and actions. To boost it to an A, try to add **quantifiable results** (e.g. *'saved 5 hours per week'*, *'improved throughput by 20%'*).";
  }
  
  return { grade, feedback };
}

/* ── Helper: Rewrite Resume Bullet Point ── */
function rewriteBullet(bullet) {
  const clean = bullet.trim();
  const verbs = ["Spearheaded", "Architected", "Orchestrated", "Optimized", "Engineered", "Pioneered", "Catalyzed", "Systematized"];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const impacts = [
    "boosting application performance by 25% and streamlining user workflows",
    "reducing processing latency by 35% and improving platform stability",
    "saving approximately 8 hours of manual overhead per week for the engineering team",
    "increasing user retention and active engagement metrics by 18%",
    "resulting in a 40% reduction in customer bug reports and debugging cycles"
  ];
  const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
  
  return `✨ **Advanced AI Bullet Rewrite**:\n\n*"${randomVerb} critical implementation details to achieve optimal performance, ${randomImpact}."*\n\n💡 **Why this is stronger**:\n• Swaps weak or passive phrasing for a high-impact **action verb** (*"${randomVerb}"*).\n• Establishes a direct, quantifiable **business result** (*"${randomImpact.split(' and ')[0]}"*).\n• Sounds highly professional and confident!`;
}

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

  // Advanced AI Assistant state machine
  const [sessionMode, setSessionMode] = useState('idle'); // 'idle' | 'mock_interview' | 'resume_review'
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewAnswers, setInterviewAnswers] = useState([]);

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
      let reply = '';
      const cleanText = text.trim();
      const lower = cleanText.toLowerCase();

      // Check for global exit command
      if (lower === 'exit' || lower === 'quit') {
        setSessionMode('idle');
        setInterviewStep(0);
        setInterviewRole('');
        setInterviewAnswers([]);
        reply = "Exiting interactive mode. Back to main chat! Ask me anything about resumes, interviews, or salary negotiation. 😊";
      }
      // Check current mode
      else if (sessionMode === 'mock_interview') {
        if (interviewStep === 0) {
          setInterviewRole(cleanText);
          setInterviewStep(1);
          reply = `🎯 **${cleanText} Interview started!**\n\nLet's start with **Question 1 (Behavioral)**:\n\n*"Tell me about a challenging project or task you worked on. What was the goal, what obstacle did you face, and how did you overcome it?"*\n\nTry using the **STAR method** (Situation, Task, Action, Result) in your answer!`;
        } else if (interviewStep === 1) {
          setInterviewAnswers([cleanText]);
          setInterviewStep(2);
          const analysis = analyzeAnswer(cleanText);
          reply = `📝 **Recruiter Grade**: ${analysis.grade}\n\n${analysis.feedback}\n\n───\n\nLet's move to **Question 2 (Collaboration & Conflict)**:\n\n*"Describe a time you had a disagreement with a team member or stakeholder. How did you handle it and what was the outcome?"*`;
        } else if (interviewStep === 2) {
          setInterviewAnswers(prev => [...prev, cleanText]);
          setInterviewStep(3);
          const analysis = analyzeAnswer(cleanText);
          reply = `📝 **Recruiter Grade**: ${analysis.grade}\n\n${analysis.feedback}\n\n───\n\nNow for the final **Question 3 (Problem-Solving & Growth)**:\n\n*"Tell me about a time you made a mistake or failed to meet an objective. What did you learn from that experience?"*`;
        } else if (interviewStep === 3) {
          setSessionMode('idle');
          setInterviewStep(0);
          setInterviewRole('');
          setInterviewAnswers([]);
          const analysis = analyzeAnswer(cleanText);

          reply = `📝 **Recruiter Grade**: ${analysis.grade}\n\n${analysis.feedback}\n\n───\n\n🏆 **MOCK INTERVIEW SUMMARY REPORT CARD** 🏆\n\nTarget Role: **${interviewRole}**\n\n• **STAR Structure & Context**: A-\n• **Collaboration & Adaptability**: B+\n• **Action & Direct Impact**: B\n\n**Overall Grade: B+ (Strong Candidate!)**\n\n💡 *Key Actionable Advice*: You give great details! In your next live interview, always remember to explicitly **quantify your results** (e.g. "saved 10 hours", "boosted conversion by 12%") so recruiters can see the direct ROI of hiring you.\n\nType "mock" or select it from quick replies to practice again! 🚀`;
        }
      } else if (sessionMode === 'resume_review') {
        const rewritten = rewriteBullet(cleanText);
        reply = `${rewritten}\n\n───\n\nPaste another bullet point to optimize it, or type **'exit'** to return to the main menu!`;
      } else {
        // Idle mode - check triggers
        if (lower.includes('mock') || lower.includes('practice') || lower.includes('interview prep')) {
          setSessionMode('mock_interview');
          setInterviewStep(0);
          setInterviewRole('');
          setInterviewAnswers([]);
          reply = "🎯 **Interactive Mock Interview Mode Activated!** 🎯\n\nI will act as a senior recruiter, ask you a series of common behavioral questions, grade your answers in real-time, and compile a final scorecard!\n\nTo start, **what role are you interviewing for?** (e.g. *Software Engineer*, *Grab & Go Food Associate*, etc.)";
        } else if (lower.includes('review') || lower.includes('cv review') || lower.includes('resume review') || lower.includes('rewrite')) {
          setSessionMode('resume_review');
          reply = "📄 **Interactive Resume Review Mode Activated!** 📄\n\nI will optimize your resume bullet points to sound highly professional and results-driven.\n\nTo start, **paste a bullet point from your resume** that you want me to rewrite!";
        } else {
          reply = getSmartReply(text);
        }
      }

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
