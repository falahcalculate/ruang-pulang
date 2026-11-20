import React from 'react';
import { AlertCircle, Check, Clock, RefreshCw } from 'lucide-react';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface SaveStatusBadgeProps {
  status: SaveStatus;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export function SaveStatusBadge({ status, errorMessage, onRetry }: SaveStatusBadgeProps) {
  if (status === 'idle') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#5C6268]">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Siap mencatat</span>
      </span>
    );
  }
  if (status === 'dirty') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7F6334]">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Belum tersimpan</span>
      </span>
    );
  }
  if (status === 'saving') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#17253B]">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B99B69]" aria-hidden="true" />
        <span>Menyimpan…</span>
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#4C5C47] font-medium">
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Tersimpan</span>
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A3528]">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{errorMessage || 'Gagal menyimpan ke server — draf lokal tetap aman.'}</span>
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="underline font-semibold hover:text-[#17253B] px-1.5 py-1 min-h-[32px]"
        >
          Coba simpan lagi
        </button>
      )}
    </div>
  );
}
