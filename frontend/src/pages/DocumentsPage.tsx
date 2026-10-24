import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DocumentItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  Building,
  Save,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [user]);

  const handleToggleStatus = async (doc: DocumentItem) => {
    const newStatus = doc.status === 'READY' ? 'PENDING' : 'READY';
    try {
      await api.updateDocumentStatus(doc.id, newStatus, doc.notes);
      setToastMsg(`Status for "${doc.name}" updated to ${newStatus}.`);
      await fetchDocs();
    } catch (err: any) {
      alert(err.message || 'Please log in to save your document checklist status.');
    } finally {
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleSaveNotes = async (docId: number) => {
    try {
      const doc = documents.find(d => d.id === docId);
      await api.updateDocumentStatus(docId, doc?.status || 'PENDING', tempNotes);
      setEditingNotesId(null);
      setToastMsg('Document notes updated successfully.');
      await fetchDocs();
    } catch (err: any) {
      alert(err.message || 'Failed to update notes.');
    } finally {
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const mandatoryDocs = documents.filter(d => d.requirement_type === 'MANDATORY');
  const conditionalDocs = documents.filter(d => d.requirement_type === 'CONDITIONAL');
  const optionalDocs = documents.filter(d => d.requirement_type === 'OPTIONAL');

  const readyCount = documents.filter(d => d.status === 'READY').length;

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Toast */}
        {toastMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">
                <FileCheck2 className="w-4 h-4" />
                <span>Verification & Counselling Readiness</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Required Document & Certificate Checklist
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Prepare your mandatory and quota-specific certificates before government admission counselling and scholarship verification rounds begin.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-right">
              <span className="text-[10px] text-blue-800 uppercase font-bold block">Checklist Readiness</span>
              <span className="text-xl font-black text-blue-950">{readyCount} of {documents.length}</span>
              <span className="text-[11px] text-blue-700 block">Certificates Ready</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Zero File Upload Friction:</strong> For candidate privacy, physical uploads are not stored. Check off items as you organize physical files and DigiLocker records.
            </span>
          </div>
        </div>

        {/* Document Categories Groups */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-600">Loading Document Requirements Checklist...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Section 1: MANDATORY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Mandatory Documents (Compulsory for All Candidates)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">{mandatoryDocs.length} items</span>
              </div>

              <div className="space-y-3">
                {mandatoryDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onToggle={() => handleToggleStatus(doc)}
                    isEditingNotes={editingNotesId === doc.id}
                    onStartEdit={() => { setEditingNotesId(doc.id); setTempNotes(doc.notes || ''); }}
                    onCancelEdit={() => setEditingNotesId(null)}
                    onSaveNotes={() => handleSaveNotes(doc.id)}
                    tempNotes={tempNotes}
                    setTempNotes={setTempNotes}
                  />
                ))}
              </div>
            </div>

            {/* Section 2: CONDITIONAL */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Conditional Documents (Based on Category, Quota & Scholarships)</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">{conditionalDocs.length} items</span>
              </div>

              <div className="space-y-3">
                {conditionalDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onToggle={() => handleToggleStatus(doc)}
                    isEditingNotes={editingNotesId === doc.id}
                    onStartEdit={() => { setEditingNotesId(doc.id); setTempNotes(doc.notes || ''); }}
                    onCancelEdit={() => setEditingNotesId(null)}
                    onSaveNotes={() => handleSaveNotes(doc.id)}
                    tempNotes={tempNotes}
                    setTempNotes={setTempNotes}
                  />
                ))}
              </div>
            </div>

            {/* Section 3: OPTIONAL */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span>Optional & General Certificates</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">{optionalDocs.length} items</span>
              </div>

              <div className="space-y-3">
                {optionalDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onToggle={() => handleToggleStatus(doc)}
                    isEditingNotes={editingNotesId === doc.id}
                    onStartEdit={() => { setEditingNotesId(doc.id); setTempNotes(doc.notes || ''); }}
                    onCancelEdit={() => setEditingNotesId(null)}
                    onSaveNotes={() => handleSaveNotes(doc.id)}
                    tempNotes={tempNotes}
                    setTempNotes={setTempNotes}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DocCardProps {
  doc: DocumentItem;
  onToggle: () => void;
  isEditingNotes: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveNotes: () => void;
  tempNotes: string;
  setTempNotes: (val: string) => void;
}

const DocumentCard: React.FC<DocCardProps> = ({
  doc,
  onToggle,
  isEditingNotes,
  onStartEdit,
  onCancelEdit,
  onSaveNotes,
  tempNotes,
  setTempNotes
}) => {
  const isReady = doc.status === 'READY';

  return (
    <div className={`p-5 rounded-2xl border shadow-sm bg-white transition flex flex-col justify-between space-y-3 ${
      isReady ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left Checkbox & Title */}
        <div className="flex items-start gap-3.5 flex-1">
          <button
            onClick={onToggle}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
              isReady
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'border-slate-300 hover:border-blue-500 bg-white'
            }`}
            aria-label="Toggle document ready state"
          >
            {isReady && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className={`text-sm font-bold ${isReady ? 'text-slate-900 line-through opacity-80' : 'text-slate-900'}`}>
                {doc.name}
              </h4>
              <StatusBadge status={doc.requirement_type} size="sm" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {doc.description}
            </p>

            {/* Issuing Authority & Tips */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Issuing: {doc.issuing_authority}
              </span>
              <span>Category: {doc.related_category}</span>
            </div>

            {doc.verification_tips && (
              <div className="text-[11px] text-blue-700 bg-blue-50/70 p-2 rounded-lg mt-1.5 border border-blue-100">
                💡 <strong>Verification Tip:</strong> {doc.verification_tips}
              </div>
            )}
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status={doc.status} size="md" />
          <button
            onClick={onToggle}
            className={`text-[11px] font-bold transition px-2.5 py-1 rounded-lg border ${
              isReady
                ? 'text-slate-600 hover:bg-slate-100 border-slate-200'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            {isReady ? 'Mark as Pending' : 'Mark as Ready'}
          </button>
        </div>
      </div>

      {/* User Notes Area */}
      <div className="pt-2 border-t border-slate-100 text-xs">
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Add personal notes (e.g. DigiLocker verified, original with school, applying on 15th)..."
              rows={2}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelEdit}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={onSaveNotes}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" /> Save Note
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {doc.notes ? (
                <span className="text-slate-700 font-medium">📝 <strong>Note:</strong> {doc.notes}</span>
              ) : (
                <span className="text-slate-400 italic">No notes added yet.</span>
              )}
            </span>
            <button
              onClick={onStartEdit}
              className="text-blue-600 font-bold hover:underline ml-2"
            >
              {doc.notes ? 'Edit Note' : '+ Add Note'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
