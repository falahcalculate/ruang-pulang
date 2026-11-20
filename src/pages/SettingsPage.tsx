import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, LogOut, Printer, ShieldAlert, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { SaveStatusBadge, type SaveStatus } from '../components/feedback/SaveStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { BRAND_PRINCIPLES } from '../content/journalContent';
import {
  deleteCurrentAuthUser,
  logoutUser,
  reauthenticateCurrentUser,
  resendVerificationEmail,
} from '../lib/auth';
import {
  deleteAllUserFirestoreData,
  fetchAllUserDataForExport,
  updateUserProfile,
} from '../lib/firestore';
import { downloadJsonExport, triggerPrintExport } from '../lib/export';
import { getNightContent } from '../content/journalContent';
import { clearAllLocalDrafts, getFriendlyAuthError } from '../utils/journalLogic';
import type { FontSizePreference, UserExportPayload } from '../types/journal';

export function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [journeyStartDate, setJourneyStartDate] = useState(profile?.journeyStartDate ?? '');
  const [fontSize, setFontSize] = useState<FontSizePreference>(
    profile?.fontSizePreference ?? 'normal'
  );

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName ?? '');
    setJourneyStartDate(profile.journeyStartDate ?? '');
    setFontSize(profile.fontSizePreference ?? 'normal');
  }, [profile]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>('idle');
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [exportCategory, setExportCategory] = useState<'all' | keyof UserExportPayload>('all');
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [printPayload, setPrintPayload] = useState<UserExportPayload | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const [sendingVerify, setSendingVerify] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deletionLog, setDeletionLog] = useState<string[]>([]);
  const [deletionError, setDeletionError] = useState<string | null>(null);

  const hasPasswordProvider = Boolean(
    user?.providerData.some((p) => p.providerId === 'password')
  );

  const performSaveProfile = useCallback(async () => {
    if (!user) return;
    setSavingProfile(true);
    setProfileSaveStatus('saving');
    setProfileSaveError(null);
    setProfileMsg(null);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        journeyStartDate: journeyStartDate || profile?.journeyStartDate,
        fontSizePreference: fontSize,
      });
      await refreshProfile();
      setProfileSaveStatus('saved');
      setProfileMsg('Pengaturan profil berhasil disimpan.');
    } catch {
      const msg = 'Gagal memperbarui profil. Silakan coba kembali.';
      setProfileSaveStatus('error');
      setProfileSaveError(msg);
      setProfileMsg(msg);
    } finally {
      setSavingProfile(false);
    }
  }, [user, displayName, journeyStartDate, profile?.journeyStartDate, fontSize, refreshProfile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    void performSaveProfile();
  };

  const handleExportJson = async () => {
    if (!user) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const payload = await fetchAllUserDataForExport(user.uid);
      downloadJsonExport(
        payload,
        exportCategory === 'all' ? undefined : exportCategory
      );
      setExportMsg(
        `Ekspor JSON selesai pada ${new Date(payload.exportedAt).toLocaleString('id-ID')}.`
      );
    } catch {
      setExportMsg('Gagal mengekspor data. Silakan coba beberapa saat lagi.');
    } finally {
      setExporting(false);
    }
  };

  const handlePrintSummary = async () => {
    if (!user) return;
    setPrinting(true);
    setExportMsg(null);
    try {
      const payload = await fetchAllUserDataForExport(user.uid);
      setPrintPayload(payload);
      window.setTimeout(() => {
        triggerPrintExport();
        setPrinting(false);
      }, 100);
    } catch {
      setExportMsg('Gagal menyiapkan ringkasan cetak dari Firestore. Periksa koneksimu dan coba lagi.');
      setPrinting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    setSendingVerify(true);
    setVerifyMsg(null);
    try {
      await resendVerificationEmail(user);
      setVerifyMsg('Email verifikasi telah dikirim ulang. Periksa kotak masuk atau folder spam.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setVerifyMsg(getFriendlyAuthError(msg));
    } finally {
      setSendingVerify(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/', { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'HAPUS AKUN') {
      setDeletionError('Ketik "HAPUS AKUN" untuk mengonfirmasi penghapusan permanen.');
      return;
    }
    if (hasPasswordProvider && !deletePassword) {
      setDeletionError('Masukkan kata sandimu terlebih dahulu untuk verifikasi ulang sebelum menghapus akun.');
      return;
    }

    setDeletingAccount(true);
    setDeletionError(null);
    setDeletionLog([]);
    let stage: 'reauth' | 'firestore' | 'auth' = 'reauth';

    try {
      setDeletionLog(['Memverifikasi ulang sesi akun sebelum penghapusan...']);
      await reauthenticateCurrentUser(hasPasswordProvider ? deletePassword : undefined);

      stage = 'firestore';
      const report = await deleteAllUserFirestoreData(user.uid, (step) => {
        setDeletionLog((prev) => [...prev, step]);
      });
      clearAllLocalDrafts();

      setDeletionLog((prev) => [
        ...prev,
        `Total ${report.deletedDocuments} dokumen catatan pribadi dan profil Firestore telah dihapus.`,
        'Menghapus akun autentikasi Firebase...',
      ]);

      stage = 'auth';
      await deleteCurrentAuthUser();
      setConfirmDeleteOpen(false);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const friendly = getFriendlyAuthError(msg);
      setConfirmDeleteOpen(false);

      if (stage === 'reauth') {
        setDeletionError(
          `${friendly} Verifikasi ulang belum berhasil; tidak ada catatan Firestore maupun akun autentikasi yang dihapus.`
        );
      } else if (stage === 'firestore') {
        setDeletionError(
          `${friendly} Penghapusan Firestore berhenti di tengah proses sehingga sebagian data mungkin sudah terhapus dan sebagian lainnya masih tersisa. Periksa koneksi dan coba ulangi penghapusan.`
        );
      } else {
        setDeletionError(
          `${friendly} Catatan dan profil Firestore sudah dihapus, namun akun login Firebase Authentication belum terhapus. Silakan masuk ulang lalu ulangi penghapusan akun.`
        );
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <AppShell>
      <div className="no-print max-w-3xl mx-auto space-y-8">
        <header className="space-y-2.5">
          <p className="rp-kicker">Akun, Privasi & Pengaturan</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
            Profil & Pengelolaan Data
          </h1>
          <p className="text-sm text-[#5C6268] leading-relaxed max-w-2xl">
            Kelola preferensi tampilanmu, unduh salinan catatan pribadi, atau hapus data akunmu kapan saja.
          </p>
        </header>

        {/* Email verification notice for email/password users */}
        {user && !user.emailVerified && (
          <div className="p-5 rounded-xl bg-[#EFE7D8] border border-[#B99B69] space-y-2 text-sm text-[#17253B]">
            <p className="font-semibold">Alamat emailmu belum terverifikasi.</p>
            <p className="text-xs sm:text-sm text-[#28313C] leading-relaxed">
              Kamu tetap dapat menulis di ruang pribadi ini. Untuk keamanan pemulihan akun, verifikasi email melalui tautan yang kami kirimkan.
            </p>
            <button
              type="button"
              disabled={sendingVerify}
              onClick={() => void handleResendVerification()}
              className="text-xs font-semibold underline text-[#17253B] hover:text-[#7F6334] min-h-[36px]"
            >
              {sendingVerify ? 'Mengirim...' : 'Kirim ulang email verifikasi'}
            </button>
            {verifyMsg && <p className="text-xs text-[#28313C]">{verifyMsg}</p>}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="rp-card p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2DACB]/80">
            <h2 className="font-editorial text-2xl font-semibold text-[#17253B]">
              Profil & Preferensi Baca
            </h2>
            <SaveStatusBadge
              status={profileSaveStatus}
              errorMessage={profileSaveError}
              onRetry={() => void performSaveProfile()}
            />
          </div>

          {profileMsg && (
            <p role="status" className="text-xs sm:text-sm text-[#17253B] font-medium">
              {profileMsg}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Nama tampilan
              </label>
              <input
                id="prof-name"
                type="text"
                maxLength={120}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setProfileSaveStatus('dirty');
                }}
                className="rp-input"
              />
            </div>

            <div>
              <label htmlFor="prof-email" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Email akun (read-only)
              </label>
              <input
                id="prof-email"
                type="email"
                readOnly
                value={user?.email || profile?.email || ''}
                className="rp-input bg-[#EFE7D8]/50 text-[#5C6268]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-start" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Tanggal mulai perjalanan
              </label>
              <input
                id="prof-start"
                type="date"
                value={journeyStartDate}
                onChange={(e) => {
                  setJourneyStartDate(e.target.value);
                  setProfileSaveStatus('dirty');
                }}
                className="rp-input"
              />
            </div>

            <div>
              <label htmlFor="prof-font" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Ukuran teks (Tema Terang Warm Ivory)
              </label>
              <select
                id="prof-font"
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value as FontSizePreference);
                  setProfileSaveStatus('dirty');
                }}
                className="rp-input"
              >
                <option value="normal">Standar (nyaman untuk membaca)</option>
                <option value="large">Lebih besar (+9%)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={savingProfile} className="rp-btn-primary w-full sm:w-auto">
              {savingProfile ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>

        {/* Export Data */}
        <section aria-labelledby="export-heading" className="rp-card p-6 sm:p-8 space-y-5">
          <div>
            <h2 id="export-heading" className="font-editorial text-2xl font-semibold text-[#17253B]">
              Ekspor Catatan Pribadi
            </h2>
            <p className="mt-1.5 text-sm text-[#5C6268] leading-relaxed">
              Unduh seluruh catatanmu dalam format JSON, atau buka ringkasan cetak browser (Save as PDF melalui dialog cetak). Data yang diekspor hanya berasal dari akunmu sendiri.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="export-cat" className="block text-xs font-medium text-[#17253B] mb-1.5">
                Pilih cakupan ekspor JSON
              </label>
              <select
                id="export-cat"
                value={String(exportCategory)}
                onChange={(e) =>
                  setExportCategory(e.target.value as 'all' | keyof UserExportPayload)
                }
                className="rp-input"
              >
                <option value="all">Semua data journal & catatan</option>
                <option value="nightEntries">Hanya perjalanan 30 malam</option>
                <option value="duaEntries">Hanya Doa Pribadi</option>
                <option value="duaLogs">Hanya My Dua Log</option>
                <option value="tahajudLogs">Hanya Tracker Ibadah Malam</option>
                <option value="gratitudeEntries">Hanya Gratitude Journal</option>
                <option value="weeklyMuhasabah">Hanya Weekly Muhasabah</option>
                <option value="routineItems">Hanya Rutinitas Spiritual</option>
                <option value="finalReflections">Hanya Baseline & Refleksi Akhir</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={exporting}
                onClick={() => void handleExportJson()}
                className="rp-btn-primary w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
                <span>{exporting ? 'Menyiapkan...' : 'Unduh JSON'}</span>
              </button>

              <button
                type="button"
                disabled={printing}
                onClick={() => void handlePrintSummary()}
                className="rp-btn-secondary w-full sm:w-auto"
              >
                <Printer className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
                <span>{printing ? 'Menyiapkan cetak...' : 'Print / PDF'}</span>
              </button>
            </div>
          </div>

          {exportMsg && (
            <p role="status" className="text-xs sm:text-sm text-[#4C5C47] font-medium">
              {exportMsg}
            </p>
          )}
        </section>

        {/* Privacy & Disclaimer */}
        <section aria-labelledby="privacy-heading" className="rp-card p-6 sm:p-8 space-y-3">
          <h2 id="privacy-heading" className="font-editorial text-2xl font-semibold text-[#17253B]">
            Privasi &amp; Prinsip Aplikasi
          </h2>
          <p className="text-sm leading-relaxed text-[#28313C]">{BRAND_PRINCIPLES.disclaimer}</p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#5C6268] leading-relaxed">
            <li>Semua catatan disimpan terisolasi di bawah akunmu pada Cloud Firestore.</li>
            <li>Tidak ada isi doa, refleksi, atau log ibadah yang dikirim ke layanan AI atau pihak ketiga.</li>
            <li>Sebaiknya tetap hindari menuliskan informasi finansial atau rahasia sangat sensitif.</li>
          </ul>
          <div className="pt-3 border-t border-[#E2DACB] flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <Link
              to="/app/privacy"
              className="font-medium text-[#7F6334] hover:text-[#17253B] underline underline-offset-4 py-1"
            >
              Baca Kebijakan Privasi
            </Link>
            <Link
              to="/app/terms"
              className="font-medium text-[#7F6334] hover:text-[#17253B] underline underline-offset-4 py-1"
            >
              Baca Ketentuan Penggunaan
            </Link>
          </div>
        </section>

        {/* Sign Out & Account Deletion */}
        <section aria-labelledby="danger-heading" className="rp-card p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2DACB]">
            <div>
              <h2 id="danger-heading" className="font-editorial text-xl font-semibold text-[#17253B]">
                Keluar dari Akun
              </h2>
              <p className="mt-0.5 text-xs text-[#5C6268]">
                Catatanmu tetap tersimpan aman dan dapat dibuka kembali saat kamu masuk lagi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rp-btn-secondary w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#7A3528] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#7A3528]">
                  Hapus Akun & Seluruh Catatan
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#28313C] leading-relaxed">
                  Proses ini dijalankan langsung dari sesimu (belum menggunakan server Admin SDK) untuk menghapus dokumen di 9 subkoleksi catatan pribadimu (30 malam, doa, log, tracker, checklist, syukur, muhasabah, rutinitas, refleksi akhir), menghapus profil Firestore, lalu menghapus akun autentikasi Firebase. Disarankan mengekspor data terlebih dahulu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="confirm-delete-input"
                  className="block text-xs font-medium text-[#17253B] mb-1.5"
                >
                  Ketik <strong className="font-semibold">HAPUS AKUN</strong> untuk mengaktifkan tombol hapus
                </label>
                <input
                  id="confirm-delete-input"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="HAPUS AKUN"
                  className="rp-input"
                />
              </div>

              {hasPasswordProvider && (
                <div>
                  <label
                    htmlFor="confirm-delete-password"
                    className="block text-xs font-medium text-[#17253B] mb-1.5"
                  >
                    Kata sandi akun (untuk verifikasi ulang)
                  </label>
                  <input
                    id="confirm-delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Masukkan kata sandimu"
                    className="rp-input"
                  />
                </div>
              )}
            </div>

            {deletionLog.length > 0 && (
              <ul className="p-3.5 rounded-xl bg-[#EFE7D8] text-xs text-[#17253B] space-y-1">
                {deletionLog.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}

            {deletionError && (
              <p role="alert" className="text-xs sm:text-sm text-[#7A3528] font-medium">
                {deletionError}
              </p>
            )}

            <button
              type="button"
              disabled={
                deletingAccount ||
                deleteConfirmText.trim().toUpperCase() !== 'HAPUS AKUN' ||
                (hasPasswordProvider && !deletePassword)
              }
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] w-full sm:w-auto rounded-lg bg-[#7A3528] text-[#FFFDF8] text-sm font-medium hover:bg-[#61271C] disabled:opacity-45"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Hapus Akun & Data Secara Permanen</span>
            </button>
          </div>
        </section>

        <ConfirmDialog
          open={confirmDeleteOpen}
          title="Konfirmasi Penghapusan Akun"
          description="Tindakan ini tidak dapat dibatalkan. Seluruh catatan journal, doa, tracker, dan akun loginmu akan dihapus secara permanen."
          confirmLabel="Ya, Hapus Semua Sekarang"
          destructive
          busy={deletingAccount}
          onConfirm={() => void handleDeleteAccount()}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      </div>

      {/* Printable Journal Archive Summary (hidden on screen, shown on print / Save as PDF) */}
      {printPayload && (
        <div className="print-only space-y-6 text-[#17253B] p-6">
          <header className="border-b border-[#E2DACB] pb-4">
            <p className="text-xs uppercase tracking-widest text-[#7F6334]">
              RUANG PULANG — The Comeback Journal
            </p>
            <h1 className="font-editorial text-3xl font-semibold mt-1">
              Arsip Catatan Pribadi
            </h1>
            <p className="text-xs text-[#5C6268] mt-1">
              Diekspor pada {new Date(printPayload.exportedAt).toLocaleString('id-ID')} ·{' '}
              {printPayload.profile?.displayName || printPayload.profile?.email || printPayload.uid}
            </p>
          </header>

          {printPayload.nightEntries.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Perjalanan 30 Malam ({printPayload.nightEntries.length} catatan)
              </h2>
              {printPayload.nightEntries
                .slice()
                .sort((a, b) => a.nightNumber - b.nightNumber)
                .map((n) => {
                  const meta = getNightContent(n.nightNumber);
                  return (
                    <article key={n.id} className="print-break-avoid border border-[#E2DACB] p-4 rounded-lg space-y-2">
                      <h3 className="font-editorial text-lg font-semibold">
                        Malam {n.nightNumber}: {meta?.title ?? ''} ({n.status})
                      </h3>
                      {n.reflectionAnswers.map((ans, idx) =>
                        ans.trim() ? (
                          <p key={idx} className="text-xs whitespace-pre-wrap">
                            <strong>Refleksi {idx + 1}:</strong> {ans}
                          </p>
                        ) : null
                      )}
                      {n.smallActionNotes.trim() && (
                        <p className="text-xs whitespace-pre-wrap">
                          <strong>Langkah kecil:</strong> {n.smallActionNotes}
                        </p>
                      )}
                      {n.personalDua.trim() && (
                        <p className="text-xs whitespace-pre-wrap">
                          <strong>Doa pribadi:</strong> {n.personalDua}
                        </p>
                      )}
                      {n.privateNote.trim() && (
                        <p className="text-xs whitespace-pre-wrap">
                          <strong>Catatan tambahan:</strong> {n.privateNote}
                        </p>
                      )}
                    </article>
                  );
                })}
            </section>
          )}

          {printPayload.duaEntries.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Doa Pribadi ({printPayload.duaEntries.length})
              </h2>
              {printPayload.duaEntries.map((d) => (
                <article key={d.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">
                    {d.title} · {d.date}
                  </p>
                  <p className="whitespace-pre-wrap">{d.content}</p>
                </article>
              ))}
            </section>
          )}

          {printPayload.duaLogs.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                My Dua Log ({printPayload.duaLogs.length})
              </h2>
              {printPayload.duaLogs.map((l) => (
                <article key={l.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">
                    {l.topic} · {l.date}
                  </p>
                  <p className="whitespace-pre-wrap">{l.duaText}</p>
                </article>
              ))}
            </section>
          )}

          {printPayload.tahajudLogs.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Tracker Ibadah Malam ({printPayload.tahajudLogs.length})
              </h2>
              {printPayload.tahajudLogs
                .slice()
                .sort((a, b) => a.nightIndex - b.nightIndex)
                .map((t) => (
                  <article key={t.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                    <p className="font-semibold">
                      Malam {t.nightIndex}{t.date ? ` · ${t.date}` : ''} — {t.wakeStatus}
                    </p>
                    {t.activities.length > 0 && <p>Aktivitas: {t.activities.join(', ')}</p>}
                    {t.note && <p className="whitespace-pre-wrap">Catatan: {t.note}</p>}
                  </article>
                ))}
            </section>
          )}

          {printPayload.gratitudeEntries.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Gratitude Journal ({printPayload.gratitudeEntries.length})
              </h2>
              {printPayload.gratitudeEntries.map((g) => (
                <article key={g.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">{g.date}</p>
                  <p>1. {g.item1}</p>
                  {g.item2 && <p>2. {g.item2}</p>}
                  {g.item3 && <p>3. {g.item3}</p>}
                  {g.goodDeedPlan && <p>Niat kebaikan: {g.goodDeedPlan}</p>}
                </article>
              ))}
            </section>
          )}

          {printPayload.weeklyMuhasabah.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Weekly Muhasabah ({printPayload.weeklyMuhasabah.length})
              </h2>
              {printPayload.weeklyMuhasabah.map((m) => (
                <article key={m.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">
                    {m.weekLabel} · {m.date}
                  </p>
                  {m.gratitudeThisWeek && <p>Disyukuri: {m.gratitudeThisWeek}</p>}
                  {m.habitsToKeep && <p>Kebiasaan dijaga: {m.habitsToKeep}</p>}
                  {m.areasToImprove && <p>Perbaikan lembut: {m.areasToImprove}</p>}
                  {m.realisticSteps && <p>Ikhtiar: {m.realisticSteps}</p>}
                  {m.personalDua && <p>Doa: {m.personalDua}</p>}
                </article>
              ))}
            </section>
          )}

          {printPayload.routineItems.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Rutinitas Spiritual ({printPayload.routineItems.length})
              </h2>
              {printPayload.routineItems.map((r) => (
                <article key={r.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">
                    {r.habitName} ({r.moment}{r.frequency ? ` · ${r.frequency}` : ''})
                  </p>
                  {r.realisticWay && <p>Cara realistis: {r.realisticWay}</p>}
                </article>
              ))}
            </section>
          )}

          {printPayload.finalReflections.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold border-b border-[#E2DACB] pb-1">
                Baseline &amp; Refleksi Akhir
              </h2>
              {printPayload.finalReflections.map((f) => (
                <article key={f.id} className="print-break-avoid border border-[#E2DACB] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">
                    {f.entryType === 'baseline' ? 'My Spiritual Baseline' : 'My Final Reflection & A Letter to My Future Self'}
                  </p>
                  {f.relationshipBaseline && <p className="whitespace-pre-wrap">Hubungan dengan Allah: {f.relationshipBaseline}</p>}
                  {f.worshipHabitsBaseline && <p className="whitespace-pre-wrap">Kebiasaan ibadah: {f.worshipHabitsBaseline}</p>}
                  {f.currentCondition && <p className="whitespace-pre-wrap">Kondisi diri: {f.currentCondition}</p>}
                  {f.learnedLessons && <p className="whitespace-pre-wrap">Hal paling berarti yang dipelajari: {f.learnedLessons}</p>}
                  {f.habitsToMaintain && <p className="whitespace-pre-wrap">Kebiasaan baik yang ingin dijaga: {f.habitsToMaintain}</p>}
                  {f.areasStillGrowing && <p className="whitespace-pre-wrap">Hal yang masih ingin diperbaiki: {f.areasStillGrowing}</p>}
                  {f.supportNeeded && <p className="whitespace-pre-wrap">Dukungan / sumber tepercaya: {f.supportNeeded}</p>}
                  {f.journeyIntention && <p className="whitespace-pre-wrap">Niat / langkah ke depan: {f.journeyIntention}</p>}
                  {f.letterToFutureSelf && <p className="whitespace-pre-wrap">Surat untuk diriku di masa depan: {f.letterToFutureSelf}</p>}
                </article>
              ))}
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}
