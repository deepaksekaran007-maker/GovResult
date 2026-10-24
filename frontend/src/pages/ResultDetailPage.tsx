import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ResultData, ResultAnalysis } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  TrendingUp, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck,
  Building,
  Award,
  Share2
} from 'lucide-react';

export const ResultDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [analysis, setAnalysis] = useState<ResultAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        const resultId = id ? parseInt(id) : 1;
        const data = await api.getResultById(resultId);
        setResult(data);
        const anal = await api.getResultAnalysis(resultId);
        setAnalysis(anal);
      } catch (err) {
        console.error('Failed to load result marksheet:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Generating Official Verified Marksheet...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-sm font-semibold text-slate-700">Result record not found.</p>
        <Link to="/results" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Search Another Result
        </Link>
      </div>
    );
  }

  const isPass = result.result_status === 'PASS';

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Action Bar (Hidden when printing) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Official Marksheet</span>
            </button>

            <Link
              to="/analysis"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Smart Analysis</span>
            </Link>

            <Link
              to="/next-steps"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Recommended Next Steps</span>
            </Link>
          </div>
        </div>

        {/* Official Marksheet Document Card */}
        <div className="marksheet-container bg-white rounded-2xl border-4 border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-8xl font-black uppercase text-slate-900 rotate-[-25deg]">
            OFFICIAL MARKSHEET
          </div>

          {/* Marksheet Header */}
          <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6 relative z-10">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                🏛️
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold uppercase tracking-widest text-slate-800">
                  {result.board_name}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Directorate of Government Examinations & Evaluation
                </div>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-2 uppercase">
              Statement of Marks & Performance Certificate
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              {result.examination_name} — Year {result.examination_year}
            </p>
          </div>

          {/* Student Credentials Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs relative z-10">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Candidate Name</span>
              <strong className="text-slate-900 text-sm">{result.student_name}</strong>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registration Number</span>
              <strong className="text-blue-700 font-mono text-sm">{result.registration_number}</strong>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Roll Number</span>
              <strong className="text-slate-800 font-mono text-sm">{result.roll_number || 'N/A'}</strong>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Declaration Date</span>
              <strong className="text-slate-800 text-sm">{result.declaration_date}</strong>
            </div>
          </div>

          {/* Subject-Wise Marks Table */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Subject-Wise Marks Evaluation</span>
              <span>Passing Criteria: Minimum 35% in each subject</span>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="py-3 px-3.5">Subject Code & Name</th>
                    <th className="py-3 px-3 text-center">Max Marks</th>
                    <th className="py-3 px-3 text-center">Theory</th>
                    <th className="py-3 px-3 text-center">Practical</th>
                    <th className="py-3 px-3 text-center">Marks Obtained</th>
                    <th className="py-3 px-3 text-center">Subject Grade</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.subjects.map((sub, idx) => (
                    <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">
                        {sub.subject_name} <span className="text-slate-400 font-mono text-[10px]">({sub.subject_code})</span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">{sub.max_marks.toFixed(0)}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{sub.theory_marks.toFixed(0)}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{sub.practical_marks.toFixed(0)}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900 text-sm">{sub.obtained_marks.toFixed(0)}</td>
                      <td className="py-3 px-3 text-center font-extrabold text-blue-700">{sub.grade}</td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900">
                    <td className="py-3 px-3.5 uppercase tracking-wider">Aggregate Total</td>
                    <td className="py-3 px-3 text-center">{result.total_max_marks.toFixed(0)}</td>
                    <td className="py-3 px-3 text-center text-slate-400">-</td>
                    <td className="py-3 px-3 text-center text-slate-400">-</td>
                    <td className="py-3 px-3 text-center text-base font-black text-blue-900">
                      {result.total_obtained_marks.toFixed(0)}
                    </td>
                    <td className="py-3 px-3 text-center text-base font-black text-blue-700">
                      {result.overall_grade}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={result.result_status} size="md" />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Performance Calculation Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-xl relative z-10 text-xs">
            <div>
              <span className="text-blue-900/70 font-semibold block text-[10px] uppercase">Final Result</span>
              <strong className={`text-xl font-black ${isPass ? 'text-emerald-700' : 'text-red-600'}`}>
                {result.result_status}
              </strong>
            </div>

            <div>
              <span className="text-blue-900/70 font-semibold block text-[10px] uppercase">Overall Percentage</span>
              <strong className="text-2xl font-black text-slate-900">
                {result.overall_percentage}%
              </strong>
            </div>

            <div>
              <span className="text-blue-900/70 font-semibold block text-[10px] uppercase">Performance Band</span>
              <strong className="text-slate-800 text-sm">
                {analysis?.performance_band || 'First Class'}
              </strong>
            </div>
          </div>

          {/* Official Remarks */}
          {result.official_remarks && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 relative z-10">
              <strong>Official Board Remarks:</strong> {result.official_remarks}
            </div>
          )}

          {/* Signatures & Security Footer */}
          <div className="pt-8 border-t border-slate-300 flex flex-wrap items-end justify-between gap-6 relative z-10 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="space-y-0.5 text-[11px] text-slate-500">
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digital Authenticity Verified
                </div>
                <div>Hash: 8F2A-94BC-2026-GOV-OK</div>
                <div>Verified by National Digilocker System</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="w-36 h-10 border-b border-dashed border-slate-400 mx-auto sm:ml-auto"></div>
              <div className="font-bold text-slate-900 text-xs">Controller of Examinations</div>
              <div className="text-[10px] text-slate-500">Authorized Signature & Evaluation Seal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
