import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { AppShell } from '../layout/AppShell';
import { useAuth } from '../../contexts/AuthContext';
import { POLICY_DRAFT_STATUS_NOTE, type LegalPolicyDocument } from '../../content/legalPolicies';

interface PolicyDocumentViewProps {
  document: LegalPolicyDocument;
}

export function PolicyDocumentView({ document: doc }: PolicyDocumentViewProps) {
  const { user, profile } = useAuth();
  const isAuthenticatedAppUser = Boolean(user && profile?.onboardingComplete);

  const siblingLink =
    doc.id === 'privacy'
      ? {
          to: isAuthenticatedAppUser ? '/app/terms' : '/terms',
          label: 'Baca Ketentuan Penggunaan',
        }
      : {
          to: isAuthenticatedAppUser ? '/app/privacy' : '/privacy',
          label: 'Baca Kebijakan Privasi',
        };

  const primaryBackLink = isAuthenticatedAppUser
    ? { to: '/app', label: 'Kembali ke Beranda Aplikasi' }
    : { to: '/', label: 'Kembali ke Halaman Depan' };

  const secondaryBackLink = isAuthenticatedAppUser
    ? { to: '/app/profil', label: 'Pengaturan & Privasi Akun' }
    : { to: '/auth?mode=login', label: 'Kembali ke Halaman Masuk' };

  const body = (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Navigation */}
      <nav
        aria-label="Navigasi halaman kebijakan"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <Link
          to={primaryBackLink.to}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#5C6268] hover:text-[#17253B] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
          <span>{primaryBackLink.label}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
          <Link
            to={secondaryBackLink.to}
            className="font-medium text-[#5C6268] hover:text-[#17253B] underline-offset-4 hover:underline min-h-[44px] inline-flex items-center"
          >
            {secondaryBackLink.label}
          </Link>
          <Link
            to={siblingLink.to}
            className="font-medium text-[#7F6334] hover:text-[#17253B] inline-flex items-center gap-1 min-h-[44px]"
          >
            <span>{siblingLink.label}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* Document Header */}
      <header className="space-y-3 pb-6 border-b border-[#DFD5C2]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#7F6334] font-semibold tracking-wider uppercase">
          {doc.id === 'privacy' ? (
            <ShieldCheck className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
          ) : (
            <FileText className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
          )}
          <span>{doc.kicker}</span>
          <span aria-hidden="true" className="text-[#B99B69]">·</span>
          <span>RUANG PULANG</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B] leading-tight">
          {doc.title}
        </h1>

        <p className="text-xs sm:text-sm font-medium text-[#5C6268]">
          {doc.lastUpdated}
        </p>

        <div className="pt-2 space-y-3 max-w-[65ch] text-sm sm:text-[0.9375rem] leading-[1.8] text-[#28313C]">
          {doc.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>

      {/* Quick Section Index */}
      <section aria-labelledby="policy-toc-heading" className="rp-card p-5 sm:p-6 space-y-3">
        <h2
          id="policy-toc-heading"
          className="text-xs tracking-[0.14em] uppercase font-semibold text-[#7F6334]"
        >
          Daftar Isi
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-[#28313C]">
          {doc.sections.map((section) => (
            <li key={section.number}>
              <a
                href={`#bagian-${section.number}`}
                className="inline-flex items-baseline gap-2 py-1 hover:text-[#7F6334] transition-colors"
              >
                <span className="font-semibold text-[#7F6334] tabular-nums shrink-0">
                  {section.number}.
                </span>
                <span className="underline-offset-4 hover:underline">{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Document Sections */}
      <div className="space-y-5">
        {doc.sections.map((section) => (
          <section
            key={section.number}
            id={`bagian-${section.number}`}
            aria-labelledby={`section-heading-${section.number}`}
            className="rp-card p-6 sm:p-8 space-y-4 scroll-mt-20"
          >
            <h2
              id={`section-heading-${section.number}`}
              className="font-editorial text-2xl sm:text-[1.65rem] font-semibold text-[#17253B] leading-snug"
            >
              <span className="text-[#7F6334] mr-2 tabular-nums">{section.number}.</span>
              {section.title}
            </h2>

            <div className="space-y-4 max-w-[65ch] text-sm sm:text-[0.9375rem] leading-[1.8] text-[#28313C]">
              {section.blocks.map((block, idx) => (
                <div key={idx} className="space-y-3">
                  {block.subheading && (
                    <h3 className="text-sm font-semibold text-[#17253B] pt-1">
                      {block.subheading}
                    </h3>
                  )}

                  {block.paragraphs?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}

                  {block.bullets && block.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-5 space-y-1.5 text-[#28313C]">
                      {block.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {block.afterBulletsParagraphs?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}

                  {block.externalLink && (
                    <p className="pt-1">
                      <a
                        href={block.externalLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#7F6334] hover:text-[#17253B] underline underline-offset-4 break-all"
                      >
                        <span>{block.externalLink.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Document Status Note (Soft Sage / Warm Ivory editorial callout) */}
      <div className="rounded-2xl bg-[#E8EAE3]/70 border border-[#C6CBC0] p-5 text-xs sm:text-sm text-[#28313C] leading-relaxed">
        {POLICY_DRAFT_STATUS_NOTE}
      </div>

      {/* Bottom Return Navigation */}
      <footer className="pt-4 border-t border-[#DFD5C2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link to={primaryBackLink.to} className="rp-btn-primary w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
          <span>{primaryBackLink.label}</span>
        </Link>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to={siblingLink.to} className="rp-btn-secondary w-full sm:w-auto">
            <span>{siblingLink.label}</span>
            <ArrowRight className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </div>
  );

  if (isAuthenticatedAppUser) {
    return <AppShell>{body}</AppShell>;
  }

  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#28313C] flex flex-col">
      <header className="w-full border-b border-[#E2DACB] bg-[#FFFDF8]/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-editorial text-xl font-semibold tracking-[0.03em] text-[#17253B] whitespace-nowrap"
          >
            RUANG PULANG
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link to="/privacy" className="text-[#5C6268] hover:text-[#17253B] py-2">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="text-[#5C6268] hover:text-[#17253B] py-2">
              Ketentuan
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-8">{body}</main>
    </div>
  );
}
