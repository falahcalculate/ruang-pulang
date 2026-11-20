import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { JourneyPage } from './pages/JourneyPage';
import { NightDetailPage } from './pages/NightDetailPage';
import { CatatanHubPage } from './pages/CatatanHubPage';
import { DuaJournalPage } from './pages/DuaJournalPage';
import { DuaLogPage } from './pages/DuaLogPage';
import { TahajudTrackerPage } from './pages/TahajudTrackerPage';
import { PreparationChecklistPage } from './pages/PreparationChecklistPage';
import { GratitudePage } from './pages/GratitudePage';
import { WeeklyMuhasabahPage } from './pages/WeeklyMuhasabahPage';
import { RoutinePage } from './pages/RoutinePage';
import { FinalReflectionPage } from './pages/FinalReflectionPage';
import { ReferencesPage } from './pages/ReferencesPage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#17253B] flex items-center justify-center p-6">
      <div className="text-center space-y-2.5">
        <p className="rp-kicker text-[#7F6334]">30-Night Tahajud &amp; Muhasabah</p>
        <p className="font-editorial text-3xl font-semibold tracking-wide">RUANG PULANG</p>
        <p className="text-sm text-[#5C6268]">Menyiapkan ruang pribadimu...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({
  children,
  allowOnboarding = false,
}: {
  children: React.ReactNode;
  allowOnboarding?: boolean;
}) {
  const { user, profile, authLoading, profileLoading, profileError, refreshProfile } = useAuth();

  if (authLoading || (user && profileLoading && !profile)) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (profileError && !profile) {
    return (
      <div className="min-h-screen bg-[#F3EDE1] flex items-center justify-center p-6">
        <div className="max-w-md w-full rp-card p-6 sm:p-8 space-y-4 text-center">
          <h1 className="font-editorial text-2xl font-semibold text-[#17253B]">
            Kendala Memuat Akun
          </h1>
          <p className="text-sm text-[#5C6268] leading-relaxed">{profileError}</p>
          <button
            type="button"
            onClick={() => void refreshProfile()}
            className="rp-btn-primary w-full sm:w-auto"
          >
            Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (!allowOnboarding && profile && !profile.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/referensi" element={<ReferencesPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowOnboarding>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/journey"
            element={
              <ProtectedRoute>
                <JourneyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/journey/:nightId"
            element={
              <ProtectedRoute>
                <NightDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan"
            element={
              <ProtectedRoute>
                <CatatanHubPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/doa"
            element={
              <ProtectedRoute>
                <DuaJournalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/dua-log"
            element={
              <ProtectedRoute>
                <DuaLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/gratitude"
            element={
              <ProtectedRoute>
                <GratitudePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/muhasabah"
            element={
              <ProtectedRoute>
                <WeeklyMuhasabahPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/rutinitas"
            element={
              <ProtectedRoute>
                <RoutinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/checklist"
            element={
              <ProtectedRoute>
                <PreparationChecklistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/catatan/refleksi-akhir"
            element={
              <ProtectedRoute>
                <FinalReflectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/tracker"
            element={
              <ProtectedRoute>
                <TahajudTrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/referensi"
            element={
              <ProtectedRoute>
                <ReferencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/profil"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/privacy"
            element={
              <ProtectedRoute>
                <PrivacyPolicyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/terms"
            element={
              <ProtectedRoute>
                <TermsOfUsePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
