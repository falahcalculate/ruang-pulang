import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Printer, Save, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EditorialLoadingState } from '../components/feedback/EditorialStates';
import { ManuscriptNotice } from '../components/feedback/ManuscriptNotice';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import {
  FINAL_REFLECTION_CONTENT,
  GENTLE_GOODBYE_CONTENT,
  LETTER_TO_FUTURE_SELF_CONTENT,
  SPIRITUAL_BASELINE_CONTENT,
} from '../content/supportingPages';
import { triggerPrintExport } from '../lib/export';
import {
  deleteFinalReflection,
  saveFinalReflection,
  subscribeFinalReflections,
} from '../lib/firestore';

export function FinalReflectionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasBaselineDoc, setHasBaselineDoc] = useState(false);
  const [hasFinalDoc, setHasFinalDoc] = useState(false);

  const [baseStatus, setBaseStatus] = useState<SaveStatus>('idle');
  const [baseError, setBaseError] = useState<string | null>(null);
  const [finalStatus, setFinalStatus] = useState<SaveStatus>('idle');
  const [finalError, setFinalError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<'baseline' | 'final-reflection' | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Baseline fields
  const [relationshipBaseline, setRelationshipBaseline] = useState('');
  const [worshipHabitsBaseline, setWorshipHabitsBaseline] = useState('');
  const [currentCondition, setCurrentCondition] = useState('');
  const [supportNeeded, setSupportNeeded] = useState('');
  const [journeyIntention, setJourneyIntention] = useState('');

  // Final reflection + letter fields
  const [learnedLessons, setLearnedLessons] = useState('');
  const [habitsToMaintain, setHabitsToMaintain] = useState('');
  const [areasStillGrowing, setAreasStillGrowing] = useState('');
  const [finalSupportSource, setFinalSupportSource] = useState('');
  const [finalNextWeekStep, setFinalNextWeekStep] = useState('');
  const [letterToFutureSelf, setLetterToFutureSelf] = useState('');

  const baseRef = useRef({
    relationshipBaseline,
    worshipHabitsBaseline,
    currentCondition,
    supportNeeded,
    journeyIntention,
  });
  baseRef.current = {
    relationshipBaseline,
    worshipHabitsBaseline,
    currentCondition,
    supportNeeded,
    journeyIntention,
  };

  const finalRef = useRef({
    learnedLessons,
    habitsToMaintain,
    areasStillGrowing,
    finalSupportSource,
    finalNextWeekStep,
    letterToFutureSelf,
  });
  finalRef.current = {
    learnedLessons,
    habitsToMaintain,
    areasStillGrowing,
    finalSupportSource,
    finalNextWeekStep,
    letterToFutureSelf,
  };

  const baseDirtyRef = useRef(false);
  const finalDirtyRef = useRef(false);
  const baseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const unsub = subscribeFinalReflections(
      uid,
      (list) => {
        setLoadError(null);
        const base = list.find((item) => item.id === 'baseline');
        const fin = list.find((item) => item.id === 'final-reflection');
        setHasBaselineDoc(Boolean(base));
        setHasFinalDoc(Boolean(fin));

        if (!baseDirtyRef.current) {
          if (base) {
            setRelationshipBaseline(base.relationshipBaseline ?? '');
            setWorshipHabitsBaseline(base.worshipHabitsBaseline ?? '');
            setCurrentCondition(base.currentCondition ?? '');
            setSupportNeeded(base.supportNeeded ?? '');
            setJourneyIntention(base.journeyIntention ?? '');
            setBaseStatus('saved');
          } else {
            setRelationshipBaseline('');
            setWorshipHabitsBaseline('');
            setCurrentCondition('');
            setSupportNeeded('');
            setJourneyIntention('');
            setBaseStatus('idle');
          }
        }

        if (!finalDirtyRef.current) {
          if (fin) {
            setLearnedLessons(fin.learnedLessons ?? '');
            setHabitsToMaintain(fin.habitsToMaintain ?? '');
            setAreasStillGrowing(fin.areasStillGrowing ?? '');
            setFinalSupportSource(fin.supportNeeded ?? '');
            setFinalNextWeekStep(fin.journeyIntention ?? '');
            setLetterToFutureSelf(fin.letterToFutureSelf ?? '');
            setFinalStatus('saved');
          } else {
            setLearnedLessons('');
            setHabitsToMaintain('');
            setAreasStillGrowing('');
            setFinalSupportSource('');
            setFinalNextWeekStep('');
            setLetterToFutureSelf('');
            setFinalStatus('idle');
          }
        }

        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat catatan refleksi akhir dari Firestore.');
        setLoading(false);
      }
    );

    return () => {
      unsub();
      if (baseTimerRef.current) {
        clearTimeout(baseTimerRef.current);
        baseTimerRef.current = null;
      }
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current);
        finalTimerRef.current = null;
      }
      if (baseDirtyRef.current) {
        const b = baseRef.current;
        baseDirtyRef.current = false;
        void saveFinalReflection(uid, 'baseline', {
          entryType: 'baseline',
          relationshipBaseline: b.relationshipBaseline.trim(),
          worshipHabitsBaseline: b.worshipHabitsBaseline.trim(),
          currentCondition: b.currentCondition.trim(),
          supportNeeded: b.supportNeeded.trim(),
          journeyIntention: b.journeyIntention.trim(),
          learnedLessons: '',
          habitsToMaintain: '',
          areasStillGrowing: '',
          letterToFutureSelf: '',
          contentVersion: CONTENT_VERSION,
        }).catch(() => {});
      }
      if (finalDirtyRef.current) {
        const f = finalRef.current;
        finalDirtyRef.current = false;
        void saveFinalReflection(uid, 'final-reflection', {
          entryType: 'final_reflection',
          relationshipBaseline: '',
          worshipHabitsBaseline: '',
          currentCondition: '',
          supportNeeded: f.finalSupportSource.trim(),
          journeyIntention: f.finalNextWeekStep.trim(),
          learnedLessons: f.learnedLessons.trim(),
          habitsToMaintain: f.habitsToMaintain.trim(),
          areasStillGrowing: f.areasStillGrowing.trim(),
          letterToFutureSelf: f.letterToFutureSelf.trim(),
          contentVersion: CONTENT_VERSION,
        }).catch(() => {});
      }
    };
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (typeof window !== 'undefined' && window.location.hash === '#letter-to-future-self') {
      const target = document.getElementById('letter-to-future-self');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [loading]);

  const persistBaseline = useCallback(async () => {
    if (!user) return;
    if (baseTimerRef.current) {
      clearTimeout(baseTimerRef.current);
      baseTimerRef.current = null;
    }
    const b = baseRef.current;
    baseDirtyRef.current = false;
    setBaseStatus('saving');
    setBaseError(null);
    try {
      await saveFinalReflection(user.uid, 'baseline', {
        entryType: 'baseline',
        relationshipBaseline: b.relationshipBaseline.trim(),
        worshipHabitsBaseline: b.worshipHabitsBaseline.trim(),
        currentCondition: b.currentCondition.trim(),
        supportNeeded: b.supportNeeded.trim(),
        journeyIntention: b.journeyIntention.trim(),
        learnedLessons: '',
        habitsToMaintain: '',
        areasStillGrowing: '',
        letterToFutureSelf: '',
        contentVersion: CONTENT_VERSION,
      });
      setBaseStatus('saved');
    } catch {
      baseDirtyRef.current = true;
      setBaseStatus('error');
      setBaseError('Gagal menyimpan Spiritual Baseline.');
    }
  }, [user]);

  const persistFinal = useCallback(async () => {
    if (!user) return;
    if (finalTimerRef.current) {
      clearTimeout(finalTimerRef.current);
      finalTimerRef.current = null;
    }
    const f = finalRef.current;
    finalDirtyRef.current = false;
    setFinalStatus('saving');
    setFinalError(null);
    try {
      await saveFinalReflection(user.uid, 'final-reflection', {
        entryType: 'final_reflection',
        relationshipBaseline: '',
        worshipHabitsBaseline: '',
        currentCondition: '',
        supportNeeded: f.finalSupportSource.trim(),
        journeyIntention: f.finalNextWeekStep.trim(),
        learnedLessons: f.learnedLessons.trim(),
        habitsToMaintain: f.habitsToMaintain.trim(),
        areasStillGrowing: f.areasStillGrowing.trim(),
        letterToFutureSelf: f.letterToFutureSelf.trim(),
        contentVersion: CONTENT_VERSION,
      });
      setFinalStatus('saved');
    } catch {
      finalDirtyRef.current = true;
      setFinalStatus('error');
      setFinalError('Gagal menyimpan refleksi akhir.');
    }
  }, [user]);

  const scheduleBaseAutosave = () => {
    baseDirtyRef.current = true;
    setBaseStatus('dirty');
    setBaseError(null);
    if (baseTimerRef.current) clearTimeout(baseTimerRef.current);
    baseTimerRef.current = setTimeout(() => {
      baseTimerRef.current = null;
      void persistBaseline();
    }, 950);
  };

  const scheduleFinalAutosave = () => {
    finalDirtyRef.current = true;
    setFinalStatus('dirty');
    setFinalError(null);
    if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
    finalTimerRef.current = setTimeout(() => {
      finalTimerRef.current = null;
      void persistFinal();
    }, 950);
  };

  const handleSaveBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    void persistBaseline();
  };

  const handleSaveFinal = (e: React.FormEvent) => {
    e.preventDefault();
    void persistFinal();
  };

  const handleDeleteConfirm = async () => {
    if (!user || !deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget === 'baseline') {
        if (baseTimerRef.current) {
          clearTimeout(baseTimerRef.current);
          baseTimerRef.current = null;
        }
        await deleteFinalReflection(user.uid, 'baseline');
        baseDirtyRef.current = false;
        setRelationshipBaseline('');
        setWorshipHabitsBaseline('');
        setCurrentCondition('');
        setSupportNeeded('');
        setJourneyIntention('');
        setBaseStatus('idle');
      } else {
        if (finalTimerRef.current) {
          clearTimeout(finalTimerRef.current);
          finalTimerRef.current = null;
        }
        await deleteFinalReflection(user.uid, 'final-reflection');
        finalDirtyRef.current = false;
        setLearnedLessons('');
        setHabitsToMaintain('');
        setAreasStillGrowing('');
        setFinalSupportSource('');
        setFinalNextWeekStep('');
        setLetterToFutureSelf('');
        setFinalStatus('idle');
      }
      setDeleteTarget(null);
    } catch {
      if (deleteTarget === 'baseline') {
        setBaseStatus('error');
        setBaseError('Gagal menghapus Spiritual Baseline.');
      } else {
        setFinalStatus('error');
        setFinalError('Gagal menghapus refleksi akhir.');
      }
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="rp-kicker">Meninjau Titik Awal & Akhir Perjalanan</p>
            <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              Refleksi Akhir & Letter to My Future Self
            </h1>
            <p className="mt-2 text-sm text-[#5C6268] max-w-2xl leading-relaxed">
              Bandingkan catatan awalmu dengan refleksi akhir secara privat. Aplikasi tidak memberi skor atau kesimpulan otomatis atas keadaan imanmu.
            </p>
          </div>
          <button
            type="button"
            onClick={triggerPrintExport}
            className="no-print rp-btn-secondary shrink-0 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </header>

        <ManuscriptNotice compact />

        {loadError && (
          <div role="alert" className="no-print rp-alert-error">
            {loadError}
          </div>
        )}

        {loading ? (
          <EditorialLoadingState label="Memuat catatan refleksi…" blocks={2} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: My Spiritual Baseline */}
            <form
              onSubmit={handleSaveBaseline}
              className="print-break-avoid rp-card p-6 sm:p-8 space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#E2DACB]/80">
                <div>
                  <p className="rp-kicker">Titik Awal</p>
                  <h2 className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]">
                    {SPIRITUAL_BASELINE_CONTENT.title}
                  </h2>
                  <p className="mt-1 text-xs text-[#5C6268] leading-relaxed">
                    {SPIRITUAL_BASELINE_CONTENT.subtitle}
                  </p>
                </div>
                <div className="no-print">
                  <SaveStatusBadge
                    status={baseStatus}
                    errorMessage={baseError}
                    onRetry={() => void persistBaseline()}
                  />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4A5057] leading-relaxed">
                {SPIRITUAL_BASELINE_CONTENT.intro}
              </p>

              {[
                {
                  id: 'base-rel',
                  heading: SPIRITUAL_BASELINE_CONTENT.sections[0].heading,
                  label: SPIRITUAL_BASELINE_CONTENT.sections[0].questions.join(' '),
                  value: relationshipBaseline,
                  setter: setRelationshipBaseline,
                },
                {
                  id: 'base-hab',
                  heading: SPIRITUAL_BASELINE_CONTENT.sections[1].heading,
                  label: SPIRITUAL_BASELINE_CONTENT.sections[1].questions.join(' '),
                  value: worshipHabitsBaseline,
                  setter: setWorshipHabitsBaseline,
                },
                {
                  id: 'base-cond',
                  heading: SPIRITUAL_BASELINE_CONTENT.sections[2].heading,
                  label: SPIRITUAL_BASELINE_CONTENT.sections[2].questions[0],
                  value: currentCondition,
                  setter: setCurrentCondition,
                },
                {
                  id: 'base-supp',
                  heading: SPIRITUAL_BASELINE_CONTENT.sections[2].heading,
                  label: SPIRITUAL_BASELINE_CONTENT.sections[2].questions[1],
                  value: supportNeeded,
                  setter: setSupportNeeded,
                },
                {
                  id: 'base-int',
                  heading: SPIRITUAL_BASELINE_CONTENT.sections[3].heading,
                  label: SPIRITUAL_BASELINE_CONTENT.sections[3].questions.join(' '),
                  value: journeyIntention,
                  setter: setJourneyIntention,
                },
              ].map((f) => (
                <div key={f.id}>
                  <p className="text-[10px] tracking-widest uppercase font-semibold text-[#7F6334] mb-0.5">
                    {f.heading}
                  </p>
                  <label htmlFor={f.id} className="block text-xs font-medium text-[#17253B] mb-1.5 leading-relaxed">
                    {f.label}
                  </label>
                  <textarea
                    id={f.id}
                    rows={3}
                    maxLength={4000}
                    value={f.value}
                    onChange={(e) => {
                      f.setter(e.target.value);
                      scheduleBaseAutosave();
                    }}
                    className="rp-textarea text-sm"
                  />
                </div>
              ))}

              <p className="p-3.5 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] text-xs text-[#4A5057] leading-relaxed">
                <strong className="font-semibold text-[#17253B]">Pengingat: </strong>
                {SPIRITUAL_BASELINE_CONTENT.reminder}
              </p>

              <div className="no-print pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={!hasBaselineDoc || baseStatus === 'saving'}
                  onClick={() => setDeleteTarget('baseline')}
                  className="rp-btn-danger-outline w-full sm:w-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Hapus Baseline</span>
                </button>
                <button
                  type="submit"
                  disabled={baseStatus === 'saving'}
                  className="rp-btn-secondary w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
                  <span>{baseStatus === 'saving' ? 'Menyimpan...' : 'Simpan Baseline'}</span>
                </button>
              </div>
            </form>

            {/* Right: Final Reflection & Letter to My Future Self */}
            <form
              onSubmit={handleSaveFinal}
              className="print-break-avoid rp-card p-6 sm:p-8 space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#E2DACB]/80">
                <div>
                  <p className="rp-kicker">{FINAL_REFLECTION_CONTENT.subtitle}</p>
                  <h2 className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]">
                    {FINAL_REFLECTION_CONTENT.title} &amp; {LETTER_TO_FUTURE_SELF_CONTENT.title}
                  </h2>
                </div>
                <div className="no-print">
                  <SaveStatusBadge
                    status={finalStatus}
                    errorMessage={finalError}
                    onRetry={() => void persistFinal()}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fin-lessons" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {FINAL_REFLECTION_CONTENT.prompts.learnedLessons}
                </label>
                <textarea
                  id="fin-lessons"
                  rows={3}
                  maxLength={5000}
                  value={learnedLessons}
                  onChange={(e) => {
                    setLearnedLessons(e.target.value);
                    scheduleFinalAutosave();
                  }}
                  className="rp-textarea text-sm"
                />
              </div>

              <div>
                <label htmlFor="fin-keep" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {FINAL_REFLECTION_CONTENT.prompts.habitsToMaintain}
                </label>
                <textarea
                  id="fin-keep"
                  rows={3}
                  maxLength={5000}
                  value={habitsToMaintain}
                  onChange={(e) => {
                    setHabitsToMaintain(e.target.value);
                    scheduleFinalAutosave();
                  }}
                  className="rp-textarea text-sm"
                />
              </div>

              <div>
                <label htmlFor="fin-grow" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {FINAL_REFLECTION_CONTENT.prompts.areasStillGrowing}
                </label>
                <textarea
                  id="fin-grow"
                  rows={3}
                  maxLength={5000}
                  value={areasStillGrowing}
                  onChange={(e) => {
                    setAreasStillGrowing(e.target.value);
                    scheduleFinalAutosave();
                  }}
                  className="rp-textarea text-sm"
                />
              </div>

              <div>
                <label htmlFor="fin-support" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {FINAL_REFLECTION_CONTENT.prompts.trustedSupport}
                </label>
                <textarea
                  id="fin-support"
                  rows={2}
                  maxLength={4000}
                  value={finalSupportSource}
                  onChange={(e) => {
                    setFinalSupportSource(e.target.value);
                    scheduleFinalAutosave();
                  }}
                  className="rp-textarea text-sm"
                />
              </div>

              <div>
                <label htmlFor="fin-next-step" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {FINAL_REFLECTION_CONTENT.prompts.nextSevenDaysStep}
                </label>
                <textarea
                  id="fin-next-step"
                  rows={2}
                  maxLength={4000}
                  value={finalNextWeekStep}
                  onChange={(e) => {
                    setFinalNextWeekStep(e.target.value);
                    scheduleFinalAutosave();
                  }}
                  className="rp-textarea text-sm"
                />
              </div>

              <div
                id="letter-to-future-self"
                className="pt-2 border-t border-[#E2DACB]/80 space-y-2 scroll-mt-24"
              >
                <p className="text-xs text-[#5C6268] leading-relaxed">
                  {LETTER_TO_FUTURE_SELF_CONTENT.subtitle}
                </p>
                <label htmlFor="fin-letter" className="block text-xs font-medium text-[#17253B]">
                  {LETTER_TO_FUTURE_SELF_CONTENT.title} — <span className="italic text-[#7F6334]">{LETTER_TO_FUTURE_SELF_CONTENT.salutation}</span>
                </label>
                <textarea
                  id="fin-letter"
                  rows={6}
                  maxLength={10000}
                  value={letterToFutureSelf}
                  onChange={(e) => {
                    setLetterToFutureSelf(e.target.value);
                    scheduleFinalAutosave();
                  }}
                  placeholder="Tuliskan pesan pengingat yang hangat untuk dirimu sendiri ketika suatu hari merasa jauh atau lelah…"
                  className="rp-textarea min-h-[160px]"
                />
                <div className="text-xs text-[#5C6268] italic">
                  {LETTER_TO_FUTURE_SELF_CONTENT.closingLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="no-print pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={!hasFinalDoc || finalStatus === 'saving'}
                  onClick={() => setDeleteTarget('final-reflection')}
                  className="rp-btn-danger-outline w-full sm:w-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Hapus Refleksi Akhir</span>
                </button>
                <button
                  type="submit"
                  disabled={finalStatus === 'saving'}
                  className="rp-btn-primary w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
                  <span>{finalStatus === 'saving' ? 'Menyimpan...' : 'Simpan Refleksi & Surat'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* A Gentle Goodbye */}
        <section
          aria-labelledby="goodbye-heading"
          className="print-break-avoid rp-card p-6 sm:p-9 space-y-4"
        >
          <p className="rp-kicker">{GENTLE_GOODBYE_CONTENT.subtitle}</p>
          <h2 id="goodbye-heading" className="font-editorial text-2xl sm:text-3xl font-semibold text-[#17253B]">
            {GENTLE_GOODBYE_CONTENT.title}
          </h2>
          <div className="space-y-3 max-w-[65ch] text-sm sm:text-base leading-[1.85] text-[#28313C]">
            {GENTLE_GOODBYE_CONTENT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="font-editorial text-lg sm:text-xl font-semibold tracking-wide text-[#7F6334] pt-2">
            {GENTLE_GOODBYE_CONTENT.closingCallout}
          </p>
          <div className="text-xs sm:text-sm text-[#5C6268] pt-1">
            {GENTLE_GOODBYE_CONTENT.signOff.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title={
            deleteTarget === 'baseline'
              ? 'Hapus catatan My Spiritual Baseline?'
              : 'Hapus Final Reflection & Surat Masa Depan?'
          }
          description="Isi catatan pada bagian ini akan dihapus dari akunmu. Kamu tetap dapat menulis ulang kapan saja."
          confirmLabel="Hapus Catatan"
          destructive
          busy={deleting}
          onConfirm={() => void handleDeleteConfirm()}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AppShell>
  );
}
