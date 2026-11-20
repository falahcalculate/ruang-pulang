import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookHeart, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EditorialEmptyState, EditorialLoadingState } from '../components/feedback/EditorialStates';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import { DUA_CATEGORIES, PERSONAL_DUA_JOURNAL_INTRO } from '../content/supportingPages';
import { deleteDuaEntry, saveDuaEntry, subscribeDuaEntries } from '../lib/firestore';
import { getTodayIsoDate } from '../utils/journalLogic';
import type { DuaCategoryId, DuaEntry } from '../types/journal';

export function DuaJournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DuaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | DuaCategoryId>('all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DuaCategoryId>('hubungan-dengan-allah');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(getTodayIsoDate());
  const [effortNote, setEffortNote] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DuaEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = subscribeDuaEntries(
      user.uid,
      (items) => {
        setEntries(items);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat catatan doa dari server. Silakan periksa koneksi dan muat ulang.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('hubungan-dengan-allah');
    setContent('');
    setDate(getTodayIsoDate());
    setEffortNote('');
    setReflectionNote('');
    setFormError(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(false);
  };

  const openEdit = (item: DuaEntry) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setContent(item.content);
    setDate(item.date);
    setEffortNote(item.effortNote ?? '');
    setReflectionNote(item.reflectionNote ?? '');
    setFormError(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(true);
  };

  const performSave = useCallback(async () => {
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      setFormError('Mohon isi judul/topik dan isi doamu terlebih dahulu.');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    setFormError(null);
    setFeedbackMsg(null);
    try {
      await saveDuaEntry(user.uid, {
        id: editingId ?? undefined,
        title: title.trim(),
        category,
        content: content.trim(),
        date: date || getTodayIsoDate(),
        effortNote: effortNote.trim(),
        reflectionNote: reflectionNote.trim(),
        contentVersion: CONTENT_VERSION,
      });
      setFeedbackMsg(editingId ? 'Catatan doa berhasil diperbarui.' : 'Catatan doa berhasil disimpan.');
      resetForm();
      setSaveStatus('saved');
    } catch {
      const msg = 'Gagal menyimpan catatan doa. Periksa koneksi dan coba kembali.';
      setFormError(msg);
      setSaveStatus('error');
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, [user, editingId, title, category, content, date, effortNote, reflectionNote]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    void performSave();
  };

  const handleDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDuaEntry(user.uid, deleteTarget.id);
      setFeedbackMsg('Catatan doa telah dihapus.');
      setDeleteTarget(null);
    } catch {
      setFeedbackMsg('Gagal menghapus catatan doa. Silakan coba lagi.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (q && !item.title.toLowerCase().includes(q) && !item.content.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [entries, categoryFilter, searchQuery]);

  const getCategoryLabel = (id: DuaCategoryId) =>
    DUA_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="rp-kicker">{PERSONAL_DUA_JOURNAL_INTRO.title}</p>
            <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              Doa Pribadi
            </h1>
            <p className="mt-2 text-sm text-[#5C6268] max-w-2xl leading-relaxed">
              {PERSONAL_DUA_JOURNAL_INTRO.subtitle} Hanya kamu yang dapat melihat catatan ini.
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
                else setShowForm(true);
              }}
              className="rp-btn-primary"
            >
              <Plus className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
              <span>{showForm ? 'Tutup Form' : 'Tulis Doa Baru'}</span>
            </button>
          </div>
        </header>

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {feedbackMsg && (
          <div role="status" className="rp-alert-sage">
            {feedbackMsg}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="rp-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2DACB]/80">
              <h2 className="font-editorial text-2xl font-semibold text-[#17253B]">
                {editingId ? 'Edit Catatan Doa' : 'Tulis Doa Pribadi'}
              </h2>
              <SaveStatusBadge
                status={saveStatus}
                errorMessage={saveError}
                onRetry={() => void performSave()}
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs sm:text-sm text-[#7A3528] font-medium">
                {formError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dua-title" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Judul atau topik doa
                </label>
                <input
                  id="dua-title"
                  type="text"
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Misalnya: Ketenangan dalam pekerjaan"
                  className="rp-input"
                />
              </div>

              <div>
                <label htmlFor="dua-date" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Tanggal
                </label>
                <input
                  id="dua-date"
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

            <div>
              <label htmlFor="dua-category" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Kategori doa
              </label>
              <select
                id="dua-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as DuaCategoryId);
                  setSaveStatus('dirty');
                }}
                className="rp-input"
              >
                {DUA_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dua-content" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Isi doa pribadi
              </label>
              <textarea
                id="dua-content"
                required
                rows={4}
                maxLength={6000}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setSaveStatus('dirty');
                }}
                placeholder="Tuliskan harapan dan doamu dengan kalimat yang paling tulus…"
                className="rp-textarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dua-effort" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Catatan ikhtiar yang menyertai (opsional)
                </label>
                <textarea
                  id="dua-effort"
                  rows={3}
                  maxLength={3000}
                  value={effortNote}
                  onChange={(e) => {
                    setEffortNote(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Langkah nyata yang ingin kamu usahakan…"
                  className="rp-textarea text-sm"
                />
              </div>
              <div>
                <label htmlFor="dua-reflection" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Refleksi atau rasa syukur (opsional)
                </label>
                <textarea
                  id="dua-reflection"
                  rows={3}
                  maxLength={3000}
                  value={reflectionNote}
                  onChange={(e) => {
                    setReflectionNote(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Hal yang membuat hatimu terasa lebih tenang…"
                  className="rp-textarea text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="rp-btn-secondary">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rp-btn-primary">
                {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Doa'}
              </button>
            </div>
          </form>
        )}

        {/* Filter & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <label htmlFor="dua-search" className="block text-xs font-medium text-[#5C6268] mb-1.5">
              Cari judul atau isi doa
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#5C6268] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="dua-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci…"
                className="rp-input pl-10"
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <label htmlFor="dua-filter-cat" className="block text-xs font-medium text-[#5C6268] mb-1.5">
              Filter kategori
            </label>
            <select
              id="dua-filter-cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | DuaCategoryId)}
              className="rp-input"
            >
              <option value="all">Semua kategori</option>
              {DUA_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <EditorialLoadingState label="Memuat catatan doamu…" blocks={2} />
        ) : filteredEntries.length === 0 ? (
          <EditorialEmptyState
            icon={BookHeart}
            title={
              entries.length === 0
                ? 'Belum ada catatan doa.'
                : 'Tidak ada catatan doa yang cocok dengan pencarianmu.'
            }
            description={
              entries.length === 0
                ? 'Sediakan ruang untuk menuliskan apa yang ingin kamu panjatkan.'
                : 'Coba ubah kata kunci pencarian atau pilih kategori lain.'
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((item) => (
              <article key={item.id} className="rp-card p-6 sm:p-7 space-y-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6268]">
                      <span className="text-[#7F6334] font-semibold">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time className="tabular-nums">{item.date}</time>
                    </div>
                    <h2 className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit doa ${item.title}`}
                      onClick={() => openEdit(item)}
                      className="rp-icon-btn"
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus doa ${item.title}`}
                      onClick={() => setDeleteTarget(item)}
                      className="rp-icon-btn text-[#7A3528] hover:bg-[#F9EFEA]"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base leading-[1.75] text-[#28313C] whitespace-pre-wrap max-w-[65ch]">
                  {item.content}
                </p>

                {(item.effortNote || item.reflectionNote) && (
                  <div className="pt-4 border-t border-[#E2DACB]/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#5C6268]">
                    {item.effortNote && (
                      <div>
                        <p className="font-semibold text-[#17253B]">Ikhtiar:</p>
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed">{item.effortNote}</p>
                      </div>
                    )}
                    {item.reflectionNote && (
                      <div>
                        <p className="font-semibold text-[#17253B]">Refleksi / Syukur:</p>
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed">{item.reflectionNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Hapus catatan doa ini?"
          description={`Catatan "${deleteTarget?.title ?? ''}" akan dihapus secara permanen dari akunmu.`}
          confirmLabel="Hapus Catatan"
          destructive
          busy={deleting}
          onConfirm={() => void handleDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AppShell>
  );
}
