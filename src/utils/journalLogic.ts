import type {
  NightEntry,
  NightSessionStatus,
  RoutineItem,
  TahajudLog,
  UserExportPayload,
} from '../types/journal';
import { CONTENT_VERSION, PHASES, getNightContent } from '../content/journalContent';
import type { DuaEntry, GratitudeEntry } from '../types/journal';

export function isEntryContentPopulated(entry: Partial<NightEntry>): boolean {
  const hasAnswer = (entry.reflectionAnswers ?? []).some((a) => a.trim().length > 0);
  const hasActionNotes = (entry.smallActionNotes ?? '').trim().length > 0;
  const hasActionChecks = (entry.smallActionChecks ?? []).some(Boolean);
  const hasDua = (entry.personalDua ?? '').trim().length > 0;
  const hasNote = (entry.privateNote ?? '').trim().length > 0;
  return hasAnswer || hasActionNotes || hasActionChecks || hasDua || hasNote;
}

/**
 * Computes night session status without ever marking a session complete automatically.
 * Opening a night leaves status as 'not_started' until content is written or explicitly marked completed.
 */
export function computeNightStatus(
  entry: Partial<NightEntry> | undefined,
  explicitComplete?: boolean
): NightSessionStatus {
  if (explicitComplete === true) {
    return 'completed';
  }
  if (explicitComplete === false) {
    return entry && isEntryContentPopulated(entry) ? 'draft' : 'not_started';
  }
  if (entry?.status === 'completed') {
    return 'completed';
  }
  if (entry && isEntryContentPopulated(entry)) {
    return 'draft';
  }
  return 'not_started';
}

export function getNightStatusLabel(status: NightSessionStatus): string {
  switch (status) {
    case 'completed':
      return 'Sesi selesai';
    case 'draft':
      return 'Ada draf';
    case 'not_started':
    default:
      return 'Belum dimulai';
  }
}

export interface JourneySummary {
  completedCount: number;
  draftCount: number;
  notStartedCount: number;
  totalNights: number;
  remainingNights: number;
  isJourneyCompleted: boolean;
  nextIncompleteNight: number | null;
  phaseStats: Array<{
    phaseId: string;
    completed: number;
    draft: number;
    total: number;
  }>;
  suggestedNextNight: number;
}

export function computeJourneySummary(
  entries: NightEntry[],
  lastOpenedNight?: number,
  uid?: string
): JourneySummary {
  const scopedEntries = uid ? entries.filter((e) => e.uid === uid) : entries;
  const byNight = new Map<number, NightEntry>();
  for (const e of scopedEntries) {
    byNight.set(e.nightNumber, e);
  }

  let completedCount = 0;
  let draftCount = 0;

  for (let n = 1; n <= 30; n++) {
    const status = computeNightStatus(byNight.get(n));
    if (status === 'completed') completedCount++;
    else if (status === 'draft') draftCount++;
  }

  const phaseStats = PHASES.map((phase) => {
    let completed = 0;
    let draft = 0;
    const total = phase.nightRange[1] - phase.nightRange[0] + 1;
    for (let n = phase.nightRange[0]; n <= phase.nightRange[1]; n++) {
      const status = computeNightStatus(byNight.get(n));
      if (status === 'completed') completed++;
      else if (status === 'draft') draft++;
    }
    return { phaseId: phase.id, completed, draft, total };
  });

  const isJourneyCompleted = completedCount === 30;
  let nextIncompleteNight: number | null = null;

  if (!isJourneyCompleted) {
    if (
      lastOpenedNight &&
      lastOpenedNight >= 1 &&
      lastOpenedNight <= 30 &&
      computeNightStatus(byNight.get(lastOpenedNight)) !== 'completed'
    ) {
      nextIncompleteNight = lastOpenedNight;
    } else {
      const firstOpen = Array.from({ length: 30 }, (_, idx) => idx + 1).find(
        (n) => computeNightStatus(byNight.get(n)) !== 'completed'
      );
      nextIncompleteNight = firstOpen ?? 1;
    }
  }

  return {
    completedCount,
    draftCount,
    notStartedCount: 30 - completedCount - draftCount,
    totalNights: 30,
    remainingNights: 30 - completedCount,
    isJourneyCompleted,
    nextIncompleteNight,
    phaseStats,
    suggestedNextNight: nextIncompleteNight ?? 30,
  };
}

export interface DashboardStats {
  completedJournalSessions: number;
  recordedTahajudNights: number;
  personalDuaNotes: number;
  gratitudeNotes: number;
}

export function computeDashboardStats(
  uid: string,
  data: {
    nightEntries: NightEntry[];
    tahajudLogs: TahajudLog[];
    duaEntries: DuaEntry[];
    gratitudeEntries: GratitudeEntry[];
  }
): DashboardStats {
  const journey = computeJourneySummary(data.nightEntries, undefined, uid);
  const userTahajud = data.tahajudLogs.filter((item) => item.uid === uid);
  const tracker = computeTrackerSummary(userTahajud);
  const userDua = data.duaEntries.filter((item) => item.uid === uid);
  const userGratitude = data.gratitudeEntries.filter((item) => item.uid === uid);

  return {
    completedJournalSessions: journey.completedCount,
    recordedTahajudNights: tracker.recordedNights,
    personalDuaNotes: userDua.length,
    gratitudeNotes: userGratitude.length,
  };
}

