import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ResultData, Examination } from '../types';
import { Search, Shield, AlertCircle, ArrowRight, CheckCircle2, FileText, QrCode } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const ResultSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [examList, setExamList] = useState<any[]>([]);
  const [regNo, setRegNo] = useState(searchParams.get('reg') || '');
  const [rollNo, setRollNo] = useState('');
  const [examYear, setExamYear] = useState(searchParams.get('year') || '2026');
  const [captchaInput, setCaptchaInput] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const exams = await api.getExaminations();
        setExamList(exams);
      } catch (e) {
        console.warn('Using default exams');
      }
    };
    loadExams();

    // Auto-search if query param exists
    const queryReg = searchParams.get('reg');
    if (queryReg) {
      handleSearch(queryReg);
    }
  }, [searchParams]);

  const handleSearch = async (targetReg?: string) => {
    const reg = (targetReg || regNo).trim();
    if (!reg) {
      setError('Please enter a valid Registration Number or Roll Number.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const res = await api.searchResult({
        registration_number: reg,
        roll_number: rollNo.trim() || undefined,
        examination_year: parseInt(examYear),
        captcha: captchaInput
      });
      setResult(res);
    } catch (err: any) {
      setResult(null);
      setError(err.message || 'No examination result found. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Official Examination Result Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Search Examination Marksheet & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Enter your candidate registration credentials below to retrieve the verified digital marksheet, dynamic grade analysis, and personalized next steps.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-gov p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <div>
                <p className="font-bold">Result Not Found</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Examination</label>
                <select
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="1">Higher Secondary Certificate (Class 12) - 2026</option>
                  <option value="2">Secondary School Leaving Certificate (Class 10) - 2026</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TN202612089"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Roll Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ROLL20268801"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Examination Year</label>
                <input
                  type="text"
                  disabled
                  value={examYear}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Security Code</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-slate-200 font-mono font-bold tracking-widest text-slate-800 rounded-lg text-xs select-none border">
                    GOV26
                  </span>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                <span>Quick Test Candidates: </span>
                <button
                  type="button"
                  onClick={() => { setRegNo('TN202612089'); handleSearch('TN202612089'); }}
                  className="text-blue-600 font-bold hover:underline mr-2"
                >
                  Arun Kumar (84.2% Pass)
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => { setRegNo('TN202612090'); handleSearch('TN202612090'); }}
                  className="text-amber-700 font-bold hover:underline ml-2"
                >
                  Priya Sharma (Compartment)
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-xs"
              >
                <Search className="w-4 h-4" />
                <span>{isLoading ? 'Retrieving Records...' : 'Search Result'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Search Result Card Preview */}
        {result && (
          <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-gov-lg p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Candidate Result Found</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{result.student_name}</h2>
                <p className="text-xs text-slate-500">
                  {result.examination_name} ({result.examination_year}) • Reg: <strong className="text-slate-800 font-mono">{result.registration_number}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={result.result_status} size="lg" />
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">{result.overall_percentage}%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Grade {result.overall_grade}</div>
                </div>
              </div>
            </div>

            {/* Subject Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">Subject</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Max</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Theory</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Practical</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Obtained</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Grade</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.subjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {sub.subject_name} <span className="text-slate-400 font-mono text-[10px]">({sub.subject_code})</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{sub.max_marks.toFixed(0)}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{sub.theory_marks.toFixed(0)}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{sub.practical_marks.toFixed(0)}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{sub.obtained_marks.toFixed(0)}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-blue-700">{sub.grade}</td>
                      <td className="py-2.5 px-3 text-center">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar to open Full Marksheet or Smart Next Steps */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>Declaration Date: {result.declaration_date} • Digitally Signed</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/results/${result.id}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Printable Marksheet</span>
                </Link>
                <Link
                  to="/next-steps"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Explore Recommended Next Steps</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
