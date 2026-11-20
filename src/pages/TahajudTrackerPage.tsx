import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import { TAHAJUD_ACTIVITY_OPTIONS, TAHAJUD_TRACKER_INTRO } from '../content/supportingPages';
import { deleteTahajudLog, saveTahajudLog, subscribeTahajudLogs } from '../lib/firestore';
import { computeTrackerSummary } from '../utils/journalLogic';
import type { TahajudLog, WakeStatus } from '../types/journal';

const WAKE_STATUS_OPTIONS: Array<{ value: WakeStatus; label: string }> = [
  { value: 'belum_dicatat', label: 'Belum dicatat' },
  { value: 'terbangun', label: 'Terbangun' },
  { value: 'tidak_terbangun', label: 'Tidak terbangun' },
  { value: 'tidak_ingin_mencatat', label: 'Tidak ingin mencatat' },
];

export function TahajudTrackerPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<TahajudLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedNight, setSelectedNight] = useState<number>(1);
  const [date, setDate] = useState('');
  const [wakeStatus, setWakeStatus] = useState<WakeStatus>('belum_dicatat');
  const [activities, setActivities] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDirtyRef = useRef(false);
  const hydratedNightRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeTahajudLogs(
      user.uid,
      (items) => {
        setLogs(items);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat catatan tracker dari Firestore.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const logByNight = useMemo(() => {
    const map = new Map<number, TahajudLog>();
    for (const item of logs) {
      map.set(item.nightIndex, item);
    }
    return map;
  }, [logs]);

  // Reset form when switching selectedNight, or hydrate on initial load if not dirty
  useEffect(() => {
    const switchingNight = hydratedNightRef.current !== selectedNight;
    if (!switchingNight && isDirtyRef.current) {
      return;
    }

    hydratedNightRef.current = selectedNight;
    isDirtyRef.current = false;

    const existing = logByNight.get(selectedNight);
    if (existing) {
      setDate(existing.date ?? '');
      setWakeStatus(existing.wakeStatus ?? 'belum_dicatat');
      setActivities(existing.activities ?? []);
      setNote(existing.note ?? '');
      if (switchingNight) {
        setSaveStatus('saved');
      }
    } else {
      setDate('');
      setWakeStatus('belum_dicatat');
      setActivities([]);
      setNote('');
      if (switchingNight) {
        setSaveStatus('idle');
      }
    }

    if (switchingNight) {
      setFeedback(null);
      setSaveError(null);
    }
  }, [selectedNight, logByNight]);

  const summary = useMemo(() => computeTrackerSummary(logs), [logs]);

  const markDirty = () => {
    isDirtyRef.current = true;
    setSaveStatus('dirty');
    setSaveError(null);
    setFeedback(null);
  };

  const toggleActivity = (id: string) => {
    markDirty();
    setActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const performSave = useCallback(async () => {
    if (!user) return;
    setSaveStatus('saving');
    setSaveError(null);
    setFeedback(null);
    try {
      await saveTahajudLog(user.uid, {
        nightIndex: selectedNight,
        date: date.trim(),
        wakeStatus,
        activities,
        note: note.trim(),
        contentVersion: CONTENT_VERSION,
      });
      isDirtyRef.current = false;
      setSaveStatus('saved');
      setFeedback(`Catatan Malam ${selectedNight} berhasil disimpan.`);
    } catch {
      setSaveStatus('error');
      setSaveError('Gagal menyimpan catatan tracker. Silakan coba lagi.');
    }
  }, [user, selectedNight, date, wakeStatus, activities, note]);

  const handleSaveNight = (e: React.FormEvent) => {
    e.preventDefault();
    void performSave();
  };

  const handleDeleteNight = async () => {
    if (!user) return;
    setDeleting(true);
    setSaveError(null);
    setFeedback(null);
    try {
      await deleteTahajudLog(user.uid, selectedNight);
      isDirtyRef.current = false;
      setDate('');
      setWakeStatus('belum_dicatat');
      setActivities([]);
      setNote('');
      setSaveStatus('idle');
      setConfirmDeleteOpen(false);
      setFeedback(`Catatan Malam ${selectedNight} telah dihapus.`);
    } catch {
      setSaveStatus('error');
      setSaveError('Gagal menghapus catatan malam.');
      setConfirmDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const wakeLabel = (status: WakeStatus) =>
    WAKE_STATUS_OPTIONS.find((w) => w.value === status)?.label ?? 'Belum dicatat';

  const currentLogExists = logByNight.has(selectedNight);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2.5">
          <p className="rp-kicker">Pencatatan Kebiasaan Netral</p>
          <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
            {TAHAJUD_TRACKER_INTRO.title}
          </h1>
          <p className="text-sm sm:text-base text-[#28313C] max-w-2xl leading-relaxed">
            {TAHAJUD_TRACKER_INTRO.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#5C6268] max-w-2xl leading-relaxed">
            {TAHAJUD_TRACKER_INTRO.helper}
          </p>
        </header>

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {/* Neutral Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rp-card p-5 sm:p-6">
            <p className="text-xs font-medium text-[#5C6268]">Malam tercatat</p>
            <p className="mt-1.5 font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
              {summary.recordedNights} / 30
            </p>
          </div>
          <div className="rp-card p-5 sm:p-6">
            <p className="text-xs font-medium text-[#5C6268]">Aktivitas yang dicatat</p>
            <p className="mt-1.5 font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
              {summary.recordedActivitiesCount}
            </p>
          </div>
          <div className="rp-card p-5 sm:p-6">
            <p className="text-xs font-medium text-[#5C6268]">Catatan bangun malam</p>
            <p className="mt-1.5 font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
              {summary.awakeLoggedCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 30-Night Selector Grid */}
          <section
            aria-labelledby="tracker-grid-heading"
            className="lg:col-span-7 rp-card p-5 sm:p-7 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 id="tracker-grid-heading" className="font-editorial text-2xl font-semibold text-[#17253B]">
                Pilih Malam (1–30)
              </h2>
              {loading && <span className="text-xs text-[#5C6268]">Memuat…</span>}
            </div>

            {logs.length === 0 && !loading && (
              <p className="text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                Belum ada aktivitas yang dicatat. Tidak apa-apa; kamu bisa mengisinya ketika siap.
              </p>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((night) => {
                const log = logByNight.get(night);
                const isSelected = selectedNight === night;
                const statusText = log ? wakeLabel(log.wakeStatus) : 'Belum dicatat';
                const hasData =
                  log &&
                  (log.wakeStatus !== 'belum_dicatat' ||
                    log.activities.length > 0 ||
                    log.note.trim().length > 0);

                return (
                  <button
                    key={night}
                    type="button"
                    onClick={() => setSelectedNight(night)}
                    aria-pressed={isSelected}
                    className={`p-3 rounded-xl border text-left transition-colors min-h-[64px] flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#17253B] text-[#FFFDF8] border-[#17253B]'
                        : hasData
                          ? 'bg-[#EFE7D8]/75 text-[#17253B] border-[#B99B69]/70 hover:border-[#B99B69]'
                          : 'bg-[#FFFDF8] text-[#28313C] border-[#E2DACB] hover:border-[#B99B69]'
                    }`}
                  >
                    <span className="text-xs font-semibold tabular-nums">
                      Malam {night}
                    </span>
                    <span
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-[#F3EDE1]/90' : 'text-[#5C6268]'
                      }`}
                    >
                      {statusText}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Night Editor Form */}
          <form
            onSubmit={handleSaveNight}
            className="lg:col-span-5 rp-card p-5 sm:p-7 space-y-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#E2DACB]/80">
              <div>
                <p className="text-xs text-[#7F6334] font-semibold tabular-nums">
                  Malam {selectedNight} dari 30
                </p>
                <h2 className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]">
                  Catat Kebiasaan Malam
                </h2>
              </div>
              <SaveStatusBadge
                status={saveStatus}
                errorMessage={saveError}
                onRetry={() => void performSave()}
              />
            </div>

            {feedback && (
              <div role="status" className="rp-alert-sage">
                {feedback}
              </div>
            )}

            <div>
              <label htmlFor="tracker-date" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Tanggal (opsional)
              </label>
              <input
                id="tracker-date"
                type="date"
                value={date}
                onChange={(e) => {
                  markDirty();
                  setDate(e.target.value);
                }}
                className="rp-input"
              />
            </div>

            <div>
              <label htmlFor="tracker-wake" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Status bangun malam
              </label>
              <select
                id="tracker-wake"
                value={wakeStatus}
                onChange={(e) => {
                  markDirty();
                  setWakeStatus(e.target.value as WakeStatus);
                }}
                className="rp-input"
              >
                {WAKE_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="space-y-2.5">
              <legend className="text-xs font-medium text-[#17253B] mb-1">
                Aktivitas yang dilakukan (bila ada)
              </legend>
              {TAHAJUD_ACTIVITY_OPTIONS.map((act) => (
                <label
                  key={act.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#E2DACB] bg-[#FFFDF8] hover:border-[#B99B69] transition-colors cursor-pointer min-h-[46px]"
                >
                  <input
                    type="checkbox"
                    checked={activities.includes(act.id)}
                    onChange={() => toggleActivity(act.id)}
                    className="w-4 h-4 accent-[#17253B] rounded shrink-0"
                  />
                  <span className="text-sm text-[#28313C]">{act.label}</span>
                </label>
              ))}
            </fieldset>

            <div>
              <label htmlFor="tracker-note" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Catatan singkat (opsional)
              </label>
              <textarea
                id="tracker-note"
                rows={3}
                maxLength={2000}
                value={note}
                onChange={(e) => {
                  markDirty();
                  setNote(e.target.value);
                }}
                placeholder="Misalnya: tubuh sangat lelah hari ini, atau sempat berdoa sebelum Subuh…"
                className="rp-textarea text-sm"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={saveStatus === 'saving' || !currentLogExists}
                onClick={() => setConfirmDeleteOpen(true)}
                className="rp-btn-danger-outline w-full sm:w-auto"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hapus Catatan</span>
              </button>
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="rp-btn-primary w-full sm:w-auto"
              >
                {saveStatus === 'saving' ? 'Menyimpan...' : 'Simpan Catatan Malam'}
              </button>
            </div>
          </form>
        </div>

        <ConfirmDialog
          open={confirmDeleteOpen}
          title={`Hapus catatan tracker Malam ${selectedNight}?`}
          description="Catatan kebiasaan malam untuk malam ini akan dihapus dari riwayat tracker pribadimu."
          confirmLabel="Hapus Catatan"
          destructive
          busy={deleting}
          onConfirm={() => void handleDeleteNight()}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      </div>
    </AppShell>
  );
}
