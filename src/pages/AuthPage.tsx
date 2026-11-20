import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import {
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  registerWithEmail,
  sendResetEmail,
} from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { getFriendlyAuthError } from '../utils/journalLogic';

type AuthMode = 'login' | 'register' | 'reset';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  const [mode, setMode] = useState<AuthMode>(
    initialMode === 'register' || initialMode === 'reset' ? initialMode : 'login'
  );
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const { user, profile, authLoading, profileError, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode === 'login' || paramMode === 'register' || paramMode === 'reset') {
      setMode(paramMode);
      setErrorMsg(null);
      setInfoMsg(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.onboardingComplete) {
        navigate('/app', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [authLoading, user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (mode !== 'reset' && password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(email, password, displayName);
      } else if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await sendResetEmail(email);
        setInfoMsg(
          'Tautan pengaturan ulang kata sandi telah dikirim ke emailmu. Silakan periksa kotak masuk atau folder spam.'
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(getFriendlyAuthError(msg));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(getFriendlyAuthError(msg));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE1] text-[#28313C] flex flex-col justify-center py-10 px-4">
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#5C6268] hover:text-[#17253B] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#7F6334]" aria-hidden="true" />
          <span>Kembali ke halaman depan</span>
        </Link>

        <div className="mt-2 rp-card p-6 sm:p-9">
          <p className="rp-kicker">RUANG PULANG</p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-[2.15rem] leading-tight font-semibold text-[#17253B]">
            {mode === 'login' && 'Selamat datang kembali'}
            {mode === 'register' && 'Buat ruang pribadimu'}
            {mode === 'reset' && 'Atur ulang kata sandi'}
          </h1>
          <p className="mt-2 text-sm text-[#5C6268] leading-relaxed">
            {mode === 'login' && 'Masuk untuk membuka kembali catatan dan perjalanan 30 malammu.'}
            {mode === 'register' &&
              'Mulai perjalanan dengan akun privatmu agar catatan tersimpan lintas perangkat.'}
            {mode === 'reset' && 'Masukkan email terdaftar untuk menerima tautan reset kata sandi.'}
          </p>

          {/* Mode Tabs */}
          <div
            className="mt-6 grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-[#EFE7D8] border border-[#DFD5C2]"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setInfoMsg(null);
              }}
              className={`py-2.5 px-3 text-xs font-medium rounded-lg transition-colors min-h-[44px] ${
                mode === 'login'
                  ? 'bg-[#FFFDF8] text-[#17253B] shadow-xs'
                  : 'text-[#5C6268] hover:text-[#17253B]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setInfoMsg(null);
              }}
              className={`py-2.5 px-3 text-xs font-medium rounded-lg transition-colors min-h-[44px] ${
                mode === 'register'
                  ? 'bg-[#FFFDF8] text-[#17253B] shadow-xs'
                  : 'text-[#5C6268] hover:text-[#17253B]'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {user && profileError && !profile && (
            <div role="alert" className="mt-5 rp-alert-error space-y-3">
              <p>{profileError}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void refreshProfile()}
                  className="px-3.5 py-2 min-h-[38px] rounded-lg bg-[#17253B] text-[#FFFDF8] text-xs font-medium"
                >
                  Coba Muat Profil
                </button>
                <button
                  type="button"
                  onClick={() => void logoutUser()}
                  className="px-3.5 py-2 min-h-[38px] rounded-lg border border-[#7A3528] text-xs font-medium text-[#7A3528]"
                >
                  Keluar
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div role="alert" className="mt-5 rp-alert-error">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div role="status" className="mt-5 rp-alert-sage">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="block text-xs font-medium text-[#17253B] mb-1.5"
                >
                  Nama panggilan (opsional)
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Contoh: Aisyah atau Ahmad"
                  className="rp-input"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-medium text-[#17253B] mb-1.5"
              >
                Alamat email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="nama@email.com"
                className="rp-input"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-medium text-[#17253B]"
                  >
                    Kata sandi
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        setErrorMsg(null);
                        setInfoMsg(null);
                      }}
                      className="inline-flex items-center min-h-[36px] px-1.5 -mr-1.5 text-xs font-medium text-[#7F6334] hover:text-[#17253B] underline-offset-4 hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  placeholder="Minimal 6 karakter"
                  className="rp-input"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rp-btn-primary min-h-[48px]"
            >
              <Mail className="w-4 h-4 text-[#B99B69]" aria-hidden="true" />
              <span>
                {busy
                  ? 'Memproses...'
                  : mode === 'login'
                    ? 'Masuk dengan Email'
                    : mode === 'register'
                      ? 'Daftar dengan Email'
                      : 'Kirim Tautan Reset'}
              </span>
            </button>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className="w-full py-2.5 text-xs font-medium text-[#5C6268] hover:text-[#17253B] min-h-[44px]"
              >
                Kembali ke halaman masuk
              </button>
            )}
          </form>

          {mode !== 'reset' && (
            <>
              <div className="my-6 flex items-center gap-3 text-xs text-[#5C6268]">
                <div className="h-px flex-1 bg-[#E2DACB]" />
                <span>atau</span>
                <div className="h-px flex-1 bg-[#E2DACB]" />
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={handleGoogleSignIn}
                className="w-full rp-btn-secondary min-h-[48px]"
              >
                Masuk dengan Google
              </button>
            </>
          )}

          <div className="mt-6 pt-5 border-t border-[#E2DACB] space-y-2.5 text-xs text-[#5C6268] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#7F6334] shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                Seluruh catatan jurnal dan doamu tersimpan privat di bawah akunmu melalui Firebase Authentication dan Cloud Firestore.
              </p>
            </div>
            <div className="pl-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <Link to="/privacy" className="text-[#7F6334] hover:text-[#17253B] underline underline-offset-4 py-1">
                Kebijakan Privasi
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/terms" className="text-[#7F6334] hover:text-[#17253B] underline underline-offset-4 py-1">
                Ketentuan Penggunaan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
