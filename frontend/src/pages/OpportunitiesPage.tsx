import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Opportunity } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { OfficialSourceBadge } from '../components/common/OfficialSourceBadge';
import { 
  Compass, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ShieldCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = [
    'all',
    'Higher Education',
    'Scholarships',
    'Diploma Programs',
    'ITI / Skill Programs',
    'Entrance Examinations',
    'Government Educational Schemes'
  ];

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOpportunities(
        selectedCategory,
        searchTerm,
        user?.student_id || 1 // Defaults to student 1 if not logged in
      );
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (statusFilter === 'all') return true;
    return opp.student_eligibility_status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Verified Pathway Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Eligible Post-Result Opportunities
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Government admissions, central scholarships, diploma certifications, and technical skill programs evaluated against your marksheet and verified gazette rules.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Official Sources Only
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search program, degree, scholarship..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
              >
                Search
              </button>
            </form>

            {/* Eligibility Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Filter By Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Statuses ({opportunities.length})</option>
                <option value="ELIGIBLE">Eligible (Green)</option>
                <option value="CHECK_REQUIRED">Check Required (Yellow)</option>
                <option value="NOT_ELIGIBLE">Not Eligible (Red)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pt-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-600">Evaluating opportunities against verified eligibility rules...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Opportunities Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No programs match the selected category or filter. Try clearing your search parameters.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setStatusFilter('all'); setSearchTerm(''); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opp) => {
              const isEligible = opp.student_eligibility_status === 'ELIGIBLE';
              const isCheckReq = opp.student_eligibility_status === 'CHECK_REQUIRED';
              const isNotEligible = opp.student_eligibility_status === 'NOT_ELIGIBLE';

              return (
                <div
                  key={opp.id}
                  className={`bg-white rounded-2xl border shadow-gov p-6 flex flex-col justify-between space-y-5 transition transform hover:-translate-y-0.5 ${
                    isEligible
                      ? 'border-emerald-300 hover:border-emerald-400'
                      : isCheckReq
                      ? 'border-amber-200 hover:border-amber-300'
                      : 'border-slate-200 opacity-90'
                  }`}
                >
                  {/* Top: Category & Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {opp.category}
                      </span>
                      <StatusBadge status={opp.student_eligibility_status} size="md" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {opp.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Eligibility Breakdown */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
                        <span>Eligibility Criteria:</span>
                        <span className="text-blue-700 font-mono">Min: {opp.min_percentage}%</span>
                      </div>
                      <p className="text-slate-600 text-xs">{opp.eligibility_summary}</p>
                      
                      {/* Reason bullet points */}
                      {opp.student_eligibility_reasons && opp.student_eligibility_reasons.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
                          {opp.student_eligibility_reasons.map((r, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-1.5 ${
                                r.startsWith('✓') ? 'text-emerald-700 font-medium' : isCheckReq ? 'text-amber-800' : 'text-red-700 font-medium'
                              }`}
                            >
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Meta Timeline & Docs */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: <strong className="text-slate-800">{opp.application_deadline || 'Open'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{opp.required_documents_summary || 'Standard Marksheet'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Official Source Badge & Link */}
                  <div className="space-y-3 pt-2">
                    <OfficialSourceBadge
                      authority={opp.source_authority}
                      url={opp.source_url}
                      verifiedDate={opp.last_verified_date}
                      status={opp.verification_status}
                    />

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="text-[10px] text-slate-400">
                        Zero Fabrication • Official Portal Verified
                      </span>
                      <a
                        href={opp.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Official Apply Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
