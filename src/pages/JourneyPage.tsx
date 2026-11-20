import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { NightCard } from '../components/journal/NightCard';
import { EditorialLoadingState } from '../components/feedback/EditorialStates';
import { ManuscriptNotice } from '../components/feedback/ManuscriptNotice';
import { useAuth } from '../contexts/AuthContext';
import { NIGHTS, PHASES } from '../content/journalContent';
import { subscribeNightEntries } from '../lib/firestore';
import { computeNightStatus } from '../utils/journalLogic';
import type { NightEntry, NightSessionStatus } from '../types/journal';

export function JourneyPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState<NightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | NightSessionStatus>('all');

  const phaseFilter = searchParams.get('phase') || 'all';

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = subscribeNightEntries(
      user.uid,
      (items) => {
        setEntries(items);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat data 30 malam dari Firestore.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const entryMap = useMemo(() => {
    const map = new Map<number, NightEntry>();
    for (const item of entries) {
      map.set(item.nightNumber, item);
    }
    return map;
  }, [entries]);

  const visiblePhases = useMemo(() => {
    if (phaseFilter === 'all') return PHASES;
    return PHASES.filter((p) => p.id === phaseFilter);
  }, [phaseFilter]);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2.5">
          <p className="rp-kicker">Perjalanan 30 Malam</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
            Empat Fase Kembali Mendekat
          </h1>
          <p className="text-sm sm:text-base text-[#28313C] max-w-2xl leading-relaxed">
            Seluruh 30 malam dapat dibuka kapan pun tanpa penguncian tanggal. Status pada kartu hanya menandai pengisian catatan journalmu, bukan penilaian iman atau ibadah.
          </p>
        </header>

        <ManuscriptNotice compact />

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {/* Interactive Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#EFE7D8] border border-[#DFD5C2]">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium min-h-[40px] transition-colors whitespace-nowrap ${
                phaseFilter === 'all'
                  ? 'bg-[#FFFDF8] text-[#17253B] shadow-xs'
                  : 'text-[#5C6268] hover:text-[#17253B]'
              }`}
            >
              Semua Fase
            </button>
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSearchParams({ phase: p.id })}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium min-h-[40px] transition-colors whitespace-nowrap ${
                  phaseFilter === p.id
                    ? 'bg-[#FFFDF8] text-[#17253B] shadow-xs'
                    : 'text-[#5C6268] hover:text-[#17253B]'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <label htmlFor="journey-status-filter" className="text-xs font-medium text-[#5C6268] whitespace-nowrap">
              Status sesi:
            </label>
            <select
              id="journey-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | NightSessionStatus)}
              className="rp-input w-auto min-w-[165px] text-xs font-medium"
            >
              <option value="all">Semua status</option>
              <option value="not_started">Belum dimulai</option>
              <option value="draft">Ada draf</option>
              <option value="completed">Sesi selesai</option>
            </select>
          </div>
        </div>

        {loading ? (
          <EditorialLoadingState label="Memuat peta perjalanan 30 malam…" blocks={3} />
        ) : (
          <div className="space-y-12">
            {visiblePhases.map((phase) => {
              const phaseNights = NIGHTS.filter((n) => n.phaseId === phase.id).filter((n) => {
                if (statusFilter === 'all') return true;
                return computeNightStatus(entryMap.get(n.nightNumber)) === statusFilter;
              });

              return (
                <section key={phase.id} aria-labelledby={`phase-${phase.id}`} className="space-y-5">
                  <div className="pb-4 border-b border-[#DFD5C2]">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#7F6334] font-semibold tracking-wider uppercase tabular-nums">
                      <span>{phase.code}</span>
                      <span aria-hidden="true" className="text-[#B99B69]">·</span>
                      <span>
                        Malam {phase.nightRange[0]}–{phase.nightRange[1]}
                      </span>
                    </div>
                    <h2
                      id={`phase-${phase.id}`}
                      className="mt-1.5 font-editorial text-2xl sm:text-3xl font-semibold text-[#17253B]"
                    >
                      {phase.title} — {phase.theme}
                    </h2>
                    <p className="mt-1.5 text-sm text-[#5C6268] max-w-2xl leading-relaxed">
                      {phase.description}
                    </p>
                    {phase.focusPoints && phase.focusPoints.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-7">
                          <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334] mb-1.5">
                            Fokus Fase
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm text-[#28313C] list-disc list-inside">
                            {phase.focusPoints.map((fp) => (
                              <li key={fp}>{fp}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-5 p-3.5 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] text-xs leading-relaxed text-[#4A5057]">
                          <span className="font-semibold text-[#17253B]">Pengingat Fase: </span>
                          {phase.reminder}
                          {phase.phaseNumber >= 2 && (
                            <div className="mt-2 pt-2 border-t border-[#E2DACB]">
                              <Link
                                to={`/app/journey/${phase.nightRange[1]}`}
                                className="font-semibold text-[#7F6334] hover:text-[#17253B] underline underline-offset-4"
                              >
                                {phase.phaseNumber === 2
                                  ? 'Evaluasi fase: My Return Reflection (Malam 14)'
                                  : phase.phaseNumber === 3
                                    ? 'Evaluasi fase: My Night Reflection (Malam 21)'
                                    : 'Evaluasi akhir: My Commitment to Keep Returning (Malam 30)'}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {phaseNights.length === 0 ? (
                    <p className="text-sm text-[#5C6268] py-4">
                      Tidak ada malam dengan filter status ini pada fase {phase.title}.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {phaseNights.map((night) => (
                        <NightCard
                          key={night.nightNumber}
                          night={night}
                          status={computeNightStatus(entryMap.get(night.nightNumber))}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
