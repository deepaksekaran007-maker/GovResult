import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ResultData, ResultAnalysis, Opportunity, DeadlineItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Compass, 
  Clock, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Printer,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [analysis, setAnalysis] = useState<ResultAnalysis | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (user?.student_id) {
          // Fetch result
          try {
            const resData = await api.getStudentLatestResult(user.student_id);
            setResult(resData);
            if (resData?.id) {
              const analData = await api.getResultAnalysis(resData.id);
              setAnalysis(analData);
            }
          } catch (e) {
            console.warn('No active result found for student profile');
          }

          // Fetch opportunities with eligibility
          try {
            const opps = await api.getOpportunities(undefined, undefined, user.student_id);
            setOpportunities(opps);
          } catch (e) {}

          // Fetch deadlines
          try {
            const dls = await api.getDeadlines();
            setDeadlines(dls);
          } catch (e) {}
        } else {
          // Fallback fetch default demo student result
          const resData = await api.searchResult({ registration_number: 'TN202612089' });
          setResult(resData);
          const analData = await api.getResultAnalysis(resData.id);
          setAnalysis(analData);
          const opps = await api.getOpportunities();
          setOpportunities(opps);
          const dls = await api.getDeadlines();
          setDeadlines(dls);
        }
      } catch (err) {
        console.error('Failed to load dashboard payload:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isCompartment = result?.result_status === 'COMPARTMENT' || result?.result_status === 'FAIL';

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Loading Student Dashboard & Performance Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#103A64] to-[#1A56DB] text-white rounded-3xl p-6 sm:p-8 shadow-gov relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Candidate Portal • Registration No: <strong className="text-white font-mono">{result?.registration_number || user?.registration_number || 'TN202612089'}</strong></span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {getTimeGreeting()}, {user?.full_name || result?.student_name || 'Candidate'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-light max-w-2xl">
                Official results for <strong>{result?.examination_name || 'Higher Secondary Examination (Class 12)'}</strong> — Year {result?.examination_year || 2026}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                to={`/results/${result?.id || ''}`}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>View Marksheet</span>
              </Link>
              <Link
                to="/next-steps"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>View Next-Step Plan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Urgent Alert Banner if Compartment or Approaching Deadline */}
        {isCompartment ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">Supplementary & Revaluation Windows Active</h4>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  You have a compartment standing in {analysis?.improvement_areas?.[0]?.subject_name || 'one subject'}. Supplementary registration is open until <strong>30 September 2026</strong>. You are also eligible for Answer-Book Verification until <strong>25 September 2026</strong>.
                </p>
              </div>
            </div>
            <Link
              to="/revaluation"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              Apply for Supplementary / Revaluation →
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Examination Cleared with Distinction ({result?.overall_percentage}%)!</strong> Central University Seat Allocations & National Merit Scholarships are accepting applications.
              </span>
            </div>
            <Link to="/opportunities" className="font-bold text-emerald-800 hover:underline">
              View Eligible Courses →
            </Link>
          </div>
        )}

        {/* 4 Score Highlight KPI Cards (As defined in Section 5) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Result Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Result Status
            </div>
            <div className="my-2">
              <span className={`text-2xl font-extrabold ${isCompartment ? 'text-red-600' : 'text-emerald-600'}`}>
                {result?.result_status || 'PASS'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <StatusBadge status={result?.result_status || 'PASS'} size="sm" />
              <span>Verified Record</span>
            </div>
          </div>

          {/* Card 2: Overall Percentage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Overall Percentage
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-slate-900">
                {result?.overall_percentage || 84.2}%
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Total: {result?.total_obtained_marks?.toFixed(0)}/{result?.total_max_marks?.toFixed(0)} marks
            </div>
          </div>

          {/* Card 3: Overall Grade */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Overall Grade
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-700">
                {result?.overall_grade || 'A2'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {analysis?.performance_band?.split(' ')[0] || 'First Class'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Grading scale: 90%+ (A1) to 35% (D)
            </div>
          </div>

          {/* Card 4: Subjects Count */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Subjects Evaluated
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-slate-900">
                {result?.subjects?.length || 5}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Passed: <strong>{analysis?.passed_subjects_count || 5}</strong> | Fail: <strong>{analysis?.failed_subjects_count || 0}</strong>
            </div>
          </div>
        </div>

        {/* Middle Section: Subject Analytics + Next Steps Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Subject Breakdown & Smart Analysis Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Subject-wise Marks & Analytics</span>
                </h3>
                <p className="text-xs text-slate-500">Calculated dynamically from board evaluation dataset</p>
              </div>
              <Link to="/analysis" className="text-xs font-bold text-blue-600 hover:underline">
                Full AI Analysis →
              </Link>
            </div>

            {/* Subject Progress Bars */}
            <div className="space-y-3.5">
              {result?.subjects?.map((sub) => {
                const pct = sub.percentage || (sub.obtained_marks / sub.max_marks) * 100;
                const isFail = sub.status === 'FAIL';
                return (
                  <div key={sub.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {sub.subject_name} <span className="text-[10px] text-slate-400 font-mono">({sub.subject_code})</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sub.obtained_marks.toFixed(0)}/{sub.max_marks.toFixed(0)}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isFail ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                          {sub.grade}
                        </span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFail
                            ? 'bg-red-500'
                            : pct >= 85
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strengths & Weakness Quick Highlights */}
            {analysis && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Top Subject</div>
                  <div className="font-bold text-emerald-950 text-sm">{analysis.highest_mark_subject?.subject_name}</div>
                  <div className="text-emerald-700 font-semibold">{analysis.highest_mark_subject?.obtained_marks?.toFixed(0)}/100 ({analysis.highest_mark_subject?.percentage}%)</div>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Improvement Scope</div>
                  <div className="font-bold text-amber-950 text-sm">{analysis.lowest_mark_subject?.subject_name}</div>
                  <div className="text-amber-700 font-semibold">{analysis.lowest_mark_subject?.obtained_marks?.toFixed(0)}/100 ({analysis.lowest_mark_subject?.percentage}%)</div>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Cols: Top Verified Opportunities Matched */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>Matched Opportunities</span>
                </h3>
                <Link to="/opportunities" className="text-xs font-bold text-blue-600 hover:underline">
                  View All ({opportunities.length}) →
                </Link>
              </div>

              <div className="space-y-3">
                {opportunities.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{opp.title}</h4>
                      <StatusBadge status={opp.student_eligibility_status} size="sm" />
                    </div>
                    <p className="text-slate-500 line-clamp-1 text-[11px]">{opp.category} • {opp.source_authority}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Min Score: <strong>{opp.min_percentage}%</strong></span>
                      <span className="text-slate-600 font-medium">Deadline: {opp.application_deadline || 'Open'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/opportunities"
              className="w-full py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 rounded-xl text-xs font-bold text-center border border-slate-200 transition"
            >
              Explore All Verified Programs & Schemes
            </Link>
          </div>
        </div>

        {/* Bottom Section: Quick Links Grid (Deadlines, Documents, Revaluation, AI Counselor) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/deadlines"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:shadow-gov-lg transition transform hover:-translate-y-0.5 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Deadline Tracker</h4>
              <p className="text-xs text-slate-500 mt-1">
                {deadlines.filter(d => d.status !== 'CLOSED').length} active official admission and revaluation cutoffs.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition">
              Set Reminders →
            </span>
          </Link>

          <Link
            to="/documents"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:shadow-gov-lg transition transform hover:-translate-y-0.5 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Document Checklist</h4>
              <p className="text-xs text-slate-500 mt-1">
                Track readiness of mandatory TC, income, and caste certificates.
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-700 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition">
              Manage Checklist →
            </span>
          </Link>

          <Link
            to="/revaluation"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:shadow-gov-lg transition transform hover:-translate-y-0.5 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Revaluation & Suppl.</h4>
              <p className="text-xs text-slate-500 mt-1">
                Verified answer-book copy fee and supplementary exam procedures.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition">
              View Guidelines →
            </span>
          </Link>

          <Link
            to="/ai-assistant"
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-gov hover:shadow-gov-lg transition transform hover:-translate-y-0.5 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 text-amber-300 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">GovResult AI Guide</h4>
              <p className="text-xs text-blue-200 mt-1">
                Ask about cutoffs, subject options, and personalized pathways.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-300 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition">
              Start AI Consultation →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
