import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EditorialEmptyState, EditorialLoadingState } from '../components/feedback/EditorialStates';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import { GRATITUDE_JOURNAL_INTRO } from '../content/supportingPages';
import {
  deleteGratitudeEntry,
  saveGratitudeEntry,
  subscribeGratitudeEntries,
} from '../lib/firestore';
import { getTodayIsoDate } from '../utils/journalLogic';
import type { GratitudeEntry } from '../types/journal';

export function GratitudePage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(getTodayIsoDate());
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');
  const [item3, setItem3] = useState('');
  const [goodDeedPlan, setGoodDeedPlan] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GratitudeEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeGratitudeEntries(
      user.uid,
      (items) => {
        setEntries(items);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat catatan syukur dari server. Silakan periksa koneksi dan muat ulang.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setDate(getTodayIsoDate());
    setItem1('');
    setItem2('');
    setItem3('');
    setGoodDeedPlan('');
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(false);
  };

  const openEdit = (entry: GratitudeEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setItem1(entry.item1);
    setItem2(entry.item2 ?? '');
    setItem3(entry.item3 ?? '');
    setGoodDeedPlan(entry.goodDeedPlan ?? '');
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(true);
  };

  const performSave = useCallback(async () => {
    if (!user) return;
    if (!item1.trim()) {
      setErrorMsg('Mohon tuliskan minimal satu hal yang kamu syukuri hari ini.');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await saveGratitudeEntry(user.uid, {
        id: editingId ?? undefined,
        date: date || getTodayIsoDate(),
        item1: item1.trim(),
        item2: item2.trim(),
        item3: item3.trim(),
        goodDeedPlan: goodDeedPlan.trim(),
        contentVersion: CONTENT_VERSION,
      });
      setStatusMsg(editingId ? 'Catatan syukur diperbarui.' : 'Catatan syukur disimpan.');
      resetForm();
      setSaveStatus('saved');
    } catch {
      const msg = 'Gagal menyimpan catatan syukur. Silakan coba kembali.';
      setErrorMsg(msg);
      setSaveStatus('error');
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, [user, editingId, date, item1, item2, item3, goodDeedPlan]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    void performSave();
  };

  const handleDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGratitudeEntry(user.uid, deleteTarget.id);
      setStatusMsg('Catatan syukur telah dihapus.');
      setDeleteTarget(null);
    } catch {
      setStatusMsg('Gagal menghapus catatan syukur.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((item) =>
      [item.item1, item.item2, item.item3, item.goodDeedPlan, item.date]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [entries, searchQuery]);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="rp-kicker">Menyadari Nikmat Sederhana</p>
            <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              {GRATITUDE_JOURNAL_INTRO.title}
            </h1>
            <p className="mt-2 text-sm text-[#5C6268] max-w-2xl leading-relaxed">
              {GRATITUDE_JOURNAL_INTRO.subtitle}
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
              <span>{showForm ? 'Tutup Form' : 'Catat Syukur'}</span>
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
                {editingId ? 'Edit Catatan Syukur' : 'Catatan Syukur Hari Ini'}
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

            <div>
              <label htmlFor="grat-date" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Tanggal
              </label>
              <input
                id="grat-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSaveStatus('dirty');
                }}
                className="rp-input sm:w-64"
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#7F6334] uppercase tracking-wider">
                {GRATITUDE_JOURNAL_INTRO.promptHeading}
              </p>
              <div>
                <label htmlFor="grat-1" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Hal yang kusyukuri 1
                </label>
                <input
                  id="grat-1"
                  type="text"
                  required
                  maxLength={1000}
                  value={item1}
                  onChange={(e) => {
                    setItem1(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Satu nikmat yang kamu sadari hari ini…"
                  className="rp-input"
                />
              </div>

              <div>
                <label htmlFor="grat-2" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Hal yang kusyukuri 2
                </label>
                <input
                  id="grat-2"
                  type="text"
                  maxLength={1000}
                  value={item2}
                  onChange={(e) => {
                    setItem2(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Nikmat kedua (boleh dikosongkan bila baru teringat satu)…"
                  className="rp-input"
                />
              </div>

              <div>
                <label htmlFor="grat-3" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Hal yang kusyukuri 3
                </label>
                <input
                  id="grat-3"
                  type="text"
                  maxLength={1000}
                  value={item3}
                  onChange={(e) => {
                    setItem3(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Nikmat ketiga…"
                  className="rp-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="grat-deed" className="block text-xs font-medium text-[#17253B] mb-1.5">
                {GRATITUDE_JOURNAL_INTRO.goodDeedHeading}
              </label>
              <textarea
                id="grat-deed"
                rows={3}
                maxLength={2000}
                value={goodDeedPlan}
                onChange={(e) => {
                  setGoodDeedPlan(e.target.value);
                  setSaveStatus('dirty');
                }}
                placeholder="Langkah kebaikan sederhana sebagai wujud syukur…"
                className="rp-textarea"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="rp-btn-secondary">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rp-btn-primary">
                {saving ? 'Menyimpan...' : 'Simpan Catatan'}
              </button>
            </div>
          </form>
        )}

        <div>
          <label htmlFor="grat-search" className="block text-xs font-medium text-[#5C6268] mb-1.5">
            Cari riwayat catatan syukur
          </label>
          <div className="relative max-w-md">
            <Search
              className="w-4 h-4 text-[#5C6268] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id="grat-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci atau tanggal…"
              className="rp-input pl-10"
            />
          </div>
        </div>

        {loading ? (
          <EditorialLoadingState label="Memuat catatan syukur…" blocks={2} />
        ) : filtered.length === 0 ? (
          <EditorialEmptyState
            icon={Sparkles}
            title="Belum ada catatan syukur."
            description="Mulailah dengan satu nikmat sederhana yang kamu sadari hari ini."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((entry) => (
              <article key={entry.id} className="rp-card p-6 sm:p-7 space-y-3.5">
                <div className="flex items-center justify-between gap-4">
                  <time className="text-xs text-[#7F6334] font-semibold tabular-nums">
                    {entry.date}
                  </time>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit catatan syukur ${entry.date}`}
                      onClick={() => openEdit(entry)}
                      className="rp-icon-btn"
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus catatan syukur ${entry.date}`}
                      onClick={() => setDeleteTarget(entry)}
                      className="rp-icon-btn text-[#7A3528] hover:bg-[#F9EFEA]"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-[#28313C] leading-relaxed">
                  <li>{entry.item1}</li>
                  {entry.item2 && <li>{entry.item2}</li>}
                  {entry.item3 && <li>{entry.item3}</li>}
                </ol>

                {entry.goodDeedPlan && (
                  <div className="pt-3.5 border-t border-[#E2DACB]/80 text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                    <span className="font-semibold text-[#17253B]">Niat kebaikan: </span>
                    {entry.goodDeedPlan}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Hapus catatan syukur ini?"
          description={`Catatan tanggal ${deleteTarget?.date ?? ''} akan dihapus secara permanen.`}
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
