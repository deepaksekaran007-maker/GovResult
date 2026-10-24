import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Compass, 
  Clock, 
  FileCheck2, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  HelpCircle,
  GraduationCap,
  Bell,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState('');
  const [examYear, setExamYear] = useState('2026');
  const [examType, setExamType] = useState('HSC2026');

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      navigate('/results');
      return;
    }
    navigate(`/results?reg=${encodeURIComponent(regNumber.trim())}&year=${examYear}`);
  };

  const featureCards = [
    {
      icon: TrendingUp,
      title: "Smart Result Analysis",
      color: "from-blue-600 to-indigo-700",
      desc: "Calculates overall aggregates, strengths, subject percentiles, and improvement areas dynamically based on your actual marksheet."
    },
    {
      icon: Compass,
      title: "Eligible Opportunities",
      color: "from-emerald-600 to-teal-700",
      desc: "Instantly matches your marks to verified Central/State university courses, merit scholarships, and technical skill programs."
    },
    {
      icon: Award,
      title: "Revaluation & Supplementary",
      color: "from-amber-500 to-orange-600",
      desc: "Provides verified re-totalling fees, answer-book copy procedures, and supplementary examination registration without missing deadlines."
    },
    {
      icon: Clock,
      title: "Deadline Alerts & Reminders",
      color: "from-purple-600 to-indigo-800",
      desc: "Live countdown trackers with automated 1-day, 3-day, and 7-day alert triggers so you never forfeit an admission window."
    },
    {
      icon: FileCheck2,
      title: "Document Checklist",
      color: "from-cyan-600 to-blue-700",
      desc: "Categorizes mandatory, conditional, and optional certificates with issuance guidance before counselling rounds begin."
    },
    {
      icon: Sparkles,
      title: "GovResult AI Counselor",
      color: "from-rose-600 to-pink-700",
      desc: "Strictly grounded AI assistant that answers post-result questions with zero hallucination of dates, fees, or government rules."
    }
  ];

  const workflowSteps = [
    { num: "01", title: "Check Result", desc: "Access verified board marks with secure registration number authentication." },
    { num: "02", title: "Smart Analysis", desc: "Understand strongest subjects, lowest scores, and pass/compartment standing." },
    { num: "03", title: "Discover Opportunities", desc: "View degree admissions, state scholarships, and skill certifications." },
    { num: "04", title: "Revaluation / Supplementary", desc: "Act on grade improvement or compartment registration immediately." },
    { num: "05", title: "Track Deadlines", desc: "Set automatic reminders before admission and scholarship portals close." },
    { num: "06", title: "Execute Next Steps", desc: "Follow a tailored, step-by-step personalized action roadmap." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9]">
      {/* Official Flash Ticker */}
      <div className="bg-blue-900 text-white text-xs py-2 px-4 flex items-center justify-between overflow-hidden border-b border-blue-800">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
          <span className="flex items-center gap-1 bg-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
            <Bell className="w-3 h-3" /> Announcement
          </span>
          <p className="text-slate-200 truncate text-xs">
            Higher Secondary Examination (Class 12) 2026 Results Published! Central University Admissions & Revaluation Portals are now live.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A2540] via-[#0F3460] to-[#16213E] text-white pt-16 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Background ambient elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Government Examination Next-Step Intelligence Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Your Result Is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Just The Beginning.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Check your government examination result, understand your performance with smart analytics, discover verified opportunities, track critical deadlines, and know exactly what to do next — all in one trusted portal.
            </p>

            {/* Quick Demo Launchers */}
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 max-w-xl space-y-2">
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Instant Demo Showcase (One-Click Testing)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => switchDemoUser('student1').then(() => navigate('/dashboard'))}
                  className="px-3 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold text-left flex items-center justify-between transition shadow-sm"
                >
                  <div>
                    <div className="font-bold">Arun Kumar (84.2%)</div>
                    <div className="text-[10px] text-emerald-200">Pass • High Merit Pathway</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => switchDemoUser('student2').then(() => navigate('/dashboard'))}
                  className="px-3 py-2 bg-amber-600/90 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold text-left flex items-center justify-between transition shadow-sm"
                >
                  <div>
                    <div className="font-bold">Priya Sharma (63.6%)</div>
                    <div className="text-[10px] text-amber-200">1 Compartment • Supplementary</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Search Box */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-800 border border-slate-200/80">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Search className="w-4 h-4" />
                <span>Direct Result Lookup</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                Check Your Examination Result
              </h3>

              <form onSubmit={handleDirectSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Examination</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="HSC2026">Higher Secondary Certificate (Class 12) - 2026</option>
                    <option value="SSC2026">Secondary School Leaving Certificate (Class 10) - 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registration / Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN202612089 or TN202612090"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Sample Demo Reg: <code className="text-blue-600 font-bold cursor-pointer" onClick={() => setRegNumber('TN202612089')}>TN202612089</code> or <code className="text-blue-600 font-bold cursor-pointer" onClick={() => setRegNumber('TN202612090')}>TN202612090</code>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Year</label>
                    <input
                      type="text"
                      disabled
                      value="2026"
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Security Captcha</label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2 bg-slate-200 font-mono font-bold tracking-widest text-slate-800 rounded text-xs select-none border">
                        GOV26
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Check Result & Next Steps</span>
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Official Digital Marksheet</span>
                <Link to="/results" className="text-blue-600 font-semibold hover:underline">
                  Advanced Search →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovative Proposition Comparison Banner */}
      <section className="bg-white border-y border-slate-200 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">The Innovation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How GovResult+ Revolutionizes Examination Portals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Traditional Portal */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                Traditional Government Result Website
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-700 space-y-2 mb-4 font-mono text-xs">
                <div className="text-slate-400 font-bold">MARKSHEET SUMMARY</div>
                <div className="text-lg font-bold text-slate-900">Total Marks: 421/500 (84.2%)</div>
                <div className="text-emerald-600 font-semibold">Status: PASS</div>
                <div className="text-[11px] text-slate-400 italic">No further guidance provided. Session ended.</div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Leaves students wondering: Which college to apply to? What scholarships exist? When is the revaluation deadline?
              </p>
            </div>

            {/* GovResult+ */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-sm relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                GovResult+ Innovation
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                GovResult+ Smart Assistant
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-200 text-slate-800 space-y-2 mb-4 text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>84.2% Aggregate (Distinction)</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">PASS</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>✓ <strong>Smart Analytics:</strong> Computer Science (95/100) is your top subject</div>
                  <div>✓ <strong>Opportunities:</strong> 4 Central University degrees + 2 Scholarships matched</div>
                  <div>✓ <strong>Deadlines:</strong> Admission Seat Allocation closes in 11 days</div>
                  <div>✓ <strong>Action Plan:</strong> 6 personalized next steps generated for you</div>
                </div>
              </div>
              <p className="text-xs text-blue-900 font-medium leading-relaxed">
                Empowers every candidate with an instant, personalized, verified roadmap to their future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Feature Cards */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Comprehensive Features</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Everything You Need After Results Are Released
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Built with verified government data pipelines, zero hallucination, and intelligent student guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-gov hover:shadow-gov-lg transition transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* User Journey Workflow */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Seamless Progression</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              The Complete Student Journey
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From the moment marks are published to taking your next academic leap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-amber-400/80">{step.num}</span>
                  <h4 className="text-sm font-bold text-white mt-2 mb-1">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Frequently Asked Questions</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">How does GovResult+ know which opportunities I am eligible for?</h4>
            <p className="text-slate-600 leading-relaxed">
              GovResult+ compares your actual percentage, subject-wise marks, pass status, and stream against verified official eligibility criteria recorded by admission and scholarship bodies. If criteria require manual documentation (like income certificate), it marks the status as [CHECK REQUIRED] with full details.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">What if I have failed in one subject or got a compartment?</h4>
            <p className="text-slate-600 leading-relaxed">
              GovResult+ immediately detects compartment standing, presents verified Supplementary Exam dates, fees, and procedure steps, and also provides Revaluation window details so you can clear your subject without losing a year.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Is GovResult AI safe and accurate?</h4>
            <p className="text-slate-600 leading-relaxed">
              Yes. GovResult AI is strictly grounded in official examination authority databases. It is programmed to never invent eligibility criteria, dates, fees, or official links.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Explore Your Next Steps?</h2>
          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto">
            Experience the new standard of government examination result portals today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/results"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl shadow-lg transition text-xs sm:text-sm"
            >
              Check Your Result Now
            </Link>
            <Link
              to="/opportunities"
              className="px-6 py-3 bg-white/15 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition text-xs sm:text-sm"
            >
              Explore Verified Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
