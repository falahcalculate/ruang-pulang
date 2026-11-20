import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { clearAllLocalDrafts } from '../utils/journalLogic';

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim().slice(0, 120) });
  }
  try {
    await sendEmailVerification(credential.user);
  } catch {
    // Verification email failure should not block account access in preview
  }
  return credential.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function loginWithGoogle(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function sendResetEmail(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function resendVerificationEmail(user: User): Promise<void> {
  await sendEmailVerification(user);
}

export async function logoutUser(): Promise<void> {
  clearAllLocalDrafts();
  await signOut(auth);
}

export async function reauthenticateCurrentUser(password?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Tidak ada sesi pengguna yang aktif.');
  }
  const hasPasswordProvider = user.providerData.some((p) => p.providerId === 'password');
  if (hasPasswordProvider) {
    if (!password || !user.email) {
      throw new Error('auth/requires-recent-login');
    }
    const cred = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, cred);
    return;
  }
  await reauthenticateWithPopup(user, googleProvider);
}

export async function deleteCurrentAuthUser(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Tidak ada sesi pengguna yang aktif.');
  }
  await deleteUser(auth.currentUser);
  clearAllLocalDrafts();
}
