import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DeadlineItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { OfficialSourceBadge } from '../components/common/OfficialSourceBadge';
import { 
  Clock, 
  Bell, 
  BellRing, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Filter,
  Trash2,
  Sparkles
} from 'lucide-react';

export const DeadlinesPage: React.FC = () => {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineItem | null>(null);
  const [reminderType, setReminderType] = useState<string>('3_DAYS_BEFORE');
  const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDeadlines = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDeadlines();
      setDeadlines(data);
    } catch (err) {
      console.error('Failed to load deadlines:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [user]);

  const handleSetReminder = async () => {
    if (!selectedDeadline) return;
    setIsSubmittingReminder(true);
    try {
      await api.setReminder(selectedDeadline.id, reminderType);
      setToastMessage(`✓ Alert configured! You will be reminded ${reminderType.replace('_', ' ').toLowerCase()} for "${selectedDeadline.title}".`);
      setSelectedDeadline(null);
      await fetchDeadlines();
    } catch (err: any) {
      alert(err.message || 'Failed to set reminder. Please login.');
    } finally {
      setIsSubmittingReminder(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleRemoveReminder = async (deadlineId: number) => {
    try {
      await api.removeReminder(deadlineId);
      setToastMessage('Reminder cancelled successfully.');
      await fetchDeadlines();
    } catch (err: any) {
      console.error('Failed to remove reminder:', err);
    } finally {
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-3">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Time-Critical Action Tracker</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Important Academic Deadlines & Alert Triggers
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Dynamically calculated days remaining for seat allocation counselling, scholarship portal submissions, and revaluation cutoffs. Set automated reminder triggers so you never miss an official window.
              </p>
            </div>

            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Synchronized with Official Portals
            </span>
          </div>
        </div>

        {/* Deadlines List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-600">Calculating Live Deadline Days Remaining...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deadlines.map((dl) => {
              const isClosingSoon = dl.status === 'CLOSING_SOON';
              const isClosed = dl.status === 'CLOSED';

              return (
                <div
                  key={dl.id}
                  className={`bg-white rounded-2xl border shadow-gov p-6 flex flex-col justify-between space-y-5 transition ${
                    isClosingSoon
                      ? 'border-amber-300 bg-amber-50/10'
                      : isClosed
                      ? 'border-slate-200 opacity-60'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Activity Type & Days Remaining Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {dl.activity_type}
                      </span>
                      <StatusBadge status={dl.status} size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {dl.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium">
                      Related: <strong className="text-slate-700">{dl.related_exam_opportunity}</strong>
                    </p>

                    {/* Timeline Box */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Start Date</span>
                        <span className="font-semibold text-slate-800">{dl.start_date}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Deadline Cutoff</span>
                        <span className="font-bold text-red-600">{dl.deadline_date}</span>
                      </div>
                    </div>

                    {/* Live Countdown Badge */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-600">Days Remaining:</span>
                      <span className={`text-base font-black ${
                        isClosed ? 'text-slate-400' : isClosingSoon ? 'text-amber-600 animate-pulse' : 'text-emerald-700'
                      }`}>
                        {dl.days_remaining < 0 ? 'Expired' : `${dl.days_remaining} Days Remaining`}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <OfficialSourceBadge
                      authority={dl.source_authority}
                      url={dl.source_url}
                      verifiedDate={dl.last_verified_date}
                      status={dl.verification_status}
                    />

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {dl.has_reminder_set ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1 text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                            <BellRing className="w-3.5 h-3.5 text-purple-600" />
                            <span>Alert Set ({dl.reminder_type?.replace('_', ' ')})</span>
                          </span>
                          <button
                            onClick={() => handleRemoveReminder(dl.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition"
                            title="Cancel reminder"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedDeadline(dl)}
                          disabled={isClosed}
                          className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Set Reminder</span>
                        </button>
                      )}

                      <a
                        href={dl.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Set Reminder Modal */}
        {selectedDeadline && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Configure Deadline Alert</h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-[260px]">{selectedDeadline.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDeadline(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div>Deadline Date: <strong className="text-red-600">{selectedDeadline.deadline_date}</strong></div>
                <div>Days Remaining: <strong>{selectedDeadline.days_remaining} days</strong></div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block font-semibold text-slate-700">When should we alert you?</label>
                <div className="space-y-2">
                  {[
                    { val: '1_DAY_BEFORE', label: '1 Day Before Deadline (Final Alert)' },
                    { val: '3_DAYS_BEFORE', label: '3 Days Before Deadline (Recommended)' },
                    { val: '7_DAYS_BEFORE', label: '7 Days Before Deadline (Early Preparation)' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                        reminderType === opt.val
                          ? 'border-purple-600 bg-purple-50/60 font-bold text-purple-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reminder"
                        value={opt.val}
                        checked={reminderType === opt.val}
                        onChange={(e) => setReminderType(e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDeadline(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSetReminder}
                  disabled={isSubmittingReminder}
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {isSubmittingReminder ? 'Saving...' : 'Set Active Alert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
