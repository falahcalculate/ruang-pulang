export type NightSessionStatus = 'not_started' | 'draft' | 'completed';

export type WakeStatus =
  | 'terbangun'
  | 'tidak_terbangun'
  | 'belum_dicatat'
  | 'tidak_ingin_mencatat';

export type DuaCategoryId =
  | 'hubungan-dengan-allah'
  | 'keluarga-dan-orang-tercinta'
  | 'pekerjaan-rezeki-pendidikan'
  | 'ampunan-dan-perbaikan-diri'
  | 'kebaikan-untuk-orang-lain';

export type FontSizePreference = 'normal' | 'large';
export type EntitlementStatus = 'beta_free';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  timezone: string;
  journeyStartDate: string;
  onboardingComplete: boolean;
  privacyAccepted: boolean;
  contentVersion: string;
  fontSizePreference: FontSizePreference;
  lastOpenedNight: number;
  entitlementStatus: EntitlementStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface NightEntry {
  id: string; // e.g., "night-1"
  uid: string;
  nightNumber: number;
  status: NightSessionStatus;
  reflectionAnswers: string[];
  smallActionNotes: string;
  smallActionChecks: boolean[];
  personalDua: string;
  privateNote: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface DuaEntry {
  id: string;
  uid: string;
  title: string;
  category: DuaCategoryId;
  content: string;
  date: string;
  effortNote: string;
  reflectionNote: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface DuaLog {
  id: string;
  uid: string;
  date: string;
  topic: string;
  duaText: string;
  effortSteps: string;
  reflectionGratitude: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TahajudLog {
  id: string; // e.g., "night-1"
  uid: string;
  nightIndex: number;
  date: string;
  wakeStatus: WakeStatus;
  activities: string[];
  note: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ChecklistState {
  id: string; // "night-prep"
  uid: string;
  checkedIds: string[];
  personalNote: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GratitudeEntry {
  id: string;
  uid: string;
  date: string;
  item1: string;
  item2: string;
  item3: string;
  goodDeedPlan: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface WeeklyMuhasabah {
  id: string;
  uid: string;
  weekLabel: string;
  date: string;
  gratitudeThisWeek: string;
  habitsToKeep: string;
  areasToImprove: string;
  realisticSteps: string;
  personalDua: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface RoutineItem {
  id: string;
  uid: string;
  moment: string;
  habitName: string;
  personalBenefit: string;
  realisticWay: string;
  frequency: string;
  sortOrder: number;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FinalReflection {
  id: string; // "baseline" | "final-reflection"
  uid: string;
  entryType: 'baseline' | 'final_reflection';
  relationshipBaseline: string;
  worshipHabitsBaseline: string;
  currentCondition: string;
  supportNeeded: string;
  journeyIntention: string;
  learnedLessons: string;
  habitsToMaintain: string;
  areasStillGrowing: string;
  letterToFutureSelf: string;
  contentVersion: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PhaseDefinition {
  id: string;
  phaseNumber: number;
  code: string;
  title: string;
  theme: string;
  description: string;
  focusPoints: string[];
  reminder: string;
  nightRange: [number, number];
}

export interface PhaseEvaluationContent {
  title: string;
  subtitle: string;
  questions: string[];
}

export interface NightContent {
  nightNumber: number;
  phaseId: string;
  title: string;
  theme: string;
  manuscriptStatus: 'placeholder' | 'final';
  reviewStatus: 'dalam_peninjauan' | 'terperiksa_sumber' | 'tertinjau';
  openingReflection: string;
  islamicInsight: string;
  referenceText: string;
  referenceUrl: string | null;
  reflectionQuestions: string[];
  smallActionPrompt: string;
  smallActionChecklist?: string[];
  personalDuaExample: string;
  reminderNote: string;
  phaseEvaluation?: PhaseEvaluationContent;
}

export interface UserExportPayload {
  exportedAt: string;
  app: string;
  contentVersion: string;
  uid: string;
  profile: UserProfile | null;
  nightEntries: NightEntry[];
  duaEntries: DuaEntry[];
  duaLogs: DuaLog[];
  tahajudLogs: TahajudLog[];
  checklists: ChecklistState[];
  gratitudeEntries: GratitudeEntry[];
  weeklyMuhasabah: WeeklyMuhasabah[];
  routineItems: RoutineItem[];
  finalReflections: FinalReflection[];
}
