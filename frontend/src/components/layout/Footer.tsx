import React from 'react';
import { Shield, Phone, Mail, Globe, ExternalLink, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A2540] text-slate-300 text-xs border-t-4 border-amber-500">
      {/* Top Helpline Bar */}
      <div className="bg-[#07192C] py-4 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-white text-sm">National Examination Student Support & Helpline</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Toll-Free: <strong className="text-white">1800-425-2026</strong> (09:00 AM - 06:00 PM IST)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              Email: <strong className="text-white">support.govresult@nic.in</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GovResult<span className="text-blue-400">+</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Next-Generation Government Examination Result & Personalized Education Pathway Assistant. Connecting marks with verified admissions, scholarships, revaluation, and document readiness.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Grounded in Official Authority Records</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Student Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/results" className="hover:text-white transition">Online Marksheet & Search</Link></li>
              <li><Link to="/opportunities" className="hover:text-white transition">Verified Higher Education & Scholarships</Link></li>
              <li><Link to="/revaluation" className="hover:text-white transition">Revaluation & Answer Script Copy</Link></li>
              <li><Link to="/revaluation" className="hover:text-white transition">Supplementary Exam Registration</Link></li>
              <li><Link to="/deadlines" className="hover:text-white transition">Time-Critical Deadline Alerts</Link></li>
              <li><Link to="/documents" className="hover:text-white transition">Admission Document Checklist</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Verified Official Portals</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="https://dge.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">Directorate of Govt Examinations <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">National Scholarship Portal (NSP) <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://counselling.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">Centralised Seat Allocation Portal <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://skillmission.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">DOTE Technical & Polytechnic Mission <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">DigiLocker Digital Marksheets <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Col 4: Anti-Hallucination & Disclaimer */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Integrity & Notice</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              GovResult+ enforces strict verification principles: All dates, fees, quotas, and eligibility conditions are synced with official gazettes and board announcements. AI counseling operates in an advisory capacity.
            </p>
            <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700 text-[11px] text-slate-300">
              Demonstration Prototype (MOCK DATA) for educational assessment and next-step intelligence showcase.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 GovResult+ — Designed for National Academic Empowerment. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
            <a href="#accessibility" className="hover:text-slate-400">Accessibility Statement</a>
            <a href="#security" className="hover:text-slate-400">Data Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
