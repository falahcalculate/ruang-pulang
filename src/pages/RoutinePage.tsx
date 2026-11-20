import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EditorialEmptyState, EditorialLoadingState } from '../components/feedback/EditorialStates';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import {
  ROUTINE_FREQUENCY_OPTIONS,
  ROUTINE_MOMENT_OPTIONS,
  SUSTAINABLE_ROUTINE_CONTENT,
} from '../content/supportingPages';
import {
  deleteRoutineItem,
  saveRoutineItem,
  subscribeRoutineItems,
} from '../lib/firestore';
import type { RoutineItem } from '../types/journal';

export function RoutinePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [moment, setMoment] = useState(ROUTINE_MOMENT_OPTIONS[0]);
  const [habitName, setHabitName] = useState('');
  const [personalBenefit, setPersonalBenefit] = useState('');
  const [realisticWay, setRealisticWay] = useState('');
  const [frequency, setFrequency] = useState(ROUTINE_FREQUENCY_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoutineItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeRoutineItems(
      user.uid,
      (list) => {
        setItems(list);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat daftar rutinitas dari server. Silakan muat ulang.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setMoment(ROUTINE_MOMENT_OPTIONS[0]);
    setHabitName('');
    setPersonalBenefit('');
    setRealisticWay('');
    setFrequency(ROUTINE_FREQUENCY_OPTIONS[0]);
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(false);
  };

  const openEdit = (item: RoutineItem) => {
    setEditingId(item.id);
    setMoment(item.moment);
    setHabitName(item.habitName);
    setPersonalBenefit(item.personalBenefit ?? '');
    setRealisticWay(item.realisticWay ?? '');
    setFrequency(item.frequency || ROUTINE_FREQUENCY_OPTIONS[0]);
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(true);
  };

  const performSave = useCallback(async () => {
    if (!user) return;
    if (!habitName.trim()) {
      setErrorMsg('Mohon isi nama kebiasaan yang ingin kamu jaga.');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const existing = items.find((i) => i.id === editingId);
      const nextSortOrder = existing
        ? existing.sortOrder
        : items.length > 0
          ? Math.max(...items.map((i) => i.sortOrder)) + 1
          : 0;

      await saveRoutineItem(user.uid, {
        id: editingId ?? undefined,
        moment,
        habitName: habitName.trim(),
        personalBenefit: personalBenefit.trim(),
        realisticWay: realisticWay.trim(),
        frequency,
        sortOrder: nextSortOrder,
        contentVersion: CONTENT_VERSION,
      });
      setStatusMsg(editingId ? 'Rutinitas diperbarui.' : 'Rutinitas berhasil ditambahkan.');
      resetForm();
      setSaveStatus('saved');
    } catch {
      const msg = 'Gagal menyimpan rutinitas. Silakan coba lagi.';
      setErrorMsg(msg);
      setSaveStatus('error');
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, [user, items, editingId, moment, habitName, personalBenefit, realisticWay, frequency]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    void performSave();
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (!user) return;
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    setSaveStatus('saving');
    setSaveError(null);
    try {
      await Promise.all(
        reordered.map((item, idx) =>
          item.sortOrder !== idx
            ? saveRoutineItem(user.uid, {
                ...item,
                sortOrder: idx,
              })
            : Promise.resolve()
        )
      );
      setSaveStatus('saved');
    } catch {
      const msg = 'Gagal mengubah urutan rutinitas.';
      setStatusMsg(msg);
      setSaveStatus('error');
      setSaveError(msg);
    }
  };

  const handleDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoutineItem(user.uid, deleteTarget.id);
      setStatusMsg('Rutinitas telah dihapus.');
      setDeleteTarget(null);
    } catch {
      setStatusMsg('Gagal menghapus rutinitas.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="rp-kicker">{SUSTAINABLE_ROUTINE_CONTENT.commitmentHeading}</p>
            <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              {SUSTAINABLE_ROUTINE_CONTENT.title}
            </h1>
            <p className="mt-2 text-sm text-[#5C6268] max-w-2xl leading-relaxed">
              {SUSTAINABLE_ROUTINE_CONTENT.subtitle}
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
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
              className="rp-btn-primary"
            >
              <Plus className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
              <span>{showForm ? 'Tutup Form' : 'Tambah Rutinitas'}</span>
            </button>
          </div>
        </header>

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
                {editingId ? 'Edit Rutinitas' : 'Susun Rutinitas Ringan'}
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
                <label htmlFor="routine-moment" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {SUSTAINABLE_ROUTINE_CONTENT.columns.moment}
                </label>
                <select
                  id="routine-moment"
                  value={moment}
                  onChange={(e) => {
                    setMoment(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  className="rp-input"
                >
                  {ROUTINE_MOMENT_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="routine-freq" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Frekuensi pilihan
                </label>
                <select
                  id="routine-freq"
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  className="rp-input"
                >
                  {ROUTINE_FREQUENCY_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="routine-name" className="block text-xs font-medium text-[#17253B] mb-1.5">
                {SUSTAINABLE_ROUTINE_CONTENT.columns.habit}
              </label>
              <input
                id="routine-name"
                type="text"
                required
                maxLength={200}
                value={habitName}
                onChange={(e) => {
                  setHabitName(e.target.value);
                  setSaveStatus('dirty');
                }}
                placeholder="Misalnya: Membaca 1 halaman Al-Qur’an atau zikir pagi singkat"
                className="rp-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="routine-benefit" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Alasan / manfaat pribadi
                </label>
                <textarea
                  id="routine-benefit"
                  rows={3}
                  maxLength={2000}
                  value={personalBenefit}
                  onChange={(e) => {
                    setPersonalBenefit(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Mengapa kebiasaan ini berarti bagimu…"
                  className="rp-textarea text-sm"
                />
              </div>
              <div>
                <label htmlFor="routine-way" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  {SUSTAINABLE_ROUTINE_CONTENT.columns.realisticWay}
                </label>
                <textarea
                  id="routine-way"
                  rows={3}
                  maxLength={2000}
                  value={realisticWay}
                  onChange={(e) => {
                    setRealisticWay(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Misalnya: cukup 5 menit setelah selesai merapikan sajadah…"
                  className="rp-textarea text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="rp-btn-secondary">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rp-btn-primary">
                {saving ? 'Menyimpan...' : 'Simpan Rutinitas'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <EditorialLoadingState label="Memuat daftar rutinitas…" blocks={2} />
        ) : items.length === 0 ? (
          <EditorialEmptyState
            icon={ListChecks}
            title="Belum ada rutinitas yang disusun."
            description="Mulailah dari satu momen sederhana, seperti setelah Subuh atau sebelum tidur."
          />
        ) : (
          <div className="space-y-3.5">
            {items.map((item, idx) => (
              <article
                key={item.id}
                className="rp-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 max-w-[65ch]">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6268]">
                    <span className="font-semibold text-[#7F6334]">{item.moment}</span>
                    {item.frequency && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{item.frequency}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-editorial text-2xl font-semibold text-[#17253B]">
                    {item.habitName}
                  </h2>
                  {item.personalBenefit && (
                    <p className="text-sm text-[#28313C] leading-relaxed">
                      <span className="text-[#5C6268] font-medium">Alasan: </span>
                      {item.personalBenefit}
                    </p>
                  )}
                  {item.realisticWay && (
                    <p className="text-sm text-[#28313C] leading-relaxed">
                      <span className="text-[#5C6268] font-medium">Cara realistis: </span>
                      {item.realisticWay}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    aria-label={`Pindah ${item.habitName} ke atas`}
                    disabled={idx === 0}
                    onClick={() => void handleMove(idx, -1)}
                    className="rp-icon-btn"
                  >
                    <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Pindah ${item.habitName} ke bawah`}
                    disabled={idx === items.length - 1}
                    onClick={() => void handleMove(idx, 1)}
                    className="rp-icon-btn"
                  >
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Edit ${item.habitName}`}
                    onClick={() => openEdit(item)}
                    className="rp-icon-btn"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus ${item.habitName}`}
                    onClick={() => setDeleteTarget(item)}
                    className="rp-icon-btn text-[#7A3528] hover:bg-[#F9EFEA]"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Hapus rutinitas ini?"
          description={`Kebiasaan "${deleteTarget?.habitName ?? ''}" akan dihapus dari daftar rutinitasmu.`}
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
