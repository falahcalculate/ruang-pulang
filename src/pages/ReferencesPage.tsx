import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ManuscriptNotice } from '../components/feedback/ManuscriptNotice';
import { useAuth } from '../contexts/AuthContext';
import {
  PRODUCTION_REVIEW_NOTES,
  REFERENCE_ENTRIES,
  REFERENCES_NOTICE,
} from '../content/references';
import { TAHAJUD_INTRO_GUIDE } from '../content/supportingPages';

export function ReferencesPage() {
  const { user } = useAuth();

  const quranRefs = REFERENCE_ENTRIES.filter((r) => r.group === 'quran');
  const hadisRefs = REFERENCE_ENTRIES.filter((r) => r.group === 'hadis');
  const fikihRefs = REFERENCE_ENTRIES.filter((r) => r.group === 'fikih');

  const content = (
    <div className="max-w-3xl mx-auto space-y-9">
      {!user && (
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#5C6268] hover:text-[#17253B] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
          <span>Kembali ke halaman depan</span>
        </Link>
      )}

      <header className="space-y-2.5 pb-6 border-b border-[#DFD5C2]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#7F6334] font-semibold tracking-wider uppercase">
          <span>{REFERENCES_NOTICE.reviewLabel}</span>
          <span aria-hidden="true" className="text-[#B99B69]">·</span>
          <span>Daftar Rujukan & Bacaan</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
          Panduan Pengantar & Daftar Rujukan
        </h1>
        <p className="text-sm sm:text-base text-[#28313C] leading-relaxed max-w-2xl">
          {REFERENCES_NOTICE.explanation}
        </p>
      </header>

      <ManuscriptNotice />

      {/* Tahajud Intro Guide */}
      <section
        aria-labelledby="tahajud-guide-heading"
        className="rp-card p-6 sm:p-8 space-y-5"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#7F6334] font-semibold">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>{TAHAJUD_INTRO_GUIDE.badge}</span>
          <span aria-hidden="true" className="text-[#B99B69]">·</span>
          <span className="text-[#5C6268] font-medium">{TAHAJUD_INTRO_GUIDE.reviewStatus}</span>
        </div>
        <h2
          id="tahajud-guide-heading"
          className="font-editorial text-2xl sm:text-[1.75rem] font-semibold text-[#17253B]"
        >
          {TAHAJUD_INTRO_GUIDE.title}
        </h2>

        <div className="space-y-4 max-w-[65ch] text-sm sm:text-base leading-[1.8] text-[#28313C]">
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold text-[#7F6334] mb-1">
              Apa Itu Salat Tahajud?
            </h3>
            <p>{TAHAJUD_INTRO_GUIDE.apaItuTahajud}</p>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold text-[#7F6334] mb-1">
              Waktu Pelaksanaan
            </h3>
            <p>{TAHAJUD_INTRO_GUIDE.waktuPelaksanaan}</p>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold text-[#7F6334] mb-1.5">
              Tata Cara Dasar (Gambaran Umum)
            </h3>
            <ol className="list-decimal list-inside space-y-1.5">
              {TAHAJUD_INTRO_GUIDE.tataCaraDasar.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold text-[#7F6334] mb-1.5">
              Hal yang Perlu Diingat
            </h3>
            <ul className="list-disc list-inside space-y-1.5">
              {TAHAJUD_INTRO_GUIDE.halYangPerluDiingat.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[#E2DACB] text-xs sm:text-sm text-[#4A5057]">
            <span className="font-semibold text-[#17253B]">Rujukan Dasar: </span>
            {TAHAJUD_INTRO_GUIDE.rujukanDasar}
          </div>
        </div>
      </section>

      {/* Grouped References */}
      {[
        {
          title: "Al-Qur'an — Kementerian Agama RI",
          intro: REFERENCES_NOTICE.quranIntro,
          items: quranRefs,
        },
        {
          title: 'Hadis — Kitab primer dan rujukan teks',
          intro: REFERENCES_NOTICE.hadisIntro,
          items: hadisRefs,
        },
        {
          title: 'Fikih, tahajud, dan penjelasan taubat',
          intro: null,
          items: fikihRefs,
          footnote: REFERENCES_NOTICE.fikihNote,
        },
      ].map((group) => (
        <section key={group.title} className="space-y-3.5">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-semibold text-[#17253B]">
              {group.title}
            </h2>
            {group.intro && (
              <p className="text-xs sm:text-sm text-[#4A5057] leading-relaxed max-w-2xl">
                {group.intro}
              </p>
            )}
          </div>
          <div className="space-y-3">
            {group.items.map((ref) => (
              <article key={ref.id} className="rp-card p-5 sm:p-6 space-y-2">
                <p className="text-sm sm:text-[0.9375rem] font-medium leading-[1.75] text-[#17253B]">
                  {ref.citation}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6268]">
                  <span>{ref.contextNote}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#7F6334]">
                    {ref.status === 'terperiksa_sumber'
                      ? 'Diperiksa berdasarkan sumber rujukan (bukan fatwa)'
                      : ref.status === 'tertinjau'
                        ? 'Telah ditinjau'
                        : 'Materi dalam peninjauan'}
                  </span>
                </div>
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-medium underline underline-offset-4 text-[#7F6334] hover:text-[#17253B] py-1 break-all"
                  >
                    Buka sumber: {ref.url}
                  </a>
                )}
              </article>
            ))}
          </div>
          {group.footnote && (
            <p className="p-4 rounded-xl bg-[#EFE7D8]/60 border border-[#DFD5C2] text-xs sm:text-sm text-[#4A5057] leading-relaxed">
              {group.footnote}
            </p>
          )}
        </section>
      ))}

      {/* Production & Review Checklist */}
      <section aria-labelledby="review-notes-heading" className="rp-card p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <p className="rp-kicker">Transparansi Peninjauan</p>
          <h2 id="review-notes-heading" className="font-editorial text-2xl font-semibold text-[#17253B]">
            {PRODUCTION_REVIEW_NOTES.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6268]">
            {PRODUCTION_REVIEW_NOTES.subtitle}
          </p>
        </div>

        <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-[#28313C] leading-relaxed">
          {PRODUCTION_REVIEW_NOTES.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="p-4 rounded-xl bg-[#F3EDE1]/70 border border-[#DFD5C2] text-xs sm:text-sm text-[#28313C] leading-relaxed">
          <p className="text-[11px] tracking-widest uppercase font-semibold text-[#7F6334] mb-1">
            Status Akhir Naskah
          </p>
          <p>{PRODUCTION_REVIEW_NOTES.statusAkhir}</p>
        </div>
      </section>
    </div>
  );

  if (user) {
    return <AppShell>{content}</AppShell>;
  }

  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#28313C] py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">{content}</div>
    </div>
  );
}
