import React from 'react';
import { ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

interface OfficialSourceBadgeProps {
  authority: string;
  url?: string;
  verifiedDate?: string;
  status?: string;
  className?: string;
}

export const OfficialSourceBadge: React.FC<OfficialSourceBadgeProps> = ({
  authority,
  url,
  verifiedDate = "01-Sep-2026",
  status = "VERIFIED",
  className = ""
}) => {
  const isVerified = status.toUpperCase() === "VERIFIED";

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs ${className}`}>
      <div className="flex items-center gap-2">
        {isVerified ? (
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="uppercase tracking-wider text-[10px] bg-emerald-100/80 px-1.5 py-0.5 rounded font-bold">Verified</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="uppercase tracking-wider text-[10px] bg-amber-100 px-1.5 py-0.5 rounded font-bold">Check Required</span>
          </span>
        )}
        <span className="text-slate-700 font-medium truncate max-w-[280px]">
          Source: <strong className="text-slate-900">{authority}</strong>
        </span>
      </div>

      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
        <span>Verified: {verifiedDate}</span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold hover:underline"
          >
            Official Portal <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
