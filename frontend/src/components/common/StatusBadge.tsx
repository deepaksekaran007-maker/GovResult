import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const s = (status || '').toUpperCase();
  
  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';

  if (['ELIGIBLE', 'PASS', 'AVAILABLE', 'READY', 'COMPLETED', 'VERIFIED', 'OPEN'].includes(s)) {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dot = 'bg-emerald-500';
  } else if (['CHECK_REQUIRED', 'CHECK REQUIRED', 'UNDER_REVIEW', 'CLOSING_SOON', 'CLOSING SOON', 'RECOMMENDED', 'PENDING', 'OPTIONAL'].includes(s)) {
    bg = 'bg-amber-50 text-amber-800 border-amber-200';
    dot = 'bg-amber-500';
  } else if (['NOT_ELIGIBLE', 'NOT ELIGIBLE', 'FAIL', 'COMPARTMENT', 'CLOSED', 'URGENT', 'WITHHELD'].includes(s)) {
    bg = 'bg-red-50 text-red-700 border-red-200';
    dot = 'bg-red-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses[size]} ${bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {s.replace('_', ' ')}
    </span>
  );
};