export type RecentActivityType = 'night' | 'dua' | 'gratitude' | 'tahajud';

export interface RecentActivityItem {
  id: string;
  type: RecentActivityType;
  title: string;
  subtitle: string;
  route: string;
  timestampMs: number;
  dateLabel: string;
}

export function extractTimestampMs(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Date.parse(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (typeof value === 'object') {
    const obj = value as {
      toMillis?: () => number;
      seconds?: number;
      nanoseconds?: number;
      _seconds?: number;
      _nanoseconds?: number;
    };
    if (typeof obj.toMillis === 'function') {
      const ms = obj.toMillis();
      return Number.isFinite(ms) ? ms : null;
    }
    const sec = typeof obj.seconds === 'number' ? obj.seconds : obj._seconds;
    if (typeof sec === 'number' && Number.isFinite(sec)) {
      const nano =
        typeof obj.nanoseconds === 'number'
          ? obj.nanoseconds
          : typeof obj._nanoseconds === 'number'
            ? obj._nanoseconds
            : 0;
      return sec * 1000 + Math.floor(nano / 1_000_000);
    }
  }

  return null;
}

function resolveRecordTimestampMs(record: {
  updatedAt?: unknown;
  createdAt?: unknown;
  date?: string;
}): number {
  return (
    extractTimestampMs(record.updatedAt) ??
    extractTimestampMs(record.createdAt) ??
    extractTimestampMs(record.date) ??
    0
  );
}

function formatActivityDateLabel(timestampMs: number, fallbackDate?: string): string {
  if (timestampMs > 0) {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(timestampMs));
    } catch {
      return fallbackDate ?? '';
    }
  }
  return fallbackDate ?? '';
}

export function buildRecentActivities(
  uid: string,
  data: {
    nightEntries: NightEntry[];
    tahajudLogs: TahajudLog[];
    duaEntries: DuaEntry[];
    gratitudeEntries: GratitudeEntry[];
  }
): RecentActivityItem[] {
  const items: RecentActivityItem[] = [];

  for (const entry of data.nightEntries) {
    if (entry.uid !== uid) continue;
    const status = computeNightStatus(entry);
    if (status === 'not_started') continue;
    const content = getNightContent(entry.nightNumber);
    const timestampMs = resolveRecordTimestampMs(entry);
    items.push({
      id: `night-${entry.id || entry.nightNumber}`,
      type: 'night',
      title: `Malam ${entry.nightNumber}: ${content?.title ?? `Malam ${entry.nightNumber}`}`,
      subtitle: `Refleksi Malam · ${getNightStatusLabel(status)}`,
      route: `/app/journey/${entry.nightNumber}`,
      timestampMs,
      dateLabel: formatActivityDateLabel(timestampMs),
    });
  }

  for (const dua of data.duaEntries) {
    if (dua.uid !== uid) continue;
    const timestampMs = resolveRecordTimestampMs(dua);
    items.push({
      id: `dua-${dua.id}`,
      type: 'dua',
      title: dua.title?.trim() || 'Catatan Doa Pribadi',
      subtitle: 'Doa Pribadi',
      route: '/app/catatan/doa',
      timestampMs,
      dateLabel: formatActivityDateLabel(timestampMs, dua.date),
    });
  }

  for (const grat of data.gratitudeEntries) {
    if (grat.uid !== uid) continue;
    const timestampMs = resolveRecordTimestampMs(grat);
    const preview = grat.item1?.trim();
    items.push({
      id: `gratitude-${grat.id}`,
      type: 'gratitude',
      title: preview
        ? `Syukur: ${preview.length > 64 ? `${preview.slice(0, 64)}…` : preview}`
        : 'Catatan Gratitude Journal',
      subtitle: 'Gratitude Journal',
      route: '/app/catatan/gratitude',
      timestampMs,
      dateLabel: formatActivityDateLabel(timestampMs, grat.date),
    });
  }

  for (const log of data.tahajudLogs) {
    if (log.uid !== uid) continue;
    const isRecorded =
      log.wakeStatus !== 'belum_dicatat' ||
      log.activities.length > 0 ||
      log.note.trim().length > 0;
    if (!isRecorded) continue;
    const timestampMs = resolveRecordTimestampMs(log);
    items.push({
      id: `tahajud-${log.id || log.nightIndex}`,
      type: 'tahajud',
      title: `Tracker Malam ${log.nightIndex}`,
      subtitle: 'Tracker Ibadah Malam',
      route: '/app/tracker',
      timestampMs,
      dateLabel: formatActivityDateLabel(timestampMs, log.date),
    });
  }

  return items.sort((a, b) => {
    const diff = b.timestampMs - a.timestampMs;
    if (diff !== 0) return diff;
    return b.id.localeCompare(a.id);
  });
}

export interface NeutralTrackerSummary {
  recordedNights: number;
  recordedActivitiesCount: number;
  awakeLoggedCount: number;
}

