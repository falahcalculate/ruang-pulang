import React from 'react';
import { BookMarked } from 'lucide-react';

import { MANUSCRIPT_STATUS_INFO } from '../../content/journalContent';

interface ManuscriptNoticeProps {
  compact?: boolean;
  title?: string;
  message?: string;
}

export function ManuscriptNotice({
  compact = false,
  title = MANUSCRIPT_STATUS_INFO.versionLabel,
  message = MANUSCRIPT_STATUS_INFO.statusDokumen,
}: ManuscriptNoticeProps) {
  return (
    <aside
      aria-label="Informasi status naskah"
      className={`rounded-xl border border-[#DFD5C2] bg-[#EFE7D8]/65 ${
        compact ? 'px-4 py-3' : 'px-5 py-4'
      } text-[#28313C]`}
    >
      <div className="flex items-start gap-3">
        <BookMarked className="w-4 h-4 text-[#7F6334] mt-0.5 shrink-0" aria-hidden="true" />
        <div className="space-y-1 text-sm leading-relaxed">
          <p className="font-semibold text-[#17253B] text-xs sm:text-sm">{title}</p>
          <p className="text-xs sm:text-sm font-medium text-[#28313C]">
            {MANUSCRIPT_STATUS_INFO.publicStatusNotice}
          </p>
          {!compact && <p className="text-xs sm:text-sm text-[#4A5057]">{message}</p>}
        </div>
      </div>
    </aside>
  );
}
