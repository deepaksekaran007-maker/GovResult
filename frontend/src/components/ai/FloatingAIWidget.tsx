import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User as UserIcon, ShieldCheck, ChevronRight, Minimize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AIChatMessage } from '../../types';

export const FloatingAIWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      sender: 'assistant',
      content: `Hello ${user ? user.full_name.split(' ')[0] : 'there'}! I am **GovResult AI** — your verified examination result and next-step counselor. How can I help you explore your marks, opportunities, revaluation, or deadlines today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_verified_grounded: true,
      disclaimer: 'Grounded in official examination authority records.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await api.sendAIChat(text, user?.student_id);
      const assistantMsg: AIChatMessage = {
        sender: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_verified_grounded: res.is_verified_grounded,
        disclaimer: res.disclaimer
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'Sorry, I am temporarily unable to reach the advisory engine. Please check your network or try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_verified_grounded: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'What can I do after getting my result?',
    'Which is my strongest subject?',
    'Can I apply for revaluation?',
    'What deadlines should I know?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-900 hover:from-blue-800 hover:to-indigo-950 text-white rounded-full shadow-2xl transition transform hover:scale-105 border-2 border-blue-400/40 glow-primary"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none flex items-center gap-1">
              GovResult AI
              <span className="bg-amber-400 text-slate-900 text-[9px] font-extrabold px-1 py-0.2 rounded">SMART</span>
            </div>
            <div className="text-[10px] text-blue-200 mt-0.5">Ask next-step advice</div>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A2540] to-[#1A365D] text-white p-4 flex items-center justify-between border-b border-blue-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/80 flex items-center justify-center text-amber-300 shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">GovResult AI</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30 font-semibold">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Official Result & Next-Step Guidance</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grounding Notice */}
          <div className="bg-blue-50 border-b border-blue-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-blue-800">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Verified Board Grounding Active
            </span>
            <span className="text-slate-500 text-[10px]">Zero Hallucination</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-700 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs">{msg.content}</div>
                  
                  {msg.disclaimer && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 italic">
                      ℹ️ {msg.disclaimer}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2 bg-white px-3.5 rounded-xl w-fit border border-slate-200">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>GovResult AI is formulating verified next-step advice...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 transition shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about marks, opportunities, revaluation..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
