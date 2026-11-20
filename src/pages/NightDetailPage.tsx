import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { EditorialLoadingState } from '../components/feedback/EditorialStates';
import { ManuscriptNotice } from '../components/feedback/ManuscriptNotice';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import {
  CONTENT_VERSION,
  getNightContent,
  getPhaseForNight,
} from '../content/journalContent';
import {
  saveNightEntry,
  subscribeNightEntries,
  updateUserProfile,
} from '../lib/firestore';
import {
  computeNightStatus,
  getLocalDraftKey,
  getNightStatusLabel,
} from '../utils/journalLogic';
import type { NightEntry, NightSessionStatus } from '../types/journal';

interface DraftState {
  reflectionAnswers: string[];
  smallActionNotes: string;
  smallActionChecks: boolean[];
  personalDua: string;
  privateNote: string;
  status: NightSessionStatus;
}

function createEmptyDraft(questionCount: number, checkCount: number): DraftState {
  return {
    reflectionAnswers: Array.from({ length: questionCount }, () => ''),
    smallActionNotes: '',
    smallActionChecks: Array.from({ length: checkCount }, () => false),
    personalDua: '',
    privateNote: '',
    status: 'not_started',
  };
}

function readLocalDraft(key: string | null): DraftState | null {
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as DraftState) : null;
  } catch {
    return null;
  }
}

function writeLocalDraft(key: string | null, data: DraftState): void {
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
}

