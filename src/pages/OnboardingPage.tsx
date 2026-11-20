import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../lib/firestore';
import { BRAND_PRINCIPLES, HOW_TO_USE_JOURNAL, WELCOME_CONTENT } from '../content/journalContent';
import { getTodayIsoDate } from '../utils/journalLogic';

export function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [journeyStartDate, setJourneyStartDate] = useState(
    profile?.journeyStartDate || getTodayIsoDate()
  );
  const [privacyAccepted, setPrivacyAccepted] = useState(profile?.privacyAccepted ?? false);

  useEffect(() => {
    if (!profile) return;
    if (profile.onboardingComplete) {
      navigate('/app', { replace: true });
      return;
    }
    if (profile.displayName) setDisplayName(profile.displayName);
    if (profile.journeyStartDate) setJourneyStartDate(profile.journeyStartDate);
    if (profile.privacyAccepted) setPrivacyAccepted(profile.privacyAccepted);
  }, [profile, navigate]);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!privacyAccepted) {
      setErrorMsg('Mohon centang persetujuan catatan privasi dan disclaimer terlebih dahulu.');
      return;
    }

    setBusy(true);
    setErrorMsg(null);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        journeyStartDate: journeyStartDate || getTodayIsoDate(),
        onboardingComplete: true,
        privacyAccepted: true,
      });
      await refreshProfile();
      navigate('/app', { replace: true });
    } catch {
      setErrorMsg('Gagal menyimpan preferensi awal. Silakan coba kembali.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#28313C] py-10 px-4 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto rp-card p-6 sm:p-10">
        <p className="rp-kicker">{WELCOME_CONTENT.title}</p>
        <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B] leading-tight">
          Mulai dari tempatmu berada hari ini.
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#28313C]">
          {WELCOME_CONTENT.subtitle} {HOW_TO_USE_JOURNAL.steps[0]} {HOW_TO_USE_JOURNAL.steps[6]}
        </p>

        {errorMsg && (
          <div role="alert" className="mt-5 rp-alert-error">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          <div>
            <label
              htmlFor="onboard-name"
              className="block text-sm font-medium text-[#17253B] mb-1.5"
            >
              Nama panggilan yang nyaman digunakan (opsional)
            </label>
            <input
              id="onboard-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={120}
              placeholder="Boleh dikosongkan bila tidak ingin mengisi"
              className="rp-input"
            />
          </div>

          <div>
            <label
              htmlFor="onboard-date"
              className="block text-sm font-medium text-[#17253B] mb-1.5"
            >
              Tanggal mulai perjalanan
            </label>
            <input
              id="onboard-date"
              type="date"
              value={journeyStartDate}
              onChange={(e) => setJourneyStartDate(e.target.value)}
              className="rp-input sm:w-64"
            />
            <p className="mt-1.5 text-xs text-[#5C6268]">
              Tanggal ini hanya sebagai penanda pribadi dan dapat diubah kapan saja di pengaturan.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] space-y-2 text-xs sm:text-sm leading-relaxed text-[#28313C]">
            <p className="font-semibold text-[#17253B]">Catatan Privasi & Disclaimer</p>
            <p>{BRAND_PRINCIPLES.disclaimer}</p>
            <p className="text-[#5C6268]">
              Catatanmu tersimpan privat untuk akunmu sendiri. Meski begitu, sebaiknya hindari menuliskan detail identitas atau rahasia yang sangat sensitif yang tidak ingin kamu simpan secara digital.
            </p>
          </div>

          <label className="flex items-start gap-3.5 cursor-pointer min-h-[44px] py-1">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#17253B] rounded shrink-0"
            />
            <span className="text-sm text-[#28313C] leading-relaxed">
              Saya telah membaca catatan privasi dan memahami bahwa journal ini adalah alat bantu refleksi pribadi.
            </span>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full sm:w-auto rp-btn-primary min-h-[48px] px-6"
          >
            <span>{busy ? 'Menyimpan...' : 'Masuk ke Ruang Pulang'}</span>
            <ArrowRight className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
