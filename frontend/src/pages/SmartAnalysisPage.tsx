import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ResultData, ResultAnalysis } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  TrendingUp, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Compass, 
  BarChart3,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const SmartAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [analysis, setAnalysis] = useState<ResultAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoading(true);
      try {
        let resData: ResultData;
        if (user?.student_id) {
          resData = await api.getStudentLatestResult(user.student_id);
        } else {
          resData = await api.searchResult({ registration_number: 'TN202612089' });
        }
        setResult(resData);
        if (resData?.id) {
          const analData = await api.getResultAnalysis(resData.id);
          setAnalysis(analData);
        }
      } catch (err) {
        console.error('Failed to load analysis:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalysis();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Running Dynamic Analytical Models on Student Data...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-sm font-semibold text-slate-700">No active marksheet found to analyze.</p>
        <Link to="/results" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Search Your Marksheet
        </Link>
      </div>
    );
  }

  const isCompartment = analysis.result_status === 'COMPARTMENT' || analysis.result_status === 'FAIL';

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              Grounded in Candidate Result Data
            </span>
          </div>
        </div>

        {/* Hero Summary Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Smart Performance Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                AI Result Analysis for {analysis.student_name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {analysis.examination_name} ({analysis.year}) • Reg No: <strong className="text-slate-800 font-mono">{analysis.registration_number}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StatusBadge status={analysis.result_status} size="lg" />
              <div className="text-right">
                <div className="text-3xl font-black text-slate-900">{analysis.overall_percentage}%</div>
                <div className="text-xs font-bold text-blue-700 uppercase">Grade {analysis.overall_grade}</div>
              </div>
            </div>
          </div>

          {/* Performance Summary Text */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Overall Evaluation Summary</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{analysis.performance_summary}</p>
          </div>

          {/* KPI Matrix (Section 8 Calculations) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="text-[10px] font-bold text-blue-800 uppercase">Highest Score</div>
              <div className="text-xl font-black text-blue-950 mt-1">
                {analysis.highest_mark_subject?.obtained_marks?.toFixed(0)}/{analysis.highest_mark_subject?.max_marks?.toFixed(0)}
              </div>
              <div className="text-[11px] text-blue-700 font-semibold truncate mt-0.5">
                {analysis.highest_mark_subject?.subject_name} ({analysis.highest_mark_subject?.percentage}%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="text-[10px] font-bold text-amber-800 uppercase">Lowest Relative Score</div>
              <div className="text-xl font-black text-amber-950 mt-1">
                {analysis.lowest_mark_subject?.obtained_marks?.toFixed(0)}/{analysis.lowest_mark_subject?.max_marks?.toFixed(0)}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold truncate mt-0.5">
                {analysis.lowest_mark_subject?.subject_name} ({analysis.lowest_mark_subject?.percentage}%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
              <div className="text-[10px] font-bold text-purple-800 uppercase">Average Mark</div>
              <div className="text-xl font-black text-purple-950 mt-1">
                {analysis.average_mark} / 100
              </div>
              <div className="text-[11px] text-purple-700 font-medium mt-0.5">
                Across {analysis.total_subjects} subjects
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Subject Clearance</div>
              <div className="text-xl font-black text-emerald-950 mt-1">
                {analysis.passed_subjects_count} of {analysis.total_subjects}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                {analysis.failed_subjects_count > 0 ? `${analysis.failed_subjects_count} Compartment` : '100% Passed'}
              </div>
            </div>
          </div>
        </div>

        {/* Strong Subjects & Improvement Areas Detailed Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strong Subjects */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Strong Subjects (Key Strengths)</h3>
                <p className="text-[11px] text-slate-500">Subjects demonstrating top conceptual mastery</p>
              </div>
            </div>

            <div className="space-y-3">
              {analysis.strong_subjects.map((sub, idx) => (
                <div key={idx} className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{sub.subject_name}</span>
                    <span className="text-emerald-700 font-black text-sm">{sub.obtained_marks.toFixed(0)}/{sub.max_marks.toFixed(0)} ({sub.percentage}%)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{sub.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Areas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Improvement Areas & Next Action</h3>
                <p className="text-[11px] text-slate-500">Subjects eligible for revaluation or supplementary exam</p>
              </div>
            </div>

            <div className="space-y-3">
              {analysis.improvement_areas.map((sub, idx) => (
                <div key={idx} className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{sub.subject_name}</span>
                    <span className={`font-black text-sm ${sub.percentage < 35 ? 'text-red-600' : 'text-amber-800'}`}>
                      {sub.obtained_marks.toFixed(0)}/{sub.max_marks.toFixed(0)} ({sub.percentage}%)
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{sub.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Takeaways & Strategic Recommendation */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Key Takeaways & Strategic Pathway</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {analysis.key_takeaways.map((item, idx) => (
              <div key={idx} className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Want customized counsel? Chat directly with GovResult AI.
            </span>
            <div className="flex gap-3">
              <Link
                to="/opportunities"
                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold border border-white/30 transition"
              >
                Browse Matched Opportunities
              </Link>
              <Link
                to="/next-steps"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>View Full Action Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