function clearLocalDraft(key: string | null): void {
  if (!key) return;
  try {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

export function NightDetailPage() {
  const { nightId } = useParams<{ nightId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const nightNumber = Number(nightId);
  const content = Number.isInteger(nightNumber) && nightNumber >= 1 && nightNumber <= 30
    ? getNightContent(nightNumber)
    : undefined;
  const phase = content ? getPhaseForNight(content.nightNumber) : undefined;

  const [loadedEntry, setLoadedEntry] = useState<NightEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsyncedLocalBackup, setHasUnsyncedLocalBackup] = useState(false);

  const totalQuestions =
    (content?.reflectionQuestions.length ?? 3) + (content?.phaseEvaluation?.questions.length ?? 0);

  const [draft, setDraft] = useState<DraftState>(() =>
    createEmptyDraft(
      totalQuestions,
      content?.smallActionChecklist?.length ?? 0
    )
  );

  const draftRef = useRef(draft);
  draftRef.current = draft;
  const dirtyRef = useRef(false);
  const initializedNightRef = useRef<number | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveSeqRef = useRef(0);
  const activeNightRef = useRef<number | null>(null);

  const backupKey = user && content ? getLocalDraftKey(user.uid, content.nightNumber) : null;

  // Record lastOpenedNight without marking session completed
  useEffect(() => {
    if (!user || !content) return;
    void updateUserProfile(user.uid, { lastOpenedNight: content.nightNumber }).catch(() => {});
  }, [user, content]);

  // Subscribe to user's nightEntries, hydrate once per night, and flush dirty drafts on unmount/switch
  useEffect(() => {
    if (!user || !content) {
      setLoading(false);
      return;
    }

    const currentNightNumber = content.nightNumber;
    const currentUid = user.uid;
    const currentBackupKey = getLocalDraftKey(currentUid, currentNightNumber);

    activeNightRef.current = currentNightNumber;
    initializedNightRef.current = null;
    dirtyRef.current = false;
    saveSeqRef.current += 1;

    const qCount =
      content.reflectionQuestions.length + (content.phaseEvaluation?.questions.length ?? 0);
    const cCount = content.smallActionChecklist?.length ?? 0;

    setLoadedEntry(null);
    setDraft(createEmptyDraft(qCount, cCount));
    setLoading(true);
    setLoadError(null);
    setSaveStatus('idle');
    setSaveError(null);
    setHasUnsyncedLocalBackup(false);

    const normalizeBackup = (raw: DraftState): DraftState => ({
      ...raw,
      reflectionAnswers: Array.from(
        { length: qCount },
        (_, idx) => raw.reflectionAnswers?.[idx] ?? ''
      ),
      smallActionChecks: Array.from(
        { length: cCount },
        (_, idx) => Boolean(raw.smallActionChecks?.[idx])
      ),
    });

    const unsub = subscribeNightEntries(
      currentUid,
      (entries) => {
        const match = entries.find((e) => e.nightNumber === currentNightNumber) ?? null;
        setLoadedEntry(match);
        setLoadError(null);

        if (initializedNightRef.current !== currentNightNumber) {
          initializedNightRef.current = currentNightNumber;

          const localBackup = readLocalDraft(currentBackupKey);
          if (localBackup) {
            const normalized = normalizeBackup(localBackup);
            setHasUnsyncedLocalBackup(true);
            setDraft(normalized);
            draftRef.current = normalized;
            dirtyRef.current = true;
            setSaveStatus('dirty');
          } else if (match) {
            const answers = Array.from(
              { length: qCount },
              (_, idx) => match.reflectionAnswers?.[idx] ?? ''
            );
            const checks = Array.from(
              { length: cCount },
              (_, idx) => Boolean(match.smallActionChecks?.[idx])
            );
            const hydrated: DraftState = {
              reflectionAnswers: answers,
              smallActionNotes: match.smallActionNotes ?? '',
              smallActionChecks: checks,
              personalDua: match.personalDua ?? '',
              privateNote: match.privateNote ?? '',
              status: match.status,
            };
            setDraft(hydrated);
            draftRef.current = hydrated;
            dirtyRef.current = false;
            setSaveStatus('saved');
          } else {
            const empty = createEmptyDraft(qCount, cCount);
            setDraft(empty);
            draftRef.current = empty;
            dirtyRef.current = false;
            setSaveStatus('idle');
          }
        }
        setLoading(false);
      },
      () => {
        if (initializedNightRef.current !== currentNightNumber) {
          initializedNightRef.current = currentNightNumber;
          const localBackup = readLocalDraft(currentBackupKey);
          if (localBackup) {
            const normalized = normalizeBackup(localBackup);
            setHasUnsyncedLocalBackup(true);
            setDraft(normalized);
            draftRef.current = normalized;
            dirtyRef.current = true;
            setSaveStatus('dirty');
          }
        }
        setLoadError('Gagal memuat catatan malam dari Firestore. Draf lokal tetap diperiksa.');
        setLoading(false);
      }
    );

    return () => {
      unsub();
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (dirtyRef.current) {
        const snapshot = draftRef.current;
        dirtyRef.current = false;
        void saveNightEntry(currentUid, {
          nightNumber: currentNightNumber,
          status: computeNightStatus(snapshot),
          reflectionAnswers: snapshot.reflectionAnswers,
          smallActionNotes: snapshot.smallActionNotes,
          smallActionChecks: snapshot.smallActionChecks,
          personalDua: snapshot.personalDua,
          privateNote: snapshot.privateNote,
          contentVersion: CONTENT_VERSION,
        })
          .then(() => clearLocalDraft(currentBackupKey))
          .catch(() => writeLocalDraft(currentBackupKey, snapshot));
      }
    };
  }, [user, content]);

  const persistToFirestore = useCallback(
    async (targetDraft: DraftState, explicitComplete?: boolean) => {
      if (!user || !content) return;
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      const targetNight = content.nightNumber;
      const seq = ++saveSeqRef.current;
      const nextStatus = computeNightStatus(
        {
          status: targetDraft.status,
          reflectionAnswers: targetDraft.reflectionAnswers,
          smallActionNotes: targetDraft.smallActionNotes,
          smallActionChecks: targetDraft.smallActionChecks,
          personalDua: targetDraft.personalDua,
          privateNote: targetDraft.privateNote,
        },
        explicitComplete
      );

      const updatedSnapshot: DraftState = {
        ...targetDraft,
        status: nextStatus,
      };
      draftRef.current = updatedSnapshot;
      setDraft(updatedSnapshot);
      dirtyRef.current = false;

      setSaveStatus('saving');
      setSaveError(null);

      try {
        await saveNightEntry(user.uid, {
          nightNumber: targetNight,
          status: nextStatus,
          reflectionAnswers: updatedSnapshot.reflectionAnswers,
          smallActionNotes: updatedSnapshot.smallActionNotes,
          smallActionChecks: updatedSnapshot.smallActionChecks,
          personalDua: updatedSnapshot.personalDua,
          privateNote: updatedSnapshot.privateNote,
          contentVersion: CONTENT_VERSION,
        });

        clearLocalDraft(backupKey);
        if (seq === saveSeqRef.current && activeNightRef.current === targetNight) {
          setSaveStatus('saved');
          setHasUnsyncedLocalBackup(false);
        }
      } catch {
        writeLocalDraft(backupKey, updatedSnapshot);
        if (seq === saveSeqRef.current && activeNightRef.current === targetNight) {
          dirtyRef.current = true;
          setHasUnsyncedLocalBackup(true);
          setSaveStatus('error');
          setSaveError('Koneksi terganggu — drafmu diamankan sementara di perangkat ini.');
        }
      }
    },
    [user, content, backupKey]
  );

  const scheduleAutosave = useCallback(
    (nextDraft: DraftState) => {
      dirtyRef.current = true;
      setSaveStatus('dirty');
      writeLocalDraft(backupKey, nextDraft);
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        void persistToFirestore(draftRef.current);
      }, 850);
    },
    [backupKey, persistToFirestore]
  );

  const updateField = (updater: (prev: DraftState) => DraftState) => {
    setDraft((prev) => {
      const next = updater(prev);
      const nextWithDraftStatus: DraftState = {
        ...next,
        status: computeNightStatus(next),
      };
      draftRef.current = nextWithDraftStatus;
      scheduleAutosave(nextWithDraftStatus);
      return nextWithDraftStatus;
    });
  };

  if (!content || !phase) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto rp-card p-8 space-y-4">
          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#17253B]">
            Sesi malam tidak ditemukan
          </h1>
          <p className="text-sm text-[#5C6268] leading-relaxed">
            Pilih malam antara Malam 1 hingga Malam 30 dari peta perjalanan.
          </p>
          <Link to="/app/journey" className="rp-btn-primary">
            Kembali ke Perjalanan 30 Malam
          </Link>
        </div>
      </AppShell>
    );
  }

  const isCompleted = draft.status === 'completed';

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Top Breadcrumb & Live Save Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/app/journey"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5C6268] hover:text-[#17253B] min-h-[44px] pr-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
            <span>Kembali ke Perjalanan 30 Malam</span>
          </Link>

          <SaveStatusBadge
            status={saveStatus}
            errorMessage={saveError}
            onRetry={() => void persistToFirestore(draftRef.current)}
          />
        </div>

        {/* 1. Editorial Folio Header */}
        <header className="pb-8 border-b border-[#DFD5C2]">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#7F6334] font-semibold tracking-wider uppercase tabular-nums">
            <span>
              {phase.code} · {phase.title}
            </span>
            <span aria-hidden="true" className="text-[#B99B69]">·</span>
            <span>Malam {String(content.nightNumber).padStart(2, '0')} dari 30</span>
            <span aria-hidden="true" className="text-[#B99B69]">·</span>
            <span className="normal-case tracking-normal font-medium text-[#28313C]">
              {getNightStatusLabel(draft.status)}
            </span>
          </div>

          <h1 className="mt-3 font-editorial text-3xl sm:text-[2.65rem] font-semibold text-[#17253B] leading-[1.15]">
            {content.title}
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#7F6334]">
            Tema: {content.theme}
          </p>
          <p className="mt-1.5 text-sm sm:text-base text-[#5C6268] max-w-2xl leading-relaxed">
            {phase.theme}
          </p>
        </header>

        <ManuscriptNotice />

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {hasUnsyncedLocalBackup && (
          <div
            role="status"
            className="p-4 rounded-xl bg-[#EFE7D8] border border-[#B99B69] text-xs sm:text-sm text-[#17253B] leading-relaxed"
          >
            Draf lokal sementara dipulihkan agar tulisanmu tidak hilang. Tekan “Simpan” atau lanjutkan mengetik untuk menyinkronkan ke server.
          </div>
        )}

        {/* 2. Opening Reflection — set directly on calm ivory paper */}
        <section
          aria-labelledby="opening-heading"
          className="py-1 sm:py-2 max-w-[65ch] space-y-3"
        >
          <p className="rp-kicker">Opening Reflection</p>
          <h2
            id="opening-heading"
            className="font-editorial text-2xl sm:text-[1.75rem] font-semibold text-[#17253B]"
          >
            Mengawali Malam dengan Tenang
          </h2>
          <p className="text-[1.03125rem] sm:text-[1.0625rem] leading-[1.85] text-[#28313C] whitespace-pre-line">
            {content.openingReflection}
          </p>
        </section>

        {/* 3. Islamic Insight — distinct archival paper card */}
        <section
          aria-labelledby="insight-heading"
          className="rp-card p-6 sm:p-9 space-y-5"
        >
          <div className="space-y-1.5">
            <p className="rp-kicker">Islamic Insight · Renungan Islam</p>
            <h2
              id="insight-heading"
              className="font-editorial text-2xl sm:text-[1.85rem] font-semibold text-[#17253B]"
            >
              Renungan Malam {content.nightNumber}
            </h2>
          </div>

          <p className="max-w-[65ch] text-[0.96875rem] sm:text-[1.03125rem] leading-[1.85] text-[#28313C] whitespace-pre-line">
            {content.islamicInsight}
          </p>

          {/* 4. Archival Source Reference Footnote */}
          <div className="pt-5 border-t border-[#E2DACB] text-xs sm:text-sm text-[#5C6268] space-y-2">
            <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334]">
              Referensi Sumber
            </p>
            {content.referenceUrl ? (
              <a
                href={content.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block underline underline-offset-4 text-[#7F6334] hover:text-[#17253B] leading-relaxed"
              >
                {content.referenceText}
              </a>
            ) : (
              <p className="leading-relaxed text-[#4A5057]">{content.referenceText}</p>
            )}
            <Link
              to="/app/referensi"
              className="inline-block text-xs font-medium underline underline-offset-4 text-[#7F6334] hover:text-[#17253B] py-0.5"
            >
              Lihat tautan sumber asli & catatan audit v1.1
            </Link>
          </div>
        </section>

        {loading && !loadedEntry ? (
          <EditorialLoadingState
            label="Memuat catatan pribadimu untuk malam ini…"
            blocks={2}
          />
        ) : (
          <div className="space-y-9">
            {/* 5. My Heart Journal */}
            <section
              aria-labelledby="heart-journal-heading"
              className="rp-card p-6 sm:p-9 space-y-7"
            >
              <div className="pb-4 border-b border-[#E2DACB]/80 space-y-1.5">
                <p className="rp-kicker">Ruang Tulis Privat</p>
                <h2
                  id="heart-journal-heading"
                  className="font-editorial text-2xl sm:text-[1.85rem] font-semibold text-[#17253B]"
                >
                  My Heart Journal
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                  Jawabanmu tersimpan secara pribadi. Tidak perlu menulis panjang jika malam ini terasa berat.
                </p>
              </div>

              <div className="space-y-7">
                {content.reflectionQuestions.map((question, idx) => {
                  const fieldId = `night-${content.nightNumber}-q-${idx}`;
                  return (
                    <div key={fieldId} className="space-y-2.5">
                      <label
                        htmlFor={fieldId}
                        className="flex items-start gap-2.5 text-sm sm:text-[0.96875rem] font-medium text-[#17253B] leading-relaxed"
                      >
                        <span className="font-editorial text-lg font-semibold text-[#7F6334] tabular-nums leading-6 shrink-0">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span>{question}</span>
                      </label>
                      <textarea
                        id={fieldId}
                        rows={5}
                        maxLength={4000}
                        value={draft.reflectionAnswers[idx] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateField((prev) => {
                            const updated = [...prev.reflectionAnswers];
                            updated[idx] = val;
                            return { ...prev, reflectionAnswers: updated };
                          });
                        }}
                        placeholder="Tuliskan refleksi pribadimu dengan jujur dan tenang…"
                        className="rp-textarea min-h-[136px]"
                      />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. My Small Action */}
            <section
              aria-labelledby="small-action-heading"
              className="rp-card p-6 sm:p-9 space-y-6"
            >
              <div className="space-y-2">
                <p className="rp-kicker">Langkah Realistis</p>
                <h2
                  id="small-action-heading"
                  className="font-editorial text-2xl sm:text-[1.75rem] font-semibold text-[#17253B]"
                >
                  My Small Action
                </h2>
                <p className="text-sm sm:text-[0.96875rem] leading-[1.75] text-[#28313C] max-w-[65ch]">
                  {content.smallActionPrompt}
                </p>
              </div>

              {content.smallActionChecklist && content.smallActionChecklist.length > 0 && (
                <fieldset className="space-y-2.5 pt-1">
                  <legend className="text-xs font-medium text-[#5C6268] mb-2">
                    Daftar persiapan yang bisa kamu centang malam ini:
                  </legend>
                  {content.smallActionChecklist.map((item, idx) => (
                    <label
                      key={item}
                      className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E2DACB] bg-[#FFFDF8] hover:border-[#B99B69] transition-colors cursor-pointer min-h-[48px]"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(draft.smallActionChecks[idx])}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          updateField((prev) => {
                            const updated = [...prev.smallActionChecks];
                            updated[idx] = checked;
                            return { ...prev, smallActionChecks: updated };
                          });
                        }}
                        className="mt-0.5 w-5 h-5 accent-[#17253B] rounded shrink-0"
                      />
                      <span className="text-sm text-[#28313C] leading-relaxed">{item}</span>
                    </label>
                  ))}
                </fieldset>
              )}

              <div>
                <label
                  htmlFor="small-action-notes"
                  className="block text-sm font-medium text-[#17253B] mb-2"
                >
                  Catatan langkah kecil yang ingin kamu usahakan
                </label>
                <textarea
                  id="small-action-notes"
                  rows={4}
                  maxLength={4000}
                  value={draft.smallActionNotes}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((prev) => ({ ...prev, smallActionNotes: val }));
                  }}
                  placeholder="Satu langkah realistis yang mampu kamu lakukan hari ini atau malam ini…"
                  className="rp-textarea"
                />
              </div>
            </section>

            {/* 7. My Personal Dua — intimate personal sanctuary */}
            <section
              aria-labelledby="personal-dua-heading"
              className="rounded-2xl bg-[#FFFDF8] border border-[#D8CEBC] p-6 sm:p-9 space-y-5 shadow-[0_1px_2px_rgba(23,37,59,0.03)]"
            >
              <div className="space-y-1.5">
                <p className="rp-kicker">Munajat Pribadi</p>
                <h2
                  id="personal-dua-heading"
                  className="font-editorial text-2xl sm:text-[1.85rem] font-semibold text-[#17253B]"
                >
                  My Personal Dua
                </h2>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F3EDE1]/60 border border-[#E2DACB] space-y-1.5">
                <p className="text-[11px] tracking-wider uppercase font-semibold text-[#7F6334]">
                  Contoh redaksi doa pribadi
                </p>
                <p className="text-xs sm:text-sm leading-[1.75] text-[#4A5057] italic">
                  {content.personalDuaExample}
                </p>
              </div>

              <div>
                <label
                  htmlFor="personal-dua-input"
                  className="block text-sm font-medium text-[#17253B] mb-2"
                >
                  Doa pribadimu untuk malam ini
                </label>
                <textarea
                  id="personal-dua-input"
                  rows={5}
                  maxLength={5000}
                  value={draft.personalDua}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((prev) => ({ ...prev, personalDua: val }));
                  }}
                  placeholder="Tuliskan doa dengan bahasamu sendiri yang paling jujur…"
                  className="rp-textarea min-h-[140px]"
                />
              </div>
            </section>

            {/* 8. Optional Private Note */}
            <section
              aria-labelledby="private-note-heading"
              className="rounded-2xl bg-[#F3EDE1]/55 border border-[#DFD5C2] p-6 sm:p-8 space-y-3"
            >
              <h2
                id="private-note-heading"
                className="font-editorial text-xl sm:text-2xl font-semibold text-[#17253B]"
              >
                Catatan Pribadi Tambahan (Opsional)
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                {content.reminderNote}
              </p>
              <div>
                <label htmlFor="private-note-input" className="sr-only">
                  Catatan pribadi tambahan
                </label>
                <textarea
                  id="private-note-input"
                  rows={3}
                  maxLength={5000}
                  value={draft.privateNote}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((prev) => ({ ...prev, privateNote: val }));
                  }}
                  placeholder="Ruang bebas untuk mencatat hal lain yang ingin kamu ingat…"
                  className="rp-textarea bg-[#FFFDF8]/80"
                />
              </div>
            </section>

            {/* 8b. Phase Evaluation (Nights 14, 21, 30) */}
            {content.phaseEvaluation && (
              <section
                aria-labelledby="phase-eval-heading"
                className="rp-card p-6 sm:p-9 space-y-6 border-[#B99B69]/70"
              >
                <div className="pb-4 border-b border-[#E2DACB]/80 space-y-1.5">
                  <p className="rp-kicker">Evaluasi Fase</p>
                  <h2
                    id="phase-eval-heading"
                    className="font-editorial text-2xl sm:text-[1.85rem] font-semibold text-[#17253B]"
                  >
                    {content.phaseEvaluation.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                    {content.phaseEvaluation.subtitle}
                  </p>
                </div>

                <div className="space-y-6">
                  {content.phaseEvaluation.questions.map((question, qIdx) => {
                    const answerIdx = content.reflectionQuestions.length + qIdx;
                    const fieldId = `night-${content.nightNumber}-eval-${qIdx}`;
                    return (
                      <div key={fieldId} className="space-y-2">
                        <label
                          htmlFor={fieldId}
                          className="flex items-start gap-2.5 text-sm sm:text-[0.96875rem] font-medium text-[#17253B] leading-relaxed"
                        >
                          <span className="font-editorial text-lg font-semibold text-[#7F6334] tabular-nums leading-6 shrink-0">
                            {String(qIdx + 1).padStart(2, '0')}.
                          </span>
                          <span>{question}</span>
                        </label>
                        <textarea
                          id={fieldId}
                          rows={4}
                          maxLength={4000}
                          value={draft.reflectionAnswers[answerIdx] ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateField((prev) => {
                              const updated = [...prev.reflectionAnswers];
                              while (updated.length <= answerIdx) updated.push('');
                              updated[answerIdx] = val;
                              return { ...prev, reflectionAnswers: updated };
                            });
                          }}
                          placeholder="Tuliskan refleksi evaluasi fase secara jujur dan tenang…"
                          className="rp-textarea min-h-[120px]"
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 9 & 10. Save & Explicit Completion Action */}
            <div className="rp-card p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <SaveStatusBadge
                  status={saveStatus}
                  errorMessage={saveError}
                  onRetry={() => void persistToFirestore(draftRef.current)}
                />
                <p className="text-xs text-[#5C6268] leading-relaxed max-w-md">
                  Menandai sesi selesai hanya mencatat pengisian journal, terpisah dari catatan ibadah malam.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => void persistToFirestore(draftRef.current)}
                  disabled={saveStatus === 'saving'}
                  className="rp-btn-secondary min-h-[48px] w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
                  <span>Simpan</span>
                </button>

                <button
                  type="button"
                  onClick={() => void persistToFirestore(draftRef.current, !isCompleted)}
                  disabled={saveStatus === 'saving'}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[48px] w-full sm:w-auto rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    isCompleted
                      ? 'bg-[#E8EAE3] text-[#17253B] border border-[#A5A99A] hover:bg-[#DDE0D6]'
                      : 'bg-[#17253B] text-[#FFFDF8] hover:bg-[#223451]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {isCompleted ? 'Sesi journal selesai (ubah ke draf)' : 'Tandai sesi journal selesai'}
                  </span>
                </button>
              </div>
            </div>

            {/* 11. Prev / Next Night Navigation */}
            <nav
              aria-label="Navigasi antar malam"
              className="flex items-center justify-between gap-3 pt-5 border-t border-[#DFD5C2]"
            >
              {content.nightNumber > 1 ? (
                <button
                  type="button"
                  onClick={() => navigate(`/app/journey/${content.nightNumber - 1}`)}
                  className="rp-btn-secondary min-h-[48px]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
                  <span>Malam {content.nightNumber - 1}</span>
                </button>
              ) : (
                <div />
              )}

              {content.nightNumber < 30 ? (
                <button
                  type="button"
                  onClick={() => navigate(`/app/journey/${content.nightNumber + 1}`)}
                  className="rp-btn-secondary min-h-[48px]"
                >
                  <span>Malam {content.nightNumber + 1}</span>
                  <ArrowRight className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  to="/app/catatan/refleksi-akhir"
                  className="rp-btn-primary min-h-[48px]"
                >
                  <span>Lanjut ke Refleksi Akhir</span>
                  <ArrowRight className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </AppShell>
  );
}
