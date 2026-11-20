import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, HeartHandshake, Lock, MoonStar, Sparkles } from 'lucide-react';
import {
  BRAND_PRINCIPLES,
  HOW_TO_USE_JOURNAL,
  MANUSCRIPT_STATUS_INFO,
  PHASES,
  WELCOME_CONTENT,
} from '../content/journalContent';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#28313C] flex flex-col">
      {/* Top Bar: 3-zone contract */}
      <header className="w-full border-b border-[#E2DACB] bg-[#FFFDF8]/92 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
          <Link
            to="/"
            className="font-editorial text-xl sm:text-2xl font-semibold tracking-[0.03em] text-[#17253B] whitespace-nowrap shrink-0"
          >
            RUANG PULANG
          </Link>

          <nav
            aria-label="Navigasi halaman utama"
            className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#28313C]"
          >
            <a href="#tentang" className="hover:text-[#7F6334] transition-colors whitespace-nowrap shrink-0">
              Empat Fase
            </a>
            <a href="#fitur" className="hover:text-[#7F6334] transition-colors whitespace-nowrap shrink-0">
              Fitur Journal
            </a>
            <Link to="/referensi" className="hover:text-[#7F6334] transition-colors whitespace-nowrap shrink-0">
              Panduan & Rujukan
            </Link>
            <Link
              to={user ? '/app' : '/auth?mode=login'}
              className="hover:text-[#7F6334] transition-colors whitespace-nowrap shrink-0"
            >
              {user ? 'Buka Journal' : 'Masuk'}
            </Link>
          </nav>

          <div className="shrink-0">
            <Link
              to={user ? '/app' : '/auth?mode=register'}
              className="rp-btn-primary whitespace-nowrap shrink-0"
            >
              {user ? 'Masuk ke Ruang' : 'Mulai Perjalanan'}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="rp-kicker">
                {BRAND_PRINCIPLES.subtitle} · {BRAND_PRINCIPLES.descriptor}
              </p>
              <h1 className="mt-4 font-editorial text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-[#17253B] leading-[1.1]">
                {BRAND_PRINCIPLES.tagline}
              </h1>
              <p className="mt-6 text-base sm:text-[1.125rem] leading-[1.7] text-[#28313C] max-w-xl">
                {WELCOME_CONTENT.subtitle}
              </p>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5C6268] max-w-xl italic">
                “{WELCOME_CONTENT.coreMessage}”
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
                <Link
                  to={user ? '/app' : '/auth?mode=register'}
                  className="rp-btn-primary min-h-[48px] px-6"
                >
                  <span>{user ? 'Lanjutkan di Ruang Pulang' : 'Mulai Perjalanan'}</span>
                  <ArrowRight className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
                </Link>
                {!user && (
                  <Link
                    to="/auth?mode=login"
                    className="rp-btn-secondary min-h-[48px] px-6"
                  >
                    Masuk
                  </Link>
                )}
              </div>

              <div className="mt-9 pt-6 border-t border-[#DFD5C2] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5C6268]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#28313C]">
                  <Lock className="w-3.5 h-3.5 text-[#7F6334]" aria-hidden="true" />
                  Privat per akun
                </span>
                <span aria-hidden="true">·</span>
                <span>Tanpa skor iman atau penilaian</span>
                <span aria-hidden="true">·</span>
                <span>Tanpa analisis AI atas doamu</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#DFD5C2] bg-[#EFE7D8] shadow-[0_2px_12px_rgba(23,37,59,0.06)] relative">
                <img
                  src="/src/assets/images/hero_dawn_arch_1794802790161.jpg"
                  alt="Lengkungan arsitektur batu kapur hangat menghadap langit fajar yang tenang"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Philosophy & How to Use Journal */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <article className="lg:col-span-6 rp-card p-6 sm:p-8 space-y-4">
              <p className="rp-kicker">{BRAND_PRINCIPLES.secondaryTitle}</p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#17253B]">
                {WELCOME_CONTENT.title}
              </h2>
              <div className="space-y-3 text-sm sm:text-[0.9375rem] leading-[1.8] text-[#28313C]">
                {WELCOME_CONTENT.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="pt-3 border-t border-[#E2DACB] space-y-1">
                <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334]">
                  {WELCOME_CONTENT.coreMessageLabel}
                </p>
                <p className="text-sm font-medium text-[#17253B] leading-relaxed">
                  {WELCOME_CONTENT.coreMessage}
                </p>
              </div>
            </article>

            <article className="lg:col-span-6 rp-card p-6 sm:p-8 space-y-4">
              <p className="rp-kicker">Panduan Pembaca</p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#17253B]">
                {HOW_TO_USE_JOURNAL.title}
              </h2>
              <ol className="space-y-2.5 text-sm text-[#28313C] leading-relaxed list-decimal list-inside">
                {HOW_TO_USE_JOURNAL.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="p-4 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] space-y-1">
                <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334]">
                  {HOW_TO_USE_JOURNAL.tahajudNoteTitle}
                </p>
                <p className="text-xs sm:text-sm text-[#28313C] leading-relaxed">
                  {HOW_TO_USE_JOURNAL.tahajudNote}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Four Phases */}
        <section id="tentang" className="bg-[#FFFDF8] border-y border-[#E2DACB] py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="max-w-2xl">
              <p className="rp-kicker">Alur Perjalanan 30 Malam</p>
              <h2 className="mt-2.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
                Empat fase untuk melangkah dengan tenang
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#5C6268]">
                Setiap malam dapat dibuka kapan pun tanpa penguncian hari dan tanpa rasa bersalah bila ada malam yang terlewat.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PHASES.map((phase) => (
                <article
                  key={phase.id}
                  className="p-6 rounded-2xl bg-[#F3EDE1]/55 border border-[#DFD5C2] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#7F6334] font-semibold tabular-nums">
                      <span>{phase.code}</span>
                      <span>
                        Malam {phase.nightRange[0]}–{phase.nightRange[1]}
                      </span>
                    </div>
                    <h3 className="mt-3 font-editorial text-2xl font-semibold text-[#17253B]">
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium text-[#28313C]">{phase.theme}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#5C6268]">
                      {phase.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Summary */}
        <section id="fitur" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl">
            <p className="rp-kicker">Ruang Refleksi Lengkap</p>
            <h2 className="mt-2.5 font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
              Dirancang untuk ketenangan, bukan tuntutan
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Compass,
                title: '30 Malam Guided Journal',
                desc: 'Pertanyaan refleksi terstruktur, ruang renungan, langkah kecil realistis, dan doa pribadi dengan autosave otomatis.',
              },
              {
                icon: BookOpen,
                title: 'Panduan Dasar Tahajud',
                desc: 'Bacaan pengantar ibadah malam serta checklist persiapan tidur yang dapat dipakai berulang kali.',
              },
              {
                icon: HeartHandshake,
                title: 'Doa Pribadi & My Dua Log',
                desc: 'Simpan doa dalam lima kategori bersama catatan ikhtiar dan syukur tanpa indikator pengabulan yang menghakimi.',
              },
              {
                icon: MoonStar,
                title: 'Tracker Ibadah Malam Netral',
                desc: 'Pencatat kebiasaan 30 malam tanpa skor iman, tanpa warna merah/hijau moral, dan tanpa penalti.',
              },
              {
                icon: Sparkles,
                title: 'Gratitude & Weekly Muhasabah',
                desc: 'Catat tiga nikmat setiap hari, refleksi mingguan yang membangun, serta rutinitas spiritual yang realistis.',
              },
              {
                icon: Lock,
                title: 'Refleksi Akhir & Ekspor Data',
                desc: 'Bandingkan titik awalmu dengan refleksi akhir, tulis surat untuk diri di masa depan, dan ekspor catatanmu kapan saja.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rp-card p-6 sm:p-7">
                  <Icon className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
                  <h3 className="mt-4 font-editorial text-xl sm:text-[1.35rem] font-semibold text-[#17253B]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C6268]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Disclaimer & Manuscript Review Principles */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
          <div className="rp-card p-6 sm:p-8 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-[#17253B]">
                Prinsip Penggunaan & Status Peninjauan
              </h2>
              <span className="text-xs font-semibold text-[#7F6334]">
                {MANUSCRIPT_STATUS_INFO.versionLabel}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#17253B] bg-[#EFE7D8]/70 border border-[#DFD5C2] rounded-lg px-3.5 py-2.5">
              {MANUSCRIPT_STATUS_INFO.publicStatusNotice}
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#5C6268]">
              {MANUSCRIPT_STATUS_INFO.auditSummary}
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#5C6268]">
              {MANUSCRIPT_STATUS_INFO.statusDokumen}
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#28313C] list-disc list-inside">
              {MANUSCRIPT_STATUS_INFO.prinsipPenggunaan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pt-2 border-t border-[#E2DACB] text-xs sm:text-sm leading-relaxed text-[#5C6268]">
              Catatan refleksi, doa, dan log ibadahmu disimpan secara privat pada akunmu sendiri dan tidak pernah dikirimkan ke layanan AI untuk dinilai atau ditafsirkan.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2DACB] bg-[#FFFDF8] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5C6268]">
          <div className="inline-flex items-center gap-2">
            <span className="font-editorial text-base font-semibold text-[#17253B]">
              RUANG PULANG
            </span>
            <span aria-hidden="true">·</span>
            <span>The Comeback Journal</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/referensi" className="hover:text-[#17253B] underline-offset-4 hover:underline py-1">
              Panduan &amp; Daftar Rujukan
            </Link>
            <Link to="/privacy" className="hover:text-[#17253B] underline-offset-4 hover:underline py-1">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="hover:text-[#17253B] underline-offset-4 hover:underline py-1">
              Ketentuan Penggunaan
            </Link>
            <Link to="/auth?mode=login" className="hover:text-[#17253B] underline-offset-4 hover:underline py-1">
              Masuk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
