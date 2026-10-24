import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { NextStepsData, NextStepItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  Compass, 
  Award, 
  MessageSquare,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const NextStepsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nextSteps, setNextSteps] = useState<NextStepsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const studentId = user?.student_id || 1;
        const data = await api.getNextSteps(studentId);
        setNextSteps(data);
      } catch (err) {
        console.error('Failed to load action roadmap:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Generating Personalized Next-Step Action Plan...</p>
        </div>
      </div>
    );
  }

  if (!nextSteps) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-sm font-semibold text-slate-700">No next-step plan generated.</p>
        <Link to="/results" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Check Your Marksheet
        </Link>
      </div>
    );
  }

  const isCompartment = nextSteps.overall_status === 'COMPARTMENT' || nextSteps.overall_status === 'FAIL';

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#103A64] to-[#1A56DB] text-white rounded-3xl p-6 sm:p-8 shadow-gov relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Post-Result Pathway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Recommended Next Steps for {nextSteps.student_name}
            </h1>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs text-slate-200 leading-relaxed max-w-2xl">
              {nextSteps.summary_message}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span>Result Standing:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full ${isCompartment ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'}`}>
                  {nextSteps.overall_status} ({nextSteps.overall_percentage}%)
                </span>
              </div>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">
                Action items dynamically computed from active board windows & verified rules.
              </span>
            </div>
          </div>
        </div>

        {/* Action Plan Timeline List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Your Step-by-Step Action Roadmap ({nextSteps.action_plan.length} Steps)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Follow sequentially for highest success</span>
          </div>

          <div className="space-y-4">
            {nextSteps.action_plan.map((step) => {
              const isUrgent = step.status === 'URGENT';
              const isCompleted = step.status === 'COMPLETED';
              const isRecommended = step.status === 'RECOMMENDED';

              return (
                <div
                  key={step.step_number}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border shadow-gov transition transform hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${
                    isUrgent
                      ? 'border-2 border-red-400 bg-red-50/20'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Step Number Circle */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isUrgent
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-blue-700 text-white'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.step_number}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {step.title}
                        </h4>
                        <StatusBadge status={step.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pt-0.5">
                        Category: {step.category}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 sm:pl-4">
                    <Link
                      to={step.action_url}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                        isUrgent
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <span>{step.action_text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Counselor Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Need Detailed Advice on Your Specific Stream?</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              GovResult AI can clarify course eligibility, quota certificates, revaluation procedures, and cutoff trends without hallucinating.
            </p>
          </div>

          <Link
            to="/ai-assistant"
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult GovResult AI</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