/**
 * Neutral habit counter only. Never computes faith scores, moral ratings, or punitive streaks.
 */
export function computeTrackerSummary(logs: TahajudLog[]): NeutralTrackerSummary {
  let recordedNights = 0;
  let recordedActivitiesCount = 0;
  let awakeLoggedCount = 0;

  for (const log of logs) {
    const hasActivity = log.activities.length > 0;
    const isRecorded = log.wakeStatus !== 'belum_dicatat' || hasActivity || log.note.trim().length > 0;
    if (isRecorded) {
      recordedNights++;
    }
    if (log.wakeStatus === 'terbangun') {
      awakeLoggedCount++;
    }
    recordedActivitiesCount += log.activities.length;
  }

  return {
    recordedNights,
    recordedActivitiesCount,
    awakeLoggedCount,
  };
}

export function sanitizeBoundedText(value: string, maxLength: number): string {
  const trimmed = value ?? '';
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

export function isValidDocumentId(id: string): boolean {
  return id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildExportPayload(
  uid: string,
  data: Omit<UserExportPayload, 'exportedAt' | 'app' | 'contentVersion' | 'uid'>
): UserExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    app: 'RUANG PULANG — The Comeback Journal',
    contentVersion: CONTENT_VERSION,
    uid,
    profile: data.profile && data.profile.uid === uid ? data.profile : null,
    nightEntries: data.nightEntries.filter((item) => item.uid === uid),
    duaEntries: data.duaEntries.filter((item) => item.uid === uid),
    duaLogs: data.duaLogs.filter((item) => item.uid === uid),
    tahajudLogs: data.tahajudLogs.filter((item) => item.uid === uid),
    checklists: data.checklists.filter((item) => item.uid === uid),
    gratitudeEntries: data.gratitudeEntries.filter((item) => item.uid === uid),
    weeklyMuhasabah: data.weeklyMuhasabah.filter((item) => item.uid === uid),
    routineItems: data.routineItems.filter((item) => item.uid === uid),
    finalReflections: data.finalReflections.filter((item) => item.uid === uid),
  };
}

export function sortByDateDesc<T extends { date: string; id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const cmp = (b.date || '').localeCompare(a.date || '');
    if (cmp !== 0) return cmp;
    return (b.id || '').localeCompare(a.id || '');
  });
}

export function sortRoutineItems(items: RoutineItem[]): RoutineItem[] {
  return [...items].sort((a, b) => {
    const diff = a.sortOrder - b.sortOrder;
    if (diff !== 0) return diff;
    return (a.id || '').localeCompare(b.id || '');
  });
}

export function getLocalDraftKey(uid: string, nightNumber: number): string {
  return `rp_draft_${uid}_${nightNumber}`;
}

export function clearAllLocalDrafts(): void {
  const clearFrom = (storage: Storage | undefined) => {
    if (!storage) return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith('rp_draft_')) {
          keysToRemove.push(key);
        }
      }
      for (const k of keysToRemove) {
        storage.removeItem(k);
      }
    } catch {
      // ignore storage errors
    }
  };
  clearFrom(typeof window !== 'undefined' ? window.localStorage : undefined);
  clearFrom(typeof window !== 'undefined' ? window.sessionStorage : undefined);
}

export function getFriendlyAuthError(codeOrMessage: string): string {
  const code = codeOrMessage.toLowerCase();
  if (code.includes('auth/invalid-email')) {
    return 'Format alamat email belum tepat. Mohon periksa kembali emailmu.';
  }
  if (code.includes('auth/user-not-found') || code.includes('auth/wrong-password') || code.includes('auth/invalid-credential')) {
    return 'Email atau kata sandi belum sesuai. Silakan periksa kembali atau gunakan fitur lupa kata sandi.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'Email ini sudah terdaftar. Silakan masuk menggunakan akun yang sudah ada.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Kata sandi sebaiknya terdiri dari minimal 6 karakter agar akunmu tetap aman.';
  }
  if (code.includes('auth/operation-not-allowed')) {
    return 'Metode masuk dengan Email & Kata Sandi belum diaktifkan di Firebase Console untuk proyek ini. Pemilik proyek perlu mengaktifkan Email/Password pada menu Authentication > Sign-in method, atau silakan gunakan Masuk dengan Google.';
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return 'Jendela masuk Google ditutup sebelum selesai. Kamu bisa mencobanya lagi kapan saja.';
  }
  if (code.includes('auth/popup-blocked')) {
    return 'Popup masuk Google diblokir oleh browser. Mohon izinkan popup untuk situs ini dan coba kembali.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Terlalu banyak percobaan dalam waktu singkat. Mohon tunggu beberapa saat sebelum mencoba lagi.';
  }
  if (code.includes('auth/requires-recent-login')) {
    return 'Demi keamanan akunmu, silakan keluar lalu masuk kembali sebelum melakukan penghapusan akun.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Koneksi internet terganggu. Periksa jaringanmu lalu coba kembali.';
  }
  return 'Terjadi kendala saat memproses permintaan akun. Silakan coba beberapa saat lagi.';
}
