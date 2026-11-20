import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  FileText,
  Home,
  MoonStar,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
}

const PRIMARY_NAV = [
  { to: '/app', label: 'Beranda', icon: Home, end: true },
  { to: '/app/journey', label: 'Perjalanan', icon: Compass, end: false },
  { to: '/app/catatan', label: 'Catatan', icon: BookOpen, end: false },
  { to: '/app/tracker', label: 'Tracker', icon: MoonStar, end: false },
  { to: '/app/profil', label: 'Profil', icon: UserCircle2, end: false },
];

const CATATAN_SUBMENU = [
  { to: '/app/catatan/doa', label: 'Doa Pribadi' },
  { to: '/app/catatan/dua-log', label: 'My Dua Log' },
  { to: '/app/catatan/gratitude', label: 'Gratitude Journal' },
  { to: '/app/catatan/muhasabah', label: 'Weekly Muhasabah' },
  { to: '/app/catatan/rutinitas', label: 'Rutinitas Spiritual' },
  { to: '/app/catatan/checklist', label: 'Night Prep Checklist' },
  { to: '/app/catatan/refleksi-akhir', label: 'Refleksi Akhir' },
];

export function AppShell({ children }: AppShellProps) {
  const { profile } = useAuth();
  const location = useLocation();
  const inCatatan = location.pathname.startsWith('/app/catatan');
  const inCatatanSubpage = inCatatan && location.pathname !== '/app/catatan';

  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#28313C] flex flex-col lg:flex-row">
      {/* Desktop Editorial Left Sidebar */}
      <aside
        aria-label="Navigasi utama"
        className="no-print hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 bg-[#17253B] text-[#F3EDE1] border-r border-[#223451] min-h-screen sticky top-0 h-screen"
      >
        <div className="px-7 pt-8 pb-6 border-b border-[#223451]">
          <Link to="/app" className="block group focus-visible:outline-none">
            <span className="font-editorial text-[1.6rem] tracking-[0.04em] font-semibold text-[#FFFDF8] block leading-tight">
              RUANG PULANG
            </span>
            <span className="text-[11px] tracking-[0.18em] uppercase text-[#B99B69] mt-1.5 block">
              The Comeback Journal
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] whitespace-nowrap ${
                      isActive
                        ? 'bg-[#223451] text-[#FFFDF8] border border-[#B99B69]/25'
                        : 'text-[#F3EDE1]/80 hover:text-[#FFFDF8] hover:bg-[#223451]/60 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#B99B69] shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>

                {item.to === '/app/catatan' && inCatatan && (
                  <div className="mt-1.5 ml-6 pl-3.5 border-l border-[#2D4161] space-y-1">
                    {CATATAN_SUBMENU.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-xs transition-colors min-h-[36px] leading-5 ${
                            isActive
                              ? 'text-[#E3C897] font-semibold bg-[#223451]/70'
                              : 'text-[#F3EDE1]/75 hover:text-[#FFFDF8]'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#223451]">
            <NavLink
              to="/app/referensi"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] whitespace-nowrap ${
                  isActive
                    ? 'bg-[#223451] text-[#FFFDF8] border border-[#B99B69]/25'
                    : 'text-[#F3EDE1]/80 hover:text-[#FFFDF8] hover:bg-[#223451]/60 border border-transparent'
                }`
              }
            >
              <FileText className="w-4 h-4 text-[#B99B69] shrink-0" aria-hidden="true" />
              <span>Panduan & Rujukan</span>
            </NavLink>
          </div>
        </nav>

        <div className="px-7 py-5 border-t border-[#223451] text-xs text-[#F3EDE1]/70 space-y-1.5">
          <p className="truncate text-[#FFFDF8] font-medium">
            {profile?.displayName || profile?.email || 'Sahabat Ruang Pulang'}
          </p>
          <p>Catatan tersimpan secara privat</p>
          <div className="pt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#F3EDE1]/75">
            <Link to="/app/privacy" className="hover:text-[#FFFDF8] underline-offset-4 hover:underline">
              Kebijakan Privasi
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/app/terms" className="hover:text-[#FFFDF8] underline-offset-4 hover:underline">
              Ketentuan
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Compact Header (non-sticky so only bottom nav stays fixed) */}
      <header className="no-print lg:hidden h-12 bg-[#FFFDF8] border-b border-[#E2DACB] px-4 flex items-center justify-between">
        <Link
          to="/app"
          className="font-editorial text-lg font-semibold tracking-[0.03em] text-[#17253B] whitespace-nowrap shrink-0"
        >
          RUANG PULANG
        </Link>
        <Link
          to="/app/referensi"
          className="text-xs font-medium text-[#17253B] hover:text-[#7F6334] px-3 py-2 min-h-[44px] flex items-center whitespace-nowrap shrink-0"
        >
          Rujukan
        </Link>
      </header>

      {/* Main Content Area with generous bottom-nav clearance */}
      <main className="flex-1 min-w-0 pb-28 lg:pb-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
          {/* Mobile Catatan subpage quick bar (non-sticky so sticky budget stays tiny) */}
          {inCatatanSubpage && (
            <nav
              aria-label="Navigasi Catatan"
              className="no-print lg:hidden mb-6 -mx-4 px-4 pb-3 border-b border-[#E2DACB] flex items-center gap-2 overflow-x-auto"
            >
              <Link
                to="/app/catatan"
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[#D8CEBC] bg-[#FFFDF8] text-xs font-medium text-[#17253B] whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#7F6334]" aria-hidden="true" />
                <span>Semua Catatan</span>
              </Link>
              {CATATAN_SUBMENU.map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  className={({ isActive }) =>
                    `px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium whitespace-nowrap shrink-0 flex items-center transition-colors ${
                      isActive
                        ? 'bg-[#17253B] text-[#FFFDF8]'
                        : 'bg-[#EFE7D8]/70 text-[#28313C] hover:bg-[#EFE7D8]'
                    }`
                  }
                >
                  {sub.label}
                </NavLink>
              ))}
            </nav>
          )}
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (5 items, >=44px touch targets) */}
      <nav
        aria-label="Navigasi bawah"
        className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 h-[64px] pb-[env(safe-area-inset-bottom)] bg-[#FFFDF8]/95 backdrop-blur-sm border-t border-[#E2DACB] grid grid-cols-5 items-center"
      >
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full min-h-[44px] px-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-[#17253B] font-semibold' : 'text-[#5C6268] hover:text-[#17253B]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#B99B69]' : 'text-[#5C6268]'}`}
                    aria-hidden="true"
                  />
                  <span className="truncate max-w-full">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
