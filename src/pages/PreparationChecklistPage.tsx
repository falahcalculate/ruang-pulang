import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { EditorialLoadingState } from '../components/feedback/EditorialStates';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import {
  NIGHT_PREP_CHECKLIST_INTRO,
  NIGHT_PREP_CHECKLIST_ITEMS,
} from '../content/supportingPages';
import { saveChecklistState, subscribeChecklistState } from '../lib/firestore';

export function PreparationChecklistPage() {
  const { user } = useAuth();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [personalNote, setPersonalNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const stateRef = useRef({ checkedIds, personalNote });
  stateRef.current = { checkedIds, personalNote };
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const unsub = subscribeChecklistState(
      uid,
      (state) => {
        setLoadError(null);
        if (!dirtyRef.current) {
          if (state) {
            setCheckedIds(state.checkedIds ?? []);
            setPersonalNote(state.personalNote ?? '');
            stateRef.current = {
              checkedIds: state.checkedIds ?? [],
              personalNote: state.personalNote ?? '',
            };
            setSaveStatus('saved');
          } else {
            setSaveStatus('idle');
          }
        }
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat checklist persiapan malam dari Firestore.');
        setLoading(false);
      }
    );
    return () => {
      unsub();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (dirtyRef.current) {
        const snap = stateRef.current;
        dirtyRef.current = false;
        void saveChecklistState(uid, snap.checkedIds, snap.personalNote.trim()).catch(() => {});
      }
    };
  }, [user]);

  const performSave = useCallback(
    async (nextIds = stateRef.current.checkedIds, nextNote = stateRef.current.personalNote, msg?: string) => {
      if (!user) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      dirtyRef.current = false;
      setSaveStatus('saving');
      setSaveError(null);
      setFeedback(null);
      try {
        await saveChecklistState(user.uid, nextIds, nextNote.trim());
        setSaveStatus('saved');
        if (msg) setFeedback(msg);
      } catch {
        dirtyRef.current = true;
        setSaveStatus('error');
        setSaveError('Gagal menyimpan checklist. Silakan coba kembali.');
      }
    },
    [user]
  );

  const scheduleAutosave = useCallback(
    (nextIds: string[], nextNote: string) => {
      dirtyRef.current = true;
      stateRef.current = { checkedIds: nextIds, personalNote: nextNote };
      setSaveStatus('dirty');
      setSaveError(null);
      setFeedback(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void performSave(stateRef.current.checkedIds, stateRef.current.personalNote);
      }, 750);
    },
    [performSave]
  );

  const toggleItem = (id: string) => {
    const nextIds = checkedIds.includes(id)
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];
    setCheckedIds(nextIds);
    scheduleAutosave(nextIds, personalNote);
  };

  const handleReset = async () => {
    if (!user) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const previousState = stateRef.current;
    dirtyRef.current = false;
    stateRef.current = { checkedIds: [], personalNote: previousState.personalNote };
    setCheckedIds([]);
    setSaveStatus('saving');
    setSaveError(null);
    setFeedback(null);
    try {
      await saveChecklistState(user.uid, [], previousState.personalNote.trim());
      setSaveStatus('saved');
      setFeedback('Checklist direset untuk persiapan malam berikutnya.');
    } catch {
      stateRef.current = previousState;
      setCheckedIds(previousState.checkedIds);
      dirtyRef.current = true;
      setSaveStatus('error');
      setSaveError('Gagal mereset checklist. Silakan coba lagi.');
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="rp-kicker">Persiapan Sebelum Tidur</p>
            <SaveStatusBadge
              status={saveStatus}
              errorMessage={saveError}
              onRetry={() => void performSave()}
            />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
            {NIGHT_PREP_CHECKLIST_INTRO.title}
          </h1>
          <p className="text-sm sm:text-base text-[#28313C] leading-relaxed max-w-2xl">
            {NIGHT_PREP_CHECKLIST_INTRO.subtitle}
          </p>
        </header>

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {feedback && (
          <div role="status" className="rp-alert-sage">
            {feedback}
          </div>
        )}

        {loading ? (
          <EditorialLoadingState label="Memuat checklist persiapan malam…" blocks={1} />
        ) : (
          <div className="rp-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C6268] tabular-nums pb-3 border-b border-[#E2DACB]/80">
              <span className="font-medium">
                {checkedIds.length} dari {NIGHT_PREP_CHECKLIST_ITEMS.length} poin dicentang
              </span>
              <button
                type="button"
                disabled={saveStatus === 'saving'}
                onClick={() => void handleReset()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F6334] hover:text-[#17253B] min-h-[44px] px-2"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset centang untuk malam baru</span>
              </button>
            </div>

            <fieldset className="space-y-3">
              <legend className="sr-only">Daftar persiapan malam</legend>
              {NIGHT_PREP_CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#E2DACB] bg-[#FFFDF8] hover:border-[#B99B69] transition-colors cursor-pointer min-h-[48px]"
                >
                  <input
                    type="checkbox"
                    checked={checkedIds.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 w-5 h-5 accent-[#17253B] rounded shrink-0"
                  />
                  <div>
                    <span className="block text-sm font-medium text-[#17253B]">{item.label}</span>
                    <span className="block mt-1 text-xs text-[#5C6268] leading-relaxed">
                      {item.helper}
                    </span>
                  </div>
                </label>
              ))}
            </fieldset>

            <div>
              <label
                htmlFor="prep-note"
                className="block text-xs font-medium text-[#17253B] mb-2"
              >
                {NIGHT_PREP_CHECKLIST_INTRO.noteHeading}
              </label>
              <textarea
                id="prep-note"
                rows={3}
                maxLength={3000}
                value={personalNote}
                onChange={(e) => {
                  const val = e.target.value;
                  setPersonalNote(val);
                  scheduleAutosave(checkedIds, val);
                }}
                placeholder="Misalnya: jam tidur target malam ini atau rencana cadangan bila kelelahan…"
                className="rp-textarea"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <SaveStatusBadge
                status={saveStatus}
                errorMessage={saveError}
                onRetry={() => void performSave()}
              />
              <button
                type="button"
                disabled={saveStatus === 'saving'}
                onClick={() =>
                  void performSave(
                    stateRef.current.checkedIds,
                    stateRef.current.personalNote,
                    'Checklist persiapan malam berhasil disimpan.'
                  )
                }
                className="rp-btn-primary w-full sm:w-auto"
              >
                <Save className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
                <span>{saveStatus === 'saving' ? 'Menyimpan...' : 'Simpan Checklist'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
