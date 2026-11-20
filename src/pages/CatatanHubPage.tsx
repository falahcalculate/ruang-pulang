import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookHeart,
  CalendarHeart,
  CheckSquare,
  ListChecks,
  NotebookPen,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { SUPPORTING_PAGES_HUB_INTRO } from '../content/supportingPages';

const CATATAN_ITEMS = [
  {
    to: '/app/catatan/doa',
    title: 'Doa Pribadi (Personal Dua Journal)',
    description:
      'Kumpulkan doa pribadimu dalam lima kategori yang terstruktur dan mudah dicari kembali.',
    icon: BookHeart,
  },
  {
    to: '/app/catatan/dua-log',
    title: 'My Dua Log',
    description:
      'Catat doa berdasarkan tanggal beserta ikhtiar dan rasa syukur yang menyertainya.',
    icon: NotebookPen,
  },
  {
    to: '/app/catatan/gratitude',
    title: 'Gratitude Journal',
    description:
      'Tuliskan tiga hal yang kamu syukuri dan satu cara menggunakan nikmat tersebut untuk kebaikan.',
    icon: Sparkles,
  },
  {
    to: '/app/catatan/muhasabah',
    title: 'Weekly Muhasabah',
    description:
      'Ruang evaluasi mingguan yang lembut dan membangun, bukan untuk menghakimi diri sendiri.',
    icon: CalendarHeart,
  },
  {
    to: '/app/catatan/rutinitas',
    title: 'Rutinitas Spiritual Berkelanjutan',
    description:
      'Susun kebiasaan ibadah ringan sesuai momen harianmu agar tetap realistis dijaga.',
    icon: ListChecks,
  },
  {
    to: '/app/catatan/checklist',
    title: 'Night Preparation Checklist',
    description:
      'Daftar persiapan sebelum tidur yang bisa digunakan berulang kali untuk membantu istirahat dan niat malam.',
    icon: CheckSquare,
  },
  {
    to: '/app/catatan/refleksi-akhir',
    title: 'Baseline, Refleksi Akhir & Surat Masa Depan',
    description:
      'Catat titik awalmu, tinjau perjalanan 30 malam, dan tulis surat pengingat untuk dirimu sendiri.',
    icon: ScrollText,
  },
];

export function CatatanHubPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2.5">
          <p className="rp-kicker">{SUPPORTING_PAGES_HUB_INTRO.title}</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#17253B]">
            Catatan Pribadi &amp; Muhasabah
          </h1>
          <p className="text-sm sm:text-base text-[#28313C] max-w-2xl leading-relaxed">
            {SUPPORTING_PAGES_HUB_INTRO.subtitle} {SUPPORTING_PAGES_HUB_INTRO.helper}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATATAN_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group rp-card p-6 hover:border-[#B99B69] transition-colors flex flex-col justify-between"
              >
                <div>
                  <Icon className="w-5 h-5 text-[#B99B69]" aria-hidden="true" />
                  <h2 className="mt-3 font-editorial text-2xl font-semibold text-[#17253B] group-hover:text-[#7F6334] transition-colors">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C6268]">
                    {item.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E2DACB]/70 flex items-center justify-between text-xs font-medium text-[#17253B]">
                  <span>Buka halaman</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#B99B69] group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
