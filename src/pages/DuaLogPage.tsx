import React, { useCallback, useEffect, useState } from 'react';
import { NotebookPen, Pencil, Plus, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EditorialEmptyState, EditorialLoadingState } from '../components/feedback/EditorialStates';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_VERSION } from '../content/journalContent';
import { DUA_LOG_INTRO } from '../content/supportingPages';
import { deleteDuaLog, saveDuaLog, subscribeDuaLogs } from '../lib/firestore';
import { getTodayIsoDate } from '../utils/journalLogic';
import type { DuaLog } from '../types/journal';

export function DuaLogPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DuaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState(getTodayIsoDate());
  const [topic, setTopic] = useState('');
  const [duaText, setDuaText] = useState('');
  const [effortSteps, setEffortSteps] = useState('');
  const [reflectionGratitude, setReflectionGratitude] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DuaLog | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeDuaLogs(
      user.uid,
      (items) => {
        setLogs(items);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Gagal memuat log doa dari server. Silakan periksa koneksi dan muat ulang.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setDate(getTodayIsoDate());
    setTopic('');
    setDuaText('');
    setEffortSteps('');
    setReflectionGratitude('');
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(false);
  };

  const openEdit = (item: DuaLog) => {
    setEditingId(item.id);
    setDate(item.date);
    setTopic(item.topic);
    setDuaText(item.duaText);
    setEffortSteps(item.effortSteps ?? '');
    setReflectionGratitude(item.reflectionGratitude ?? '');
    setErrorMsg(null);
    setSaveStatus('idle');
    setSaveError(null);
    setShowForm(true);
  };

  const performSave = useCallback(async () => {
    if (!user) return;
    if (!topic.trim() || !duaText.trim()) {
      setErrorMsg('Mohon isi topik doa dan doa yang ingin dipanjatkan.');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await saveDuaLog(user.uid, {
        id: editingId ?? undefined,
        date: date || getTodayIsoDate(),
        topic: topic.trim(),
        duaText: duaText.trim(),
        effortSteps: effortSteps.trim(),
        reflectionGratitude: reflectionGratitude.trim(),
        contentVersion: CONTENT_VERSION,
      });
      setStatusMsg(editingId ? 'Log doa berhasil diperbarui.' : 'Log doa berhasil disimpan.');
      resetForm();
      setSaveStatus('saved');
    } catch {
      const msg = 'Gagal menyimpan log doa. Silakan coba kembali.';
      setErrorMsg(msg);
      setSaveStatus('error');
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, [user, editingId, date, topic, duaText, effortSteps, reflectionGratitude]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    void performSave();
  };

  const handleDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDuaLog(user.uid, deleteTarget.id);
      setStatusMsg('Log doa telah dihapus.');
      setDeleteTarget(null);
    } catch {
      setStatusMsg('Gagal menghapus log doa.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="rp-kicker">Chronological Dua Journal</p>
            <h1 className="mt-1.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              {DUA_LOG_INTRO.title}
            </h1>
            <p className="mt-2 text-sm text-[#28313C] max-w-2xl leading-relaxed">
              {DUA_LOG_INTRO.subtitle}
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
              <span>{showForm ? 'Tutup Form' : 'Tambah Log Doa'}</span>
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
                {editingId ? 'Edit Log Doa' : 'Catat Doa & Ikhtiar'}
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
                <label htmlFor="log-date" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Tanggal
                </label>
                <input
                  id="log-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  className="rp-input"
                />
              </div>
              <div>
                <label htmlFor="log-topic" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Topik doa
                </label>
                <input
                  id="log-topic"
                  type="text"
                  required
                  maxLength={200}
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Topik singkat doa…"
                  className="rp-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="log-dua" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Doa yang ingin dipanjatkan
              </label>
              <textarea
                id="log-dua"
                required
                rows={4}
                maxLength={6000}
                value={duaText}
                onChange={(e) => {
                  setDuaText(e.target.value);
                  setSaveStatus('dirty');
                }}
                placeholder="Tuliskan isi doamu…"
                className="rp-textarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="log-effort" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Ikhtiar / langkah baik yang menyertai
                </label>
                <textarea
                  id="log-effort"
                  rows={3}
                  maxLength={4000}
                  value={effortSteps}
                  onChange={(e) => {
                    setEffortSteps(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Langkah baik yang diusahakan…"
                  className="rp-textarea text-sm"
                />
              </div>
              <div>
                <label htmlFor="log-reflect" className="block text-xs font-medium text-[#17253B] mb-1.5">
                  Refleksi / rasa syukur
                </label>
                <textarea
                  id="log-reflect"
                  rows={3}
                  maxLength={4000}
                  value={reflectionGratitude}
                  onChange={(e) => {
                    setReflectionGratitude(e.target.value);
                    setSaveStatus('dirty');
                  }}
                  placeholder="Rasa syukur atau pelajaran yang kamu temukan…"
                  className="rp-textarea text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="rp-btn-secondary">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rp-btn-primary">
                {saving ? 'Menyimpan...' : 'Simpan Log'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <EditorialLoadingState label="Memuat log doamu…" blocks={2} />
        ) : logs.length === 0 ? (
          <EditorialEmptyState
            icon={NotebookPen}
            title="Belum ada catatan pada My Dua Log."
            description="Catat doa, langkah ikhtiar, dan hal yang disyukuri kapan pun kamu siap."
          />
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <article key={log.id} className="rp-card p-6 sm:p-7 space-y-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <time className="text-xs text-[#7F6334] font-semibold tabular-nums">
                      {log.date}
                    </time>
                    <h2 className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]">
                      {log.topic}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit log ${log.topic}`}
                      onClick={() => openEdit(log)}
                      className="rp-icon-btn"
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus log ${log.topic}`}
                      onClick={() => setDeleteTarget(log)}
                      className="rp-icon-btn text-[#7A3528] hover:bg-[#F9EFEA]"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className="text-sm sm:text-base leading-[1.75] text-[#28313C] whitespace-pre-wrap max-w-[65ch]">
                  {log.duaText}
                </p>
                {(log.effortSteps || log.reflectionGratitude) && (
                  <div className="pt-4 border-t border-[#E2DACB]/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#5C6268]">
                    {log.effortSteps && (
                      <div>
                        <p className="font-semibold text-[#17253B]">Ikhtiar:</p>
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed">{log.effortSteps}</p>
                      </div>
                    )}
                    {log.reflectionGratitude && (
                      <div>
                        <p className="font-semibold text-[#17253B]">Refleksi & Syukur:</p>
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed">{log.reflectionGratitude}</p>
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
          title="Hapus entri My Dua Log?"
          description={`Catatan "${deleteTarget?.topic ?? ''}" akan dihapus dari daftar log doamu.`}
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
