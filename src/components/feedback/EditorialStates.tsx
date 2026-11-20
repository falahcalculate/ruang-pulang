import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EditorialLoadingStateProps {
  label?: string;
  blocks?: number;
}

export function EditorialLoadingState({
  label = 'Menyiapkan halaman catatanmu…',
  blocks = 2,
}: EditorialLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-4"
    >
      <p className="text-xs tracking-wide text-[#5C6268]">{label}</p>
      {Array.from({ length: blocks }).map((_, idx) => (
        <div
          key={idx}
          className="rp-card p-6 sm:p-7 space-y-3 animate-pulse"
          aria-hidden="true"
        >
          <div className="h-3 w-28 rounded bg-[#EFE7D8]" />
          <div className="h-6 w-2/3 rounded bg-[#EFE7D8]" />
          <div className="space-y-2 pt-1">
            <div className="h-3.5 w-full rounded bg-[#F3EDE1]" />
            <div className="h-3.5 w-5/6 rounded bg-[#F3EDE1]" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface EditorialEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EditorialEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EditorialEmptyStateProps) {
  return (
    <div className="rp-card px-6 py-10 sm:py-12 text-center space-y-3">
      {Icon && (
        <div className="mx-auto w-10 h-10 rounded-full border border-[#E2DACB] bg-[#F3EDE1]/60 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
        </div>
      )}
      <h2 className="font-editorial text-2xl font-semibold text-[#17253B]">{title}</h2>
      <p className="text-sm text-[#5C6268] max-w-md mx-auto leading-relaxed">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
