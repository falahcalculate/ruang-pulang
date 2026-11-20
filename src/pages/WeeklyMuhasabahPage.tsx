import React, { useCallback, useEffect, useState } from 'react';
import { CalendarHeart, Pencil, Plus, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EditorialEmptyState, EditorialLoadingState } from '../components/feedback/EditorialStates';
import { ManuscriptNotice } from '../components/feedback/ManuscriptNotice';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import { WEEKLY_MUHASABAH_CONTENT } from '../content/supportingPages';
import {
  deleteWeeklyMuhasabah,
  saveWeeklyMuhasabah,
  subscribeWeeklyMuhasabah,
} from '../lib/firestore';
import { getTodayIsoDate } from '../utils/journalLogic';
import type { WeeklyMuhasabah } from '../types/journal';

export function WeeklyMuhasabahPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<WeeklyMuhasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [weekLabel, setWeekLabel] = useState('Minggu 1');
  const [date, setDate] = useState(getTodayIsoDate());
  const [gratitudeThisWeek, setGratitudeThisWeek] = useState('');
  const [habitsToKeep, setHabitsToKeep] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [realisticSteps, setRealisticSteps] = useState('');
  const [personalDua, setPersonalDua] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WeeklyMuhasabah | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeWeeklyMuhasabah(
      user.uid,
      (list) => {
        setItems(list);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat catatan muhasabah mingguan dari server. Silakan muat ulang.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setWeekLabel(`Minggu ${items.length + 1}`);
    setDate(getTodayIsoDate());
    setGratitudeThisWeek('');
    setHabitsToKeep('');
    setAreasToImprove('');
    setRealisticSteps('');
    setPersonalDua('');
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(false);
  };

  const openEdit = (entry: WeeklyMuhasabah) => {
    setEditingId(entry.id);
    setWeekLabel(entry.weekLabel);
    setDate(entry.date);
    setGratitudeThisWeek(entry.gratitudeThisWeek);
    setHabitsToKeep(entry.habitsToKeep);
    setAreasToImprove(entry.areasToImprove);
    setRealisticSteps(entry.realisticSteps);
    setPersonalDua(entry.personalDua);
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(true);
  };

  const performSave = useCallback(async () => {
    if (!user) return;
    if (!weekLabel.trim()) {
      setErrorMsg('Mohon beri penanda minggu, misalnya "Minggu 1".');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await saveWeeklyMuhasabah(user.uid, {
        id: editingId ?? undefined,
        weekLabel: weekLabel.trim(),
        date: date || getTodayIsoDate(),
        gratitudeThisWeek: gratitudeThisWeek.trim(),
        habitsToKeep: habitsToKeep.trim(),
        areasToImprove: areasToImprove.trim(),
        realisticSteps: realisticSteps.trim(),
        personalDua: personalDua.trim(),
        contentVersion: CONTENT_VERSION,
      });
      setStatusMsg('Refleksi mingguan berhasil disimpan.');
      resetForm();
      setSaveStatus('saved');
    } catch {
      const msg = 'Gagal menyimpan refleksi mingguan. Silakan coba kembali.';
      setErrorMsg(msg);
      setSaveStatus('error');
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, [
    user,
    editingId,
    weekLabel,
    date,
    gratitudeThisWeek,
    habitsToKeep,
    areasToImprove,
    realisticSteps,
    personalDua,
    items.length,
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    void performSave();
  };

  const handleDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteWeeklyMuhasabah(user.uid, deleteTarget.id);
      setStatusMsg('Catatan muhasabah mingguan telah dihapus.');
      setDeleteTarget(null);
    } catch {
      setStatusMsg('Gagal menghapus catatan.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="rp-kicker">Refleksi Berkala yang Membangun</p>
            <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              {WEEKLY_MUHASABAH_CONTENT.title}
            </h1>
            <p className="mt-2 text-sm text-[#5C6268] max-w-2xl leading-relaxed">
              {WEEKLY_MUHASABAH_CONTENT.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <SaveStatusBadge
              status={saveStatus}
              errorMessage={saveError}
              onRetry={() => void performSave()}
            />
            <button
              type="button"
              onClick={() => {
                if (showForm) resetForm();
                else {
                  setWeekLabel(`Minggu ${items.length + 1}`);
                  setShowForm(true);
                }
              }}
              className="rp-btn-primary"
            >
              <Plus className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
              <span>{showForm ? 'Tutup Form' : 'Tulis Muhasabah'}</span>
            </button>
          </div>
        </header>

        <ManuscriptNotice compact />

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {statusMsg && (
          <div role="status" className="rp-alert-sage">
            {statusMsg}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="rp-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2DACB]/80">
              <h2 className="font-editorial text-2xl font-semibold text-[#17253B]">
                {editingId ? 'Edit Weekly Muhasabah' : 'Refleksi Mingguan Baru'}
              </h2>
              <SaveStatusBadge
                status={saveStatus}
                errorMessage={saveError}
                onRetry={() => void performSave()}
              />
            </div>
            {errorMsg && (
              <p role="alert" className="text-xs sm:text-sm text-[#7A3528] font-medium">
                {errorMsg}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="muh-label" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Penanda minggu
                </label>
                <input
                  id="muh-label"
                  type="text"
                  required
                  maxLength={120}
                  value={weekLabel}
                  onChange={(e) => {
                    setWeekLabel(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  className="rp-input"
                />
              </div>
              <div>
                <label htmlFor="muh-date" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Tanggal
                </label>
                <input
                  id="muh-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  className="rp-input"
                />
              </div>
            </div>

            {[
              {
                id: 'muh-keep',
                heading: WEEKLY_MUHASABAH_CONTENT.prompts[0].heading,
                label: WEEKLY_MUHASABAH_CONTENT.prompts[0].question,
                value: habitsToKeep,
                setter: setHabitsToKeep,
              },
              {
                id: 'muh-improve',
                heading: WEEKLY_MUHASABAH_CONTENT.prompts[1].heading,
                label: `${WEEKLY_MUHASABAH_CONTENT.prompts[1].question} (${WEEKLY_MUHASABAH_CONTENT.prompts[2].heading}: ${WEEKLY_MUHASABAH_CONTENT.prompts[2].question})`,
                value: areasToImprove,
                setter: setAreasToImprove,
              },
              {
                id: 'muh-gratitude',
                heading: WEEKLY_MUHASABAH_CONTENT.prompts[3].heading,
                label: WEEKLY_MUHASABAH_CONTENT.prompts[3].question,
                value: gratitudeThisWeek,
                setter: setGratitudeThisWeek,
              },
              {
                id: 'muh-steps',
                heading: WEEKLY_MUHASABAH_CONTENT.prompts[4].heading,
                label: WEEKLY_MUHASABAH_CONTENT.prompts[4].question,
                value: realisticSteps,
                setter: setRealisticSteps,
              },
              {
                id: 'muh-dua',
                heading: 'DOA PRIBADI',
                label: 'Doa pribadi untuk pekan ini',
                value: personalDua,
                setter: setPersonalDua,
              },
            ].map((field) => (
              <div key={field.id}>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-[#7F6334] mb-0.5">
                  {field.heading}
                </p>
                <label htmlFor={field.id} className="block text-xs font-medium text-[#17253B] mb-1.5 leading-relaxed">
                  {field.label}
                </label>
                <textarea
                  id={field.id}
                  rows={3}
                  maxLength={4000}
                  value={field.value}
                  onChange={(e) => {
                    field.setter(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  className="rp-textarea"
                />
              </div>
            ))}

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="rp-btn-secondary">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rp-btn-primary">
                {saving ? 'Menyimpan...' : 'Simpan Muhasabah'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <EditorialLoadingState label="Memuat catatan muhasabah…" blocks={2} />
        ) : items.length === 0 ? (
          <EditorialEmptyState
            icon={CalendarHeart}
            title="Belum ada catatan Weekly Muhasabah."
            description="Gunakan ruang ini di akhir pekan untuk menengok sejenak perjalanan tujuh hari terakhir."
          />
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rp-card p-6 sm:p-7 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <time className="text-xs text-[#7F6334] font-semibold tabular-nums">
                      {item.date}
                    </time>
                    <h2 className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]">
                      {item.weekLabel}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${item.weekLabel}`}
                      onClick={() => openEdit(item)}
                      className="rp-icon-btn"
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus ${item.weekLabel}`}
                      onClick={() => setDeleteTarget(item)}
                      className="rp-icon-btn text-[#7A3528] hover:bg-[#F9EFEA]"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <dl className="space-y-3.5 text-sm text-[#28313C] max-w-[65ch]">
                  {item.gratitudeThisWeek && (
                    <div>
                      <dt className="text-xs font-semibold text-[#5C6268]">Disyukuri minggu ini</dt>
                      <dd className="mt-1 whitespace-pre-wrap leading-relaxed">{item.gratitudeThisWeek}</dd>
                    </div>
                  )}
                  {item.habitsToKeep && (
                    <div>
                      <dt className="text-xs font-semibold text-[#5C6268]">Kebiasaan yang dijaga</dt>
                      <dd className="mt-1 whitespace-pre-wrap leading-relaxed">{item.habitsToKeep}</dd>
                    </div>
                  )}
                  {item.areasToImprove && (
                    <div>
                      <dt className="text-xs font-semibold text-[#5C6268]">Perlu diperbaiki</dt>
                      <dd className="mt-1 whitespace-pre-wrap leading-relaxed">{item.areasToImprove}</dd>
                    </div>
                  )}
                  {item.realisticSteps && (
                    <div>
                      <dt className="text-xs font-semibold text-[#5C6268]">Ikhtiar minggu depan</dt>
                      <dd className="mt-1 whitespace-pre-wrap leading-relaxed">{item.realisticSteps}</dd>
                    </div>
                  )}
                  {item.personalDua && (
                    <div className="pt-2 border-t border-[#E2DACB]/70">
                      <dt className="text-xs font-semibold text-[#7F6334]">Doa pribadi</dt>
                      <dd className="mt-1 whitespace-pre-wrap leading-relaxed italic text-[#28313C]">
                        {item.personalDua}
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Hapus Weekly Muhasabah?"
          description={`Catatan "${deleteTarget?.weekLabel ?? ''}" akan dihapus dari akunmu.`}
          confirmLabel="Hapus"
          destructive
          busy={deleting}
          onConfirm={() => void handleDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AppShell>
  );
}
