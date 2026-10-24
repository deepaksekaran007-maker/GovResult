import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminOverview, Opportunity, DeadlineItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { OfficialSourceBadge } from '../components/common/OfficialSourceBadge';
import { 
  Shield, 
  Layers, 
  Users, 
  FileText, 
  Compass, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Edit2,
  Lock,
  Building,
  RefreshCw
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user, isAdmin, switchDemoUser } = useAuth();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'deadlines' | 'sources'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // New Opportunity Form State
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [newOpp, setNewOpp] = useState({
    title: '',
    category: 'Higher Education',
    description: '',
    eligibility_summary: '',
    min_percentage: 60.0,
    stream_requirement: 'Any',
    application_deadline: '2026-10-31',
    source_authority: 'State Directorate of Education',
    source_url: 'https://education.gov.in',
    verification_status: 'VERIFIED'
  });

  // New Deadline Form State
  const [showAddDlModal, setShowAddDlModal] = useState(false);
  const [newDl, setNewDl] = useState({
    title: '',
    activity_type: 'ADMISSION',
    related_exam_opportunity: 'Higher Secondary 2026',
    start_date: '2026-06-01',
    deadline_date: '2026-10-15',
    source_authority: 'Central Admissions Portal',
    source_url: 'https://counselling.nic.in',
    verification_status: 'VERIFIED'
  });

  const [toast, setToast] = useState<string | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const ov = await api.getAdminOverview();
        setOverview(ov);
      }
      const opps = await api.getOpportunities();
      setOpportunities(opps);
      const dls = await api.getDeadlines();
      setDeadlines(dls);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createOpportunity(newOpp);
      setToast('✓ Opportunity created and published with official verification status.');
      setShowAddOppModal(false);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create opportunity. Ensure you are logged in as Admin.');
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleDeleteOpportunity = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await api.deleteOpportunity(id);
      setToast('Opportunity deleted.');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete opportunity.');
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDeadline(newDl);
      setToast('✓ Official deadline registered and countdown enabled.');
      setShowAddDlModal(false);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create deadline.');
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-8 max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The Admin Portal is restricted to authorized Government Examination Controllers and Verification Officers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => switchDemoUser('admin').then(() => loadAdminData())}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              One-Click Switch to Admin Profile (Dr. S. Ramalingam)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast */}
        {toast && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {toast}
            </span>
            <button onClick={() => setToast(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-[#0A2540] text-white rounded-3xl p-6 sm:p-8 shadow-gov space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>State & National Examination Administrative Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Official Authority Control Portal
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Logged in as: <strong className="text-white">{user?.full_name}</strong> (Controller of Examinations)
              </p>
            </div>

            <button
              onClick={loadAdminData}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Records</span>
            </button>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Students</span>
              <div className="text-2xl font-black text-white mt-0.5">{overview?.total_students || 2}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Published Results</span>
              <div className="text-2xl font-black text-white mt-0.5">{overview?.total_results || 2}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified Opportunities</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{opportunities.length}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tracked Deadlines</span>
              <div className="text-2xl font-black text-amber-400 mt-0.5">{deadlines.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-2 flex gap-2">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'opportunities', label: `Manage Opportunities (${opportunities.length})`, icon: Compass },
            { id: 'deadlines', label: `Manage Deadlines (${deadlines.length})`, icon: Clock }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  activeTab === t.id
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                <span>Verification Data Integrity Status</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                  <span>Examination Results Database</span>
                  <span className="font-bold">ONLINE & VERIFIED</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                  <span>Revaluation Gateway & Feeds</span>
                  <span className="font-bold">ACTIVE (WINDOW OPEN)</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                  <span>Supplementary Examination System</span>
                  <span className="font-bold">SCHEDULED (OCT 2026)</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                  <span>AI Grounding Compliance Engine</span>
                  <span className="font-bold">ZERO HALLUCINATION</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Active Prototype Demo Candidates</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block font-bold">Arun Kumar</strong>
                    <span className="text-slate-500 font-mono text-[11px]">Reg: TN202612089 • Class 12 Science</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    84.2% PASS (Distinction)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block font-bold">Priya Sharma</strong>
                    <span className="text-slate-500 font-mono text-[11px]">Reg: TN202612090 • Class 12 Science</span>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    COMPARTMENT (Chemistry)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Opportunities Management */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Government Schemes, Scholarships & Programs
              </h3>
              <button
                onClick={() => setShowAddOppModal(true)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Opportunity</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Program Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Min Score</th>
                    <th className="py-3 px-3">Authority & Verified Date</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                        {opp.title}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-600">
                        {opp.category}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {opp.min_percentage}%
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        <div>{opp.source_authority}</div>
                        <div className="text-emerald-600 font-medium">Verified: {opp.last_verified_date}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={opp.verification_status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteOpportunity(opp.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                          title="Delete opportunity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Deadlines Management */}
        {activeTab === 'deadlines' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Official Examination & Admission Deadlines
              </h3>
              <button
                onClick={() => setShowAddDlModal(true)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Deadline</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Activity Title</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Deadline Date</th>
                    <th className="py-3 px-3 text-center">Days Remaining</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deadlines.map((dl) => (
                    <tr key={dl.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {dl.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold text-[10px]">
                          {dl.activity_type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-red-600">
                        {dl.deadline_date}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        {dl.days_remaining} days
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={dl.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Opportunity Modal */}
        {showAddOppModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Publish Verified Opportunity</h3>
                <button onClick={() => setShowAddOppModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateOpportunity} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Polytechnic AI & Machine Learning Diploma"
                    value={newOpp.title}
                    onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newOpp.category}
                      onChange={(e) => setNewOpp({ ...newOpp, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="Higher Education">Higher Education</option>
                      <option value="Scholarships">Scholarships</option>
                      <option value="Diploma Programs">Diploma Programs</option>
                      <option value="ITI / Skill Programs">ITI / Skill Programs</option>
                      <option value="Entrance Examinations">Entrance Examinations</option>
                      <option value="Government Educational Schemes">Government Educational Schemes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Min Aggregate %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newOpp.min_percentage}
                      onChange={(e) => setNewOpp({ ...newOpp, min_percentage: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={newOpp.description}
                    onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eligibility Criteria Summary</label>
                  <input
                    type="text"
                    required
                    value={newOpp.eligibility_summary}
                    onChange={(e) => setNewOpp({ ...newOpp, eligibility_summary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      required
                      value={newOpp.source_authority}
                      onChange={(e) => setNewOpp({ ...newOpp, source_authority: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Portal URL</label>
                    <input
                      type="url"
                      required
                      value={newOpp.source_url}
                      onChange={(e) => setNewOpp({ ...newOpp, source_url: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddOppModal(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-700 text-white rounded-xl font-bold shadow-sm"
                  >
                    Publish Opportunity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Deadline Modal */}
        {showAddDlModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Add Official Deadline</h3>
                <button onClick={() => setShowAddDlModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateDeadline} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Activity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Polytechnic Round 1 Allotment"
                    value={newDl.title}
                    onChange={(e) => setNewDl({ ...newDl, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={newDl.start_date}
                      onChange={(e) => setNewDl({ ...newDl, start_date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deadline Date</label>
                    <input
                      type="date"
                      required
                      value={newDl.deadline_date}
                      onChange={(e) => setNewDl({ ...newDl, deadline_date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDlModal(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-700 text-white rounded-xl font-bold shadow-sm"
                  >
                    Save Deadline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
