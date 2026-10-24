import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RevaluationInfo, SupplementaryInfo, ResultData } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { OfficialSourceBadge } from '../components/common/OfficialSourceBadge';
import { 
  Award, 
  HelpCircle, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Clock,
  ArrowRight
} from 'lucide-react';

export const RevaluationPage: React.FC = () => {
  const { user } = useAuth();
  const [reval, setReval] = useState<RevaluationInfo | null>(null);
  const [suppl, setSuppl] = useState<SupplementaryInfo | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revaluation' | 'supplementary'>('revaluation');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const examId = 1;
        const revalData = await api.getRevaluation(examId);
        setReval(revalData);
        const supplData = await api.getSupplementary(examId);
        setSuppl(supplData);

        if (user?.student_id) {
          try {
            const res = await api.getStudentLatestResult(user.student_id);
            setResult(res);
            if (res.result_status === 'COMPARTMENT' || res.result_status === 'FAIL') {
              setActiveTab('supplementary');
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to load revaluation / supplementary records:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Loading Official Revaluation & Supplementary Windows...</p>
        </div>
      </div>
    );
  }

  const failedSubjects = result?.subjects?.filter(s => s.status === 'FAIL') || [];

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Marks Recalculation & Supplementary Pathways</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Revaluation & Supplementary Examination
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Official board procedures, fee schedules, verified timelines, and step-by-step submission guidelines for answer-script copy and compartment clearance.
              </p>
            </div>

            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Verified Board Gazettes
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-bold pt-2">
            <button
              onClick={() => setActiveTab('revaluation')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'revaluation'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>1. Answer Sheet Revaluation</span>
              <StatusBadge status={reval?.status || 'AVAILABLE'} size="sm" />
            </button>

            <button
              onClick={() => setActiveTab('supplementary')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'supplementary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>2. Supplementary Examination</span>
              <StatusBadge status={suppl?.status || 'AVAILABLE'} size="sm" />
              {failedSubjects.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {failedSubjects.length} Subject
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Revaluation Module */}
        {activeTab === 'revaluation' && reval && (
          <div className="space-y-6 animate-in fade-in">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Examination Board Service</span>
                  <h3 className="text-xl font-bold text-slate-900">{reval.examination_name}</h3>
                  <p className="text-xs text-slate-500">Marks Recalculation & Complete Revaluation of Evaluated Answer Scripts</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Application Window</span>
                    <div className="text-sm font-bold text-slate-900">{reval.application_deadline}</div>
                  </div>
                  <StatusBadge status={reval.status} size="lg" />
                </div>
              </div>

              {/* Fee & Deadline Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Prescribed Fee
                  </div>
                  <div className="text-2xl font-black text-blue-950">INR {reval.fee_per_subject}</div>
                  <div className="text-[11px] text-blue-700">Per subject revaluation charge</div>
                </div>

                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Start & End Dates
                  </div>
                  <div className="text-sm font-bold text-purple-950">{reval.application_start} to {reval.application_deadline}</div>
                  <div className="text-[11px] text-purple-700">Online portal active</div>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Days Remaining
                  </div>
                  <div className="text-2xl font-black text-amber-950">{reval.days_remaining} Days</div>
                  <div className="text-[11px] text-amber-700 font-semibold">Apply before cutoff closes</div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <strong className="text-slate-900 block font-bold">Eligibility Criteria:</strong>
                <p className="text-slate-600 leading-relaxed">{reval.eligible_criteria}</p>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Official Application Procedure</span>
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-700">
                  {reval.procedure_steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Official Source & Apply CTA */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <OfficialSourceBadge
                  authority={reval.source_authority}
                  url={reval.source_url}
                  verifiedDate={reval.last_verified_date}
                  status={reval.verification_status}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Candidate Registration: <strong className="text-slate-800 font-mono">{result?.registration_number || 'TN202612089'}</strong>
                  </span>
                  <a
                    href={reval.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>Proceed to Official Revaluation Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Supplementary Exam Module */}
        {activeTab === 'supplementary' && suppl && (
          <div className="space-y-6 animate-in fade-in">
            {/* Compartment Alert if Candidate has Failed Subject */}
            {failedSubjects.length > 0 && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-red-900 font-bold text-sm block">Compartment Clearance Required</strong>
                  <p className="text-red-700 leading-relaxed">
                    You have not cleared the minimum passing standard (35%) in: <strong>{failedSubjects.map(s => `${s.subject_name} (${s.obtained_marks.toFixed(0)}/100)`).join(', ')}</strong>.
                    Registering for the Supplementary session scheduled on <strong>{suppl.exam_date}</strong> will enable full certificate clearance.
                  </p>
                </div>
              </div>
            )}

            {/* Main Supplementary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Year Recovery</span>
                  <h3 className="text-xl font-bold text-slate-900">{suppl.examination_name} - Supplementary</h3>
                  <p className="text-xs text-slate-500">Official Special Supplementary Examination Session</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Exam Scheduled Date</span>
                    <div className="text-sm font-bold text-slate-900">{suppl.exam_date}</div>
                  </div>
                  <StatusBadge status={suppl.status} size="lg" />
                </div>
              </div>

              {/* Fee & Exam Dates Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Exam Date
                  </div>
                  <div className="text-base font-black text-blue-950">{suppl.exam_date}</div>
                  <div className="text-[10px] text-blue-700">Special session</div>
                </div>

                <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-red-800 uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Apply Deadline
                  </div>
                  <div className="text-base font-black text-red-950">{suppl.application_deadline}</div>
                  <div className="text-[10px] text-red-700 font-semibold">{suppl.days_remaining} days left</div>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Exam Fee
                  </div>
                  <div className="text-base font-black text-emerald-950">INR {suppl.fee_per_subject}</div>
                  <div className="text-[10px] text-emerald-700">Per failed subject</div>
                </div>

                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Allowed Max
                  </div>
                  <div className="text-base font-black text-purple-950">{suppl.max_subjects_allowed} Subjects</div>
                  <div className="text-[10px] text-purple-700">Compartment limit</div>
                </div>
              </div>

              {/* Required Documents for Supplementary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <strong className="text-slate-900 font-bold block">Required Documents at Examination Center:</strong>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  {suppl.required_documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Procedure Steps */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Supplementary Registration Steps</span>
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-700">
                  {suppl.procedure_steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Official Source & Apply CTA */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <OfficialSourceBadge
                  authority={suppl.source_authority}
                  url={suppl.source_url}
                  verifiedDate={suppl.last_verified_date}
                  status={suppl.verification_status}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Registration Cutoff: <strong className="text-red-600">{suppl.application_deadline}</strong>
                  </span>
                  <a
                    href={suppl.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>Register on Supplementary Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
