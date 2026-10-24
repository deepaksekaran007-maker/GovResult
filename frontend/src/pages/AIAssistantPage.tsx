import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AIChatMessage } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  FileText, 
  Compass, 
  Clock, 
  Award,
  ArrowRight,
  Info
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      sender: 'assistant',
      content: `Welcome **${user?.full_name || 'Student'}**! I am **GovResult AI** — your verified Government Examination Result & Next-Step Assistant.\n\nI have access to your active examination marksheet, verified central/state university eligibility rules, official revaluation procedures, and upcoming admission deadlines.\n\nHow can I help guide your next academic steps today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_verified_grounded: true,
      disclaimer: 'All answers strictly grounded in official examination board records.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || inputMsg).trim();
    if (!text || isLoading) return;

    const userMessage: AIChatMessage = {
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputMsg('');
    setIsLoading(true);

    try {
      const res = await api.sendAIChat(text, user?.student_id || 1);
      const assistantMessage: AIChatMessage = {
        sender: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_verified_grounded: res.is_verified_grounded,
        disclaimer: res.disclaimer
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'I am temporarily unable to connect to the verified guidance engine. Please verify your connection or try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_verified_grounded: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedQueries = [
    { label: "Which is my strongest subject?", icon: Award },
    { label: "What opportunities are available to me?", icon: Compass },
    { label: "Can I apply for revaluation?", icon: FileText },
    { label: "I failed one subject. What are my options?", icon: HelpCircle },
    { label: "What deadlines should I know?", icon: Clock },
    { label: "What documents do I need for counselling?", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Grounding & Verified Principles Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-amber-300 flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">GovResult AI</h3>
                <p className="text-[11px] text-slate-500">Government Result Counselor</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Specialized in analyzing examination results and advising students on verified admissions, scholarships, revaluation, and deadlines.
            </p>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1.5 text-blue-900">
              <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-blue-800">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Anti-Hallucination Policy
              </div>
              <p className="text-[11px] leading-relaxed text-blue-950">
                GovResult AI does not fabricate dates, eligibility percentages, fees, or government schemes. If information is unverified, it explicitly indicates authority sources.
              </p>
            </div>

            {/* Context Injected */}
            <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                Active Student Context:
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-[11px] text-slate-700">
                <div>Candidate: <strong className="text-slate-900">{user?.full_name || 'Arun Kumar'}</strong></div>
                <div>Examination: <strong>Higher Secondary (Class 12)</strong></div>
                <div>Data Source: <span className="text-emerald-700 font-bold">Official Evaluation DB</span></div>
              </div>
            </div>
          </div>

          {/* Quick Query Chips Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-5 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Suggested Questions
            </h4>
            <div className="space-y-1.5">
              {recommendedQueries.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(q.label)}
                    className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 rounded-xl border border-slate-200/80 text-xs font-medium transition flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="line-clamp-1">{q.label}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Full AI Chat Workspace */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-[#0A2540] to-[#103A64] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-bold text-sm">Consultation with GovResult AI</h3>
                <p className="text-[11px] text-slate-300">Verified Result Guidance Session</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              Grounded & Active
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-700 text-amber-300 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs font-normal">
                    {msg.content}
                  </div>

                  {msg.disclaimer && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic flex items-center gap-1">
                      <Info className="w-3 h-3 text-slate-400" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-600 text-xs p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>GovResult AI is consulting verified official rules & board criteria...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about marksheet, stream choices, university admissions, revaluation..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 text-xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
