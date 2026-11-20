import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Circle, FileEdit } from 'lucide-react';
import type { NightContent, NightSessionStatus } from '../../types/journal';
import { getNightStatusLabel } from '../../utils/journalLogic';

interface NightCardProps {
  night: NightContent;
  status: NightSessionStatus;
}

export function NightCard({ night, status }: NightCardProps) {
  const statusLabel = getNightStatusLabel(status);

  return (
    <Link
      to={`/app/journey/${night.nightNumber}`}
      className="group rp-card p-5 sm:p-6 hover:border-[#B99B69] transition-colors flex flex-col justify-between min-h-[144px]"
    >
      <div>
        <div className="flex items-center justify-between gap-2 text-xs text-[#5C6268] tabular-nums">
          <span className="tracking-wider uppercase font-medium text-[#7F6334]">
            Malam {String(night.nightNumber).padStart(2, '0')}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#28313C]">
            {status === 'completed' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5D6D58]" aria-hidden="true" />
            )}
            {status === 'draft' && (
              <FileEdit className="w-3.5 h-3.5 text-[#7F6334]" aria-hidden="true" />
            )}
            {status === 'not_started' && (
              <Circle className="w-3.5 h-3.5 text-[#A5A99A]" aria-hidden="true" />
            )}
            <span>{statusLabel}</span>
          </span>
        </div>

        <h3 className="mt-2.5 font-editorial text-xl sm:text-[1.35rem] leading-snug font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
          {night.title}
        </h3>
      </div>

      <div className="mt-5 pt-3 border-t border-[#E2DACB]/70 flex items-center justify-between text-xs font-medium text-[#17253B]">
        <span>Buka sesi malam</span>
        <ArrowRight
          className="w-3.5 h-3.5 text-[#B99B69] group-hover:translate-x-0.5 transition-transform"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
