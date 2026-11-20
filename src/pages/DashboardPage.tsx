import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookHeart,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  Mail,
  MoonStar,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { EditorialLoadingState } from '../components/feedback/EditorialStates';
import { ManuscriptNotice } from '../components/feedback/ManuscriptNotice';
import { useAuth } from '../contexts/AuthContext';
import {
  GENTLE_REMINDERS,
  HOW_TO_USE_JOURNAL,
  PHASES,
  WELCOME_CONTENT,
  getNightContent,
} from '../content/journalContent';
import {
  subscribeDuaEntries,
  subscribeGratitudeEntries,
  subscribeNightEntries,
  subscribeTahajudLogs,
} from '../lib/firestore';
import {
  buildRecentActivities,
  computeDashboardStats,
  computeJourneySummary,
} from '../utils/journalLogic';
import type { DuaEntry, GratitudeEntry, NightEntry, TahajudLog } from '../types/journal';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [nightEntries, setNightEntries] = useState<NightEntry[]>([]);
  const [tahajudLogs, setTahajudLogs] = useState<TahajudLog[]>([]);
  const [duaEntries, setDuaEntries] = useState<DuaEntry[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubNights = subscribeNightEntries(
      user.uid,
      (items) => {
        setNightEntries(items);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        setLoadError('Sebagian data belum dapat dimuat dari Firestore.');
        setLoading(false);
      }
    );
    const unsubTahajud = subscribeTahajudLogs(user.uid, setTahajudLogs, () =>
      setLoadError('Sebagian data belum dapat dimuat dari Firestore.')
    );
    const unsubDua = subscribeDuaEntries(user.uid, setDuaEntries, () =>
      setLoadError('Sebagian data belum dapat dimuat dari Firestore.')
    );
    const unsubGratitude = subscribeGratitudeEntries(user.uid, setGratitudeEntries, () =>
      setLoadError('Sebagian data belum dapat dimuat dari Firestore.')
    );

    return () => {
      unsubNights();
      unsubTahajud();
      unsubDua();
      unsubGratitude();
    };
  }, [user]);

  const summary = useMemo(
    () => computeJourneySummary(nightEntries, profile?.lastOpenedNight, user?.uid),
    [nightEntries, profile?.lastOpenedNight, user?.uid]
  );

  const dashboardStats = useMemo(
    () =>
      user
        ? computeDashboardStats(user.uid, {
            nightEntries,
            tahajudLogs,
            duaEntries,
            gratitudeEntries,
          })
        : {
            completedJournalSessions: 0,
            recordedTahajudNights: 0,
            personalDuaNotes: 0,
            gratitudeNotes: 0,
          },
    [user, nightEntries, tahajudLogs, duaEntries, gratitudeEntries]
  );

  const recentActivities = useMemo(
    () =>
      user
        ? buildRecentActivities(user.uid, {
            nightEntries,
            tahajudLogs,
            duaEntries,
            gratitudeEntries,
          })
        : [],
    [user, nightEntries, tahajudLogs, duaEntries, gratitudeEntries]
  );

  const visibleActivities = showAllActivities
    ? recentActivities
    : recentActivities.slice(0, 4);

  const reminderIndex = useMemo(() => {
    const day = new Date().getDate();
    return day % GENTLE_REMINDERS.length;
  }, []);

  const nextNight =
    summary.nextIncompleteNight !== null ? getNightContent(summary.nextIncompleteNight) : undefined;
  const greetingName = profile?.displayName?.trim() ? `, ${profile.displayName.trim()}` : '';

  return (
    <AppShell>
      <div className="space-y-9">
        {/* Editorial Greeting Hero */}
        <section className="rounded-2xl bg-[#17253B] text-[#FFFDF8] p-6 sm:p-9 overflow-hidden relative shadow-[0_2px_10px_rgba(23,37,59,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B99B69] font-semibold">
                Beranda Pribadi
              </p>

              {summary.isJourneyCompleted ? (
                <>
                  <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-[#B99B69]/40 bg-[#223451] px-3 py-1.5 text-xs font-medium text-[#F3EDE1]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99B69]" aria-hidden="true" />
                    <span>Perjalanan 30 Malam Selesai</span>
                  </div>
                  <h1 className="mt-3 font-editorial text-3xl sm:text-[2.45rem] leading-[1.15] font-semibold text-[#FFFDF8]">
                    Selamat datang kembali{greetingName}.
                  </h1>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#F3EDE1]/90 max-w-2xl">
                    Tiga puluh malam refleksi telah kamu selesaikan dengan langkahmu sendiri. Semoga catatan yang tertulis tetap menjadi pengingat tenang untuk terus kembali kapan pun dibutuhkan.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-5">
                    <Link
                      to="/app/catatan/refleksi-akhir"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-lg bg-[#B99B69] text-[#17253B] text-sm font-semibold hover:bg-[#C8AD7E] transition-colors"
                    >
                      <span>Lihat Refleksi Akhir</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/app/journey"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#F3EDE1]/90 hover:text-[#FFFDF8] underline underline-offset-4 min-h-[40px]"
                    >
                      <span>Baca ulang 30 malam</span>
                    </Link>
                    <span className="text-xs text-[#F3EDE1]/80 tabular-nums">
                      Sesi journal tersimpan: 30 dari 30 selesai
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="mt-2 font-editorial text-3xl sm:text-[2.45rem] leading-[1.15] font-semibold text-[#FFFDF8]">
                    Selamat datang kembali{greetingName}.
                  </h1>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#F3EDE1]/90 max-w-2xl">
                    {GENTLE_REMINDERS[reminderIndex]}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-5">
                    <Link
                      to={`/app/journey/${summary.nextIncompleteNight ?? 1}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-lg bg-[#B99B69] text-[#17253B] text-sm font-semibold hover:bg-[#C8AD7E] transition-colors"
                    >
                      <span>
                        {summary.completedCount === 0 && summary.draftCount === 0
                          ? 'Mulai Malam 1'
                          : `Lanjutkan Perjalanan · Malam ${summary.nextIncompleteNight ?? 1}`}
                      </span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <span className="text-xs text-[#F3EDE1]/80 tabular-nums">
                      Sesi journal tersimpan: {summary.completedCount} dari 30 selesai
                      {summary.draftCount > 0 ? ` · ${summary.draftCount} draf` : ''}
                    </span>
                  </div>
                  {nextNight && (
                    <p className="mt-3.5 text-xs text-[#F3EDE1]/70">
                      Sesi berikutnya: Malam {nextNight.nightNumber} — {nextNight.title}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="hidden md:block md:col-span-4">
              <div className="rounded-xl overflow-hidden border border-[#223451] aspect-[16/10] bg-[#223451]">
                <img
                  src="/src/assets/images/journey_dawn_horizon_1794802790572.jpg"
                  alt="Buku catatan terbuka di tepi jendela saat pagi hari yang tenang"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </section>

        <ManuscriptNotice compact />

        {/* Collapsible Welcome & How-to-Use Journal */}
        <section aria-labelledby="welcome-guide-heading" className="rp-card p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setGuideOpen((prev) => !prev)}
            aria-expanded={guideOpen}
            className="w-full flex items-center justify-between gap-4 text-left min-h-[44px]"
          >
            <div>
              <p className="rp-kicker">{WELCOME_CONTENT.title}</p>
              <h2 id="welcome-guide-heading" className="mt-1 font-editorial text-xl sm:text-2xl font-semibold text-[#17253B]">
                {HOW_TO_USE_JOURNAL.title} &amp; Pesan Utama
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-[#7F6334] shrink-0 transition-transform ${guideOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {guideOpen && (
            <div className="mt-5 pt-5 border-t border-[#E2DACB] grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-[#28313C] leading-relaxed">
              <div className="space-y-3">
                {WELCOME_CONTENT.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <div className="p-4 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] space-y-1">
                  <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334]">
                    {WELCOME_CONTENT.coreMessageLabel}
                  </p>
                  <p className="font-medium text-[#17253B]">{WELCOME_CONTENT.coreMessage}</p>
                </div>
              </div>
              <div className="space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  {HOW_TO_USE_JOURNAL.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <div className="p-4 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] space-y-1">
                  <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334]">
                    {HOW_TO_USE_JOURNAL.tahajudNoteTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#4A5057]">{HOW_TO_USE_JOURNAL.tahajudNote}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {loadError && (
          <div role="alert" className="rp-alert-error">
            {loadError}
          </div>
        )}

        {/* 4 Phases Progress Cards (session completion only, never faith scoring) */}
        <section aria-labelledby="phases-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 id="phases-heading" className="font-editorial text-2xl sm:text-3xl font-semibold text-[#17253B]">
                Empat Fase Perjalanan
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                Ringkasan di bawah mencatat status pengisian journalmu, bukan penilaian kualitas ibadah.
              </p>
            </div>
            <Link
              to="/app/journey"
              className="text-sm font-medium text-[#17253B] hover:text-[#7F6334] inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Lihat seluruh 30 malam</span>
              <ArrowRight className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHASES.map((phase, idx) => {
              const stat = summary.phaseStats[idx];
              const ratio = stat.total > 0 ? Math.min(100, Math.round((stat.completed / stat.total) * 100)) : 0;
              return (
                <Link
                  key={phase.id}
                  to={`/app/journey?phase=${phase.id}`}
                  className="group rp-card p-5 sm:p-6 hover:border-[#B99B69] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5C6268] tabular-nums">
                      <span className="font-semibold text-[#7F6334] tracking-wider uppercase">
                        {phase.code}
                      </span>
                      <span>
                        Malam {phase.nightRange[0]}–{phase.nightRange[1]}
                      </span>
                    </div>
                    <h3 className="mt-2 font-editorial text-2xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                      {phase.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#28313C] leading-relaxed">{phase.theme}</p>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    <div className="h-[2px] w-full bg-[#E2DACB] overflow-hidden rounded-full" aria-hidden="true">
                      <div
                        className="h-full bg-[#B99B69] transition-[width] duration-300"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#5C6268] tabular-nums">
                      <span>
                        {stat.completed} dari {stat.total} sesi journal selesai
                      </span>
                      {stat.draft > 0 && <span className="font-medium text-[#7F6334]">{stat.draft} draf</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Ringkasan Perjalanan Saya */}
        <section aria-labelledby="journey-stats-heading">
          <div>
            <h2 id="journey-stats-heading" className="font-editorial text-2xl font-semibold text-[#17253B]">
              Ringkasan Perjalanan Saya
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5C6268] leading-relaxed">
              Catatan jumlah entri yang benar-benar tersimpan di akunmu. Statistik ini tidak mengukur kualitas iman atau membandingkan ibadahmu.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rp-card p-5 space-y-1.5">
              <p className="text-xs font-medium text-[#5C6268]">Sesi refleksi selesai</p>
              <p className="font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
                {dashboardStats.completedJournalSessions}
                <span className="text-base font-normal text-[#5C6268]"> / 30</span>
              </p>
              <p className="text-[11px] text-[#5C6268] leading-relaxed">
                Sesi journal malam yang telah ditandai selesai
              </p>
            </div>

            <div className="rp-card p-5 space-y-1.5">
              <p className="text-xs font-medium text-[#5C6268]">Malam Tahajud dicatat</p>
              <p className="font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
                {dashboardStats.recordedTahajudNights}
                <span className="text-base font-normal text-[#5C6268]"> / 30</span>
              </p>
              <p className="text-[11px] text-[#5C6268] leading-relaxed">
                Dari Tracker Ibadah Malam, terpisah dari status journal
              </p>
            </div>

            <div className="rp-card p-5 space-y-1.5">
              <p className="text-xs font-medium text-[#5C6268]">Catatan Doa Pribadi</p>
              <p className="font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
                {dashboardStats.personalDuaNotes}
              </p>
              <p className="text-[11px] text-[#5C6268] leading-relaxed">
                Tersimpan di ruang Doa Pribadi
              </p>
            </div>

            <div className="rp-card p-5 space-y-1.5">
              <p className="text-xs font-medium text-[#5C6268]">Catatan Gratitude Journal</p>
              <p className="font-editorial text-3xl font-semibold text-[#17253B] tabular-nums">
                {dashboardStats.gratitudeNotes}
              </p>
              <p className="text-[11px] text-[#5C6268] leading-relaxed">
                Tersimpan di Gratitude Journal
              </p>
            </div>
          </div>
        </section>

        {/* Post-30 Continuation Section (visible ONLY when 30/30 nights are completed) */}
        {summary.isJourneyCompleted && (
          <section
            aria-labelledby="after-thirty-heading"
            className="rounded-2xl border border-[#B99B69]/50 bg-[#F3EDE1]/65 p-6 sm:p-7 space-y-4"
          >
            <div>
              <p className="rp-kicker">Langkah Setelah 30 Malam</p>
              <h2
                id="after-thirty-heading"
                className="mt-1 font-editorial text-2xl font-semibold text-[#17253B]"
              >
                Perjalananmu Tidak Berhenti di Sini
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#4A5057] max-w-2xl leading-relaxed">
                Tiga puluh malam adalah titik temu awal untuk kebiasaan pulang yang lebih tenang. Lanjutkan merawat refleksi akhir, rutinitas kecil yang realistis, dan surat untuk dirimu di masa depan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/app/catatan/refleksi-akhir"
                className="group rp-card p-5 hover:border-[#B99B69] transition-colors flex flex-col justify-between"
              >
                <div>
                  <BookOpenCheck className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
                  <h3 className="mt-3 font-editorial text-xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                    Final Reflection
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6268] leading-relaxed">
                    Tinjau pelajaran terpenting dan bandingkan dengan titik awalmu.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F6334]">
                  <span>Buka Refleksi Akhir</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>

              <Link
                to="/app/catatan/rutinitas"
                className="group rp-card p-5 hover:border-[#B99B69] transition-colors flex flex-col justify-between"
              >
                <div>
                  <CalendarCheck2 className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
                  <h3 className="mt-3 font-editorial text-xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                    Sustainable Spiritual Routine
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6268] leading-relaxed">
                    Susun kebiasaan ibadah ringan yang realistis untuk hari-hari ke depan.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F6334]">
                  <span>Buka Rutinitas Berkelanjutan</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>

              <Link
                to="/app/catatan/refleksi-akhir#letter-to-future-self"
                className="group rp-card p-5 hover:border-[#B99B69] transition-colors flex flex-col justify-between"
              >
                <div>
                  <Mail className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
                  <h3 className="mt-3 font-editorial text-xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                    Letter to Future Self
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6268] leading-relaxed">
                    Tulis atau baca kembali surat hangat untuk dirimu di masa mendatang.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F6334]">
                  <span>Buka Surat Masa Depan</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* Shortcuts */}
        <section aria-labelledby="shortcuts-heading">
          <h2 id="shortcuts-heading" className="font-editorial text-2xl font-semibold text-[#17253B]">
            Ruang Catatan &amp; Kebiasaan
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/app/catatan/doa"
              className="group rp-card p-5 sm:p-6 hover:border-[#B99B69] transition-colors"
            >
              <BookHeart className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
              <h3 className="mt-3 font-editorial text-xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                Doa Pribadi
              </h3>
              <p className="mt-1 text-xs text-[#5C6268] tabular-nums">
                {dashboardStats.personalDuaNotes} catatan doa tersimpan
              </p>
            </Link>

            <Link
              to="/app/catatan/gratitude"
              className="group rp-card p-5 sm:p-6 hover:border-[#B99B69] transition-colors"
            >
              <Sparkles className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
              <h3 className="mt-3 font-editorial text-xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                Gratitude Journal
              </h3>
              <p className="mt-1 text-xs text-[#5C6268] tabular-nums">
                {dashboardStats.gratitudeNotes} catatan syukur
              </p>
            </Link>

            <Link
              to="/app/tracker"
              className="group rp-card p-5 sm:p-6 hover:border-[#B99B69] transition-colors"
            >
              <MoonStar className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
              <h3 className="mt-3 font-editorial text-xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                Tracker Ibadah Malam
              </h3>
              <p className="mt-1 text-xs text-[#5C6268]">
                Catatan kebiasaan netral tanpa skor
              </p>
            </Link>
          </div>
        </section>

        {/* Recent Private Activity / Empty State */}
        <section aria-labelledby="recent-heading" className="rp-card p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="recent-heading" className="font-editorial text-xl sm:text-2xl font-semibold text-[#17253B]">
                Aktivitas Terakhir
              </h2>
              <p className="mt-0.5 text-xs text-[#5C6268]">
                Diurutkan dari catatan yang paling baru diperbarui.
              </p>
            </div>
            {!loading && recentActivities.length > 0 && (
              <button
                type="button"
                aria-expanded={showAllActivities}
                onClick={() => setShowAllActivities((prev) => !prev)}
                className="text-xs sm:text-sm font-medium text-[#17253B] hover:text-[#7F6334] inline-flex items-center gap-1.5 min-h-[40px] px-2.5 rounded-lg border border-[#E2DACB] bg-[#FFFDF8]"
              >
                <span>
                  {showAllActivities
                    ? 'Tampilkan 4 Terbaru'
                    : `Lihat Semua Aktivitas (${recentActivities.length})`}
                </span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-4">
              <EditorialLoadingState label="Memuat catatan pribadimu…" blocks={1} />
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-[#28313C]">
                Belum ada catatan. Kamu bisa mulai kapan pun siap.
              </p>
              <p className="text-xs sm:text-sm text-[#5C6268] leading-relaxed">
                Mulai dari Malam 1 atau pilih malam mana pun yang paling sesuai dengan kondisimu hari ini.
              </p>
            </div>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-[#E2DACB]/80 text-sm">
                {visibleActivities.map((item) => (
                  <li key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-medium text-[#17253B] block truncate">
                        {item.title}
                      </span>
                      <span className="text-xs text-[#5C6268] block mt-0.5">
                        {item.subtitle}
                        {item.dateLabel ? ` · ${item.dateLabel}` : ''}
                      </span>
                    </div>
                    <Link
                      to={item.route}
                      className="text-xs font-semibold text-[#7F6334] hover:text-[#17253B] whitespace-nowrap min-h-[36px] inline-flex items-center px-2"
                    >
                      Buka
                    </Link>
                  </li>
                ))}
              </ul>
              {showAllActivities && recentActivities.length <= 4 && (
                <p className="mt-3 pt-3 border-t border-[#E2DACB]/60 text-xs text-[#5C6268]">
                  Seluruh {recentActivities.length} aktivitas yang tersimpan sudah ditampilkan. Kamu juga bisa menelusuri daftar lengkap di{' '}
                  <Link to="/app/journey" className="text-[#7F6334] font-medium underline underline-offset-2">
                    Peta 30 Malam
                  </Link>
                  .
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
