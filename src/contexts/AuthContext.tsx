import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ensureUserProfile } from '../lib/firestore';
import type { UserProfile } from '../types/journal';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  authLoading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  setLocalProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  authLoading: true,
  profileLoading: false,
  profileError: null,
  refreshProfile: async () => {},
  setLocalProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfileForUser = useCallback(async (firebaseUser: User) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const loaded = await ensureUserProfile(firebaseUser);
      setProfile(loaded);
    } catch {
      setProfileError(
        'Belum dapat memuat profil dari Firestore. Pastikan koneksi stabil dan aturan keamanan sudah aktif.'
      );
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        void loadProfileForUser(firebaseUser);
      } else {
        setProfile(null);
        setProfileLoading(false);
        setProfileError(null);
      }
    });
    return () => unsubscribe();
  }, [loadProfileForUser]);

  useEffect(() => {
    if (profile?.fontSizePreference === 'large') {
      document.documentElement.classList.add('text-scale-large');
    } else {
      document.documentElement.classList.remove('text-scale-large');
    }
  }, [profile?.fontSizePreference]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfileForUser(user);
    }
  }, [user, loadProfileForUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authLoading,
        profileLoading,
        profileError,
        refreshProfile,
        setLocalProfile: setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
