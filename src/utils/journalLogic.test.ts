import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildExportPayload,
  buildRecentActivities,
  computeDashboardStats,
  computeJourneySummary,
  computeNightStatus,
  computeTrackerSummary,
  extractTimestampMs,
  getFriendlyAuthError,
  getLocalDraftKey,
  isValidDocumentId,
  sanitizeBoundedText,
  sortByDateDesc,
  sortRoutineItems,
} from './journalLogic';
import {
  CONTENT_VERSION,
  HOW_TO_USE_JOURNAL,
  MANUSCRIPT_STATUS_INFO,
  NIGHTS,
  PHASES,
  WELCOME_CONTENT,
  getNightContent,
  getPhaseForNight,
} from '../content/journalContent';
import {
  FINAL_REFLECTION_CONTENT,
  GENTLE_GOODBYE_CONTENT,
  LETTER_TO_FUTURE_SELF_CONTENT,
  NIGHT_PREP_CHECKLIST_ITEMS,
  SPIRITUAL_BASELINE_CONTENT,
  SUSTAINABLE_ROUTINE_CONTENT,
  TAHAJUD_INTRO_GUIDE,
  WEEKLY_MUHASABAH_CONTENT,
} from '../content/supportingPages';
import { PRODUCTION_REVIEW_NOTES, REFERENCE_ENTRIES, REFERENCES_NOTICE } from '../content/references';
import {
  POLICY_DRAFT_STATUS_NOTE,
  PRIVACY_POLICY_DOCUMENT,
  TERMS_OF_USE_DOCUMENT,
} from '../content/legalPolicies';
import type { DuaEntry, GratitudeEntry, NightEntry, RoutineItem, TahajudLog } from '../types/journal';

test('computeNightStatus never auto-completes empty or draft entries', () => {
  assert.equal(computeNightStatus(undefined), 'not_started');
  assert.equal(
    computeNightStatus({
      reflectionAnswers: ['', ''],
      smallActionNotes: '',
      smallActionChecks: [false],
      personalDua: '',
      privateNote: '',
    }),
    'not_started'
  );
  assert.equal(
    computeNightStatus({
      reflectionAnswers: ['Hari ini saya mulai menulis.'],
      smallActionNotes: '',
      smallActionChecks: [],
      personalDua: '',
      privateNote: '',
    }),
    'draft'
  );
  assert.equal(
    computeNightStatus(
      {
        reflectionAnswers: ['Sudah diisi'],
      },
      true
    ),
    'completed'
  );
  assert.equal(
    computeNightStatus(
      {
        status: 'completed',
        reflectionAnswers: ['Sudah diisi'],
      },
      false
    ),
    'draft'
  );
});

test('computeJourneySummary counts journal session states accurately across 4 phases', () => {
  const entries: NightEntry[] = [
    {
      id: 'night-1',
      uid: 'u1',
      nightNumber: 1,
      status: 'completed',
      reflectionAnswers: ['Selesai malam 1'],
      smallActionNotes: '',
      smallActionChecks: [],
      personalDua: '',
      privateNote: '',
      contentVersion: '0.1.0-scaffold',
    },
    {
      id: 'night-8',
      uid: 'u1',
      nightNumber: 8,
      status: 'draft',
      reflectionAnswers: ['Draf malam 8'],
      smallActionNotes: '',
      smallActionChecks: [],
      personalDua: '',
      privateNote: '',
      contentVersion: '0.1.0-scaffold',
    },
  ];

  const summary = computeJourneySummary(entries, 1);
  assert.equal(summary.completedCount, 1);
  assert.equal(summary.draftCount, 1);
  assert.equal(summary.notStartedCount, 28);
  assert.equal(summary.phaseStats[0].completed, 1);
  assert.equal(summary.phaseStats[1].draft, 1);
  assert.equal(summary.suggestedNextNight, 2);
});

test('30 nights are arranged accurately in 4 phases with complete master manuscript v1.1 content and zero placeholders', () => {
  assert.equal(CONTENT_VERSION, '1.1-audit-sumber');
  assert.equal(
    MANUSCRIPT_STATUS_INFO.publicStatusNotice,
    'Materi diperiksa berdasarkan sumber rujukan; bukan fatwa atau pengesahan lembaga/ulama. Panduan fikih bersifat pengantar.'
  );
  assert.equal(
    REFERENCES_NOTICE.publicStatusNotice,
    'Materi diperiksa berdasarkan sumber rujukan; bukan fatwa atau pengesahan lembaga/ulama. Panduan fikih bersifat pengantar.'
  );
  assert.equal(PHASES.length, 4);
  assert.deepEqual(
    PHASES.map((p) => p.nightRange),
    [
      [1, 7],
      [8, 14],
      [15, 21],
      [22, 30],
    ]
  );
  assert.deepEqual(
    PHASES.map((p) => p.title),
    ['REALIZE', 'RETURN', 'RECONNECT', 'REMAIN']
  );
  assert.equal(NIGHTS.length, 30);

  const placeholderRegex = /Menunggu Naskah|Menunggu Opening|Menunggu Islamic|Konten belum tersedia|Menunggu naskah sumber|lorem|ipsum/i;

  assert.equal(placeholderRegex.test(WELCOME_CONTENT.paragraphs.join(' ')), false);
  assert.equal(placeholderRegex.test(HOW_TO_USE_JOURNAL.steps.join(' ')), false);
  assert.equal(placeholderRegex.test(MANUSCRIPT_STATUS_INFO.statusDokumen), false);

  for (let i = 1; i <= 30; i++) {
    const night = NIGHTS[i - 1];
    assert.equal(night.nightNumber, i);
    assert.equal(night.manuscriptStatus, 'final');
    assert.equal(night.reviewStatus, 'terperiksa_sumber');
    assert.ok(night.title.trim().length > 0);
    assert.ok(night.theme.trim().length > 0);
    assert.ok(night.openingReflection.trim().length > 40);
    assert.ok(night.islamicInsight.trim().length > 40);
    assert.ok(night.referenceText.trim().length > 5);
    assert.equal(night.reflectionQuestions.length, 3);
    assert.ok(night.smallActionPrompt.trim().length > 10);
    assert.ok(night.personalDuaExample.trim().length > 10);
    assert.ok(night.reminderNote.trim().length > 10);
    assert.equal(night.referenceUrl, null);

    const combined = [
      night.title,
      night.theme,
      night.openingReflection,
      night.islamicInsight,
      night.referenceText,
      ...night.reflectionQuestions,
      night.smallActionPrompt,
      night.personalDuaExample,
      night.reminderNote,
    ].join(' ');
    assert.equal(placeholderRegex.test(combined), false);

    const expectedPhase = getPhaseForNight(i);
    assert.ok(expectedPhase);
    assert.equal(night.phaseId, expectedPhase.id);
  }

  // Verify v1.1 source-audit revisions across modified nights
  assert.match(getNightContent(9)?.islamicInsight ?? '', /Sahih al-Bukhari 6534/);
  assert.match(getNightContent(9)?.referenceText ?? '', /Riyadhus Shalihin/);
  assert.match(getNightContent(10)?.islamicInsight ?? '', /bukan terjemahan langsung QS\. At-Tahrim ayat 8/);
  assert.match(getNightContent(10)?.referenceText ?? '', /Sahih al-Bukhari 6534/);
  assert.match(getNightContent(13)?.islamicInsight ?? '', /Sahih al-Bukhari nomor 6465/);
  assert.equal(getNightContent(13)?.referenceText, 'Rujukan: Sahih al-Bukhari 6464–6465.');
  assert.match(getNightContent(15)?.islamicInsight ?? '', /perintah kepada Nabi Muhammad/);
  assert.match(getNightContent(16)?.islamicInsight ?? '', /Sahih Muslim 749a adalah hadis tentang salat malam secara umum/);
  assert.match(getNightContent(16)?.referenceText ?? '', /Tata Cara Shalat Tahajud: Niat, Rakaat, Bacaan Surat, dan Doanya/);
  assert.match(getNightContent(17)?.islamicInsight ?? '', /penerapan reflektif, bukan rincian hukum fikih/);
  assert.match(getNightContent(27)?.islamicInsight ?? '', /Sahih al-Bukhari nomor 6465/);
  assert.equal(getNightContent(27)?.referenceText, 'Rujukan: Sahih al-Bukhari 6464–6465.');

  // Spot-check key nights & phase evaluations from master manuscript
  assert.equal(getNightContent(1)?.title, 'The First Step');
  assert.equal(getNightContent(10)?.title, 'Sincere Repentance');
  assert.equal(getNightContent(14)?.phaseEvaluation?.title, 'My Return Reflection');
  assert.equal(getNightContent(14)?.phaseEvaluation?.questions.length, 4);
  assert.equal(getNightContent(16)?.title, 'Learning Tahajjud');
  assert.ok((getNightContent(17)?.smallActionChecklist?.length ?? 0) >= 5);
  assert.equal(getNightContent(21)?.phaseEvaluation?.title, 'My Night Reflection');
  assert.equal(getNightContent(21)?.phaseEvaluation?.questions.length, 4);
  assert.equal(getNightContent(30)?.title, 'Keep Coming Back');
  assert.equal(getNightContent(30)?.phaseEvaluation?.title, 'My Commitment to Keep Returning');
  assert.equal(getNightContent(30)?.phaseEvaluation?.questions.length, 4);

  // Supporting pages & references verification
  assert.equal(SPIRITUAL_BASELINE_CONTENT.sections.length, 4);
  assert.equal(TAHAJUD_INTRO_GUIDE.tataCaraDasar.length, 6);
  assert.equal(NIGHT_PREP_CHECKLIST_ITEMS.length, 7);
  assert.equal(WEEKLY_MUHASABAH_CONTENT.prompts.length, 5);
  assert.ok(SUSTAINABLE_ROUTINE_CONTENT.title.length > 0);
  assert.ok(FINAL_REFLECTION_CONTENT.prompts.trustedSupport.length > 0);
  assert.ok(LETTER_TO_FUTURE_SELF_CONTENT.salutation.length > 0);
  assert.equal(GENTLE_GOODBYE_CONTENT.closingCallout, 'KEEP COMING BACK.');

  // v1.1 references: 18 Al-Qur'an + 6 Hadis + 5 Fikih/Penjelasan = 29 entries with valid URLs
  assert.equal(REFERENCE_ENTRIES.length, 29);
  assert.equal(REFERENCE_ENTRIES.filter((r) => r.group === 'quran').length, 18);
  assert.equal(REFERENCE_ENTRIES.filter((r) => r.group === 'hadis').length, 6);
  assert.equal(REFERENCE_ENTRIES.filter((r) => r.group === 'fikih').length, 5);
  for (const ref of REFERENCE_ENTRIES) {
    assert.ok(ref.url && ref.url.startsWith('https://'), `Expected https URL for ${ref.id}`);
    assert.equal(ref.status, 'terperiksa_sumber');
  }
  assert.equal(REFERENCES_NOTICE.reviewLabel, 'Audit Sumber v1.1 · 16 November 2026');
  assert.equal(PRODUCTION_REVIEW_NOTES.checklist.length, 8);
  assert.match(PRODUCTION_REVIEW_NOTES.statusAkhir, /Versi editorial 1\.1/);
});

test('journal session completion is completely independent from tahajud activity logs', () => {
  // User logs Tahajud on night 5 & 16, but has 0 completed night journal sessions
  const tahajudLogs: TahajudLog[] = [
    {
      id: 'night-5',
      uid: 'u1',
      nightIndex: 5,
      date: '2026-11-15',
      wakeStatus: 'terbangun',
      activities: ['tahajud', 'witir', 'doa'],
      note: 'Alhamdulillah',
      contentVersion: '0.1.0-scaffold',
    },
    {
      id: 'night-16',
      uid: 'u1',
      nightIndex: 16,
      date: '2026-11-16',
      wakeStatus: 'tidak_terbangun',
      activities: [],
      note: '',
      contentVersion: '0.1.0-scaffold',
    },
  ];
  const emptyNightEntries: NightEntry[] = [];

  const journey = computeJourneySummary(emptyNightEntries, 5);
  const tracker = computeTrackerSummary(tahajudLogs);

  assert.equal(journey.completedCount, 0);
  assert.equal(journey.draftCount, 0);
  assert.equal(tracker.recordedNights, 2);
  assert.equal(tracker.awakeLoggedCount, 1);

  // Completing journal session 5 does not mutate or create tahajud logs
  const completedEntries: NightEntry[] = [
    {
      id: 'night-5',
      uid: 'u1',
      nightNumber: 5,
      status: 'completed',
      reflectionAnswers: ['Refleksi malam 5'],
      smallActionNotes: '',
      smallActionChecks: [],
      personalDua: '',
      privateNote: '',
      contentVersion: '0.1.0-scaffold',
    },
  ];
  const trackerAfterJournal = computeTrackerSummary([]);
  assert.equal(computeJourneySummary(completedEntries).completedCount, 1);
  assert.equal(trackerAfterJournal.recordedNights, 0);
});

test('computeTrackerSummary records neutral counts without moral scoring', () => {
  const logs: TahajudLog[] = [
    {
      id: 'night-1',
      uid: 'u1',
      nightIndex: 1,
      date: '2026-11-15',
      wakeStatus: 'terbangun',
      activities: ['tahajud', 'doa'],
      note: 'Tenang',
      contentVersion: '0.1.0-scaffold',
    },
    {
      id: 'night-2',
      uid: 'u1',
      nightIndex: 2,
      date: '2026-11-16',
      wakeStatus: 'tidak_terbangun',
      activities: [],
      note: '',
      contentVersion: '0.1.0-scaffold',
    },
    {
      id: 'night-3',
      uid: 'u1',
      nightIndex: 3,
      date: '',
      wakeStatus: 'belum_dicatat',
      activities: [],
      note: '',
      contentVersion: '0.1.0-scaffold',
    },
  ];

  const summary = computeTrackerSummary(logs);
  assert.equal(summary.recordedNights, 2);
  assert.equal(summary.awakeLoggedCount, 1);
  assert.equal(summary.recordedActivitiesCount, 2);
});

test('buildExportPayload strictly isolates records belonging to current uid', () => {
  const payload = buildExportPayload('user-a', {
    profile: {
      uid: 'user-b',
      displayName: 'Wrong User',
      email: 'b@example.com',
      timezone: 'Asia/Jakarta',
      journeyStartDate: '2026-11-15',
      onboardingComplete: true,
      privacyAccepted: true,
      contentVersion: '0.1.0-scaffold',
      fontSizePreference: 'normal',
      lastOpenedNight: 1,
      entitlementStatus: 'beta_free',
    },
    nightEntries: [],
    duaEntries: [
      {
        id: 'd1',
        uid: 'user-a',
        title: 'Doa Pribadi A',
        category: 'hubungan-dengan-allah',
        content: 'Ya Allah...',
        date: '2026-11-15',
        effortNote: '',
        reflectionNote: '',
        contentVersion: '0.1.0-scaffold',
      },
      {
        id: 'd2',
        uid: 'user-b',
        title: 'Doa Pribadi B',
        category: 'hubungan-dengan-allah',
        content: 'Rahasia B',
        date: '2026-11-15',
        effortNote: '',
        reflectionNote: '',
        contentVersion: '0.1.0-scaffold',
      },
    ],
    duaLogs: [],
    tahajudLogs: [],
    checklists: [],
    gratitudeEntries: [],
    weeklyMuhasabah: [],
    routineItems: [],
    finalReflections: [],
  });

  assert.equal(payload.profile, null);
  assert.equal(payload.duaEntries.length, 1);
  assert.equal(payload.duaEntries[0].uid, 'user-a');
});

test('sortByDateDesc, sortRoutineItems, and getLocalDraftKey behave deterministically', () => {
  const dated = sortByDateDesc([
    { id: 'a', date: '2026-11-10' },
    { id: 'b', date: '2026-11-15' },
    { id: 'c', date: '2026-11-15' },
  ]);
  assert.deepEqual(
    dated.map((x) => x.id),
    ['c', 'b', 'a']
  );

  const routines: RoutineItem[] = [
    { id: 'r2', uid: 'u', moment: 'Subuh', habitName: 'B', personalBenefit: '', realisticWay: '', frequency: 'Harian', sortOrder: 1, contentVersion: '1' },
    { id: 'r1', uid: 'u', moment: 'Subuh', habitName: 'A', personalBenefit: '', realisticWay: '', frequency: 'Harian', sortOrder: 1, contentVersion: '1' },
    { id: 'r0', uid: 'u', moment: 'Subuh', habitName: 'C', personalBenefit: '', realisticWay: '', frequency: 'Harian', sortOrder: 0, contentVersion: '1' },
  ];
  assert.deepEqual(
    sortRoutineItems(routines).map((r) => r.id),
    ['r0', 'r1', 'r2']
  );

  assert.notEqual(getLocalDraftKey('user-a', 1), getLocalDraftKey('user-b', 1));
});

test('sanitizeBoundedText and isValidDocumentId enforce firestore rules constraints', () => {
  assert.equal(sanitizeBoundedText('abcdef', 4), 'abcd');
  assert.equal(isValidDocumentId('night-1'), true);
  assert.equal(isValidDocumentId('bad/id'), false);
  assert.equal(isValidDocumentId('a'.repeat(129)), false);
});

test('getFriendlyAuthError maps auth/operation-not-allowed clearly', () => {
  const msg = getFriendlyAuthError('Firebase: Error (auth/operation-not-allowed).');
  assert.match(msg, /Email & Kata Sandi belum diaktifkan/i);
});

function makeNightEntry(
  uid: string,
  nightNumber: number,
  status: 'completed' | 'draft' | 'not_started',
  updatedAt?: unknown
): NightEntry {
  return {
    id: `night-${nightNumber}`,
    uid,
    nightNumber,
    status,
    reflectionAnswers: status === 'not_started' ? [] : [`Refleksi malam ${nightNumber}`],
    smallActionNotes: '',
    smallActionChecks: [],
    personalDua: '',
    privateNote: '',
    contentVersion: CONTENT_VERSION,
    updatedAt,
  };
}

test('Scenario 1 (29/30): directs to genuinely incomplete night and never marks 30/30 complete', () => {
  // Case A: Nights 1..29 completed, Night 30 not started
  const twentyNine = Array.from({ length: 29 }, (_, idx) =>
    makeNightEntry('user-a', idx + 1, 'completed', new Date(2026, 10, 1, idx + 1))
  );
  const summaryA = computeJourneySummary(twentyNine, 29, 'user-a');
  assert.equal(summaryA.completedCount, 29);
  assert.equal(summaryA.remainingNights, 1);
  assert.equal(summaryA.isJourneyCompleted, false);
  assert.equal(summaryA.nextIncompleteNight, 30);

  // Case B: Night 14 is incomplete while Night 30 is completed and lastOpenedNight=30
  const missingMiddle = Array.from({ length: 30 }, (_, idx) => idx + 1)
    .filter((n) => n !== 14)
    .map((n) => makeNightEntry('user-a', n, 'completed'));
  missingMiddle.push(makeNightEntry('user-a', 14, 'draft'));

  const summaryB = computeJourneySummary(missingMiddle, 30, 'user-a');
  assert.equal(summaryB.completedCount, 29);
  assert.equal(summaryB.draftCount, 1);
  assert.equal(summaryB.isJourneyCompleted, false);
  assert.equal(summaryB.nextIncompleteNight, 14);
});

test('Scenario 2 (30/30): marks journey completed, clears nextIncompleteNight, and preserves independent stats', () => {
  const allThirty = Array.from({ length: 30 }, (_, idx) =>
    makeNightEntry('user-a', idx + 1, 'completed', new Date(2026, 10, 1 + idx))
  );
  // Add an entry for user-b that must be ignored
  allThirty.push(makeNightEntry('user-b', 1, 'completed'));

  const summary = computeJourneySummary(allThirty, 30, 'user-a');
  assert.equal(summary.completedCount, 30);
  assert.equal(summary.remainingNights, 0);
  assert.equal(summary.isJourneyCompleted, true);
  assert.equal(summary.nextIncompleteNight, null);

  const tahajudLogs: TahajudLog[] = [
    {
      id: 'night-1',
      uid: 'user-a',
      nightIndex: 1,
      date: '2026-11-10',
      wakeStatus: 'terbangun',
      activities: ['tahajud'],
      note: '',
      contentVersion: CONTENT_VERSION,
    },
    {
      id: 'night-2',
      uid: 'user-a',
      nightIndex: 2,
      date: '2026-11-11',
      wakeStatus: 'tidak_terbangun',
      activities: [],
      note: '',
      contentVersion: CONTENT_VERSION,
    },
    {
      id: 'night-3',
      uid: 'user-a',
      nightIndex: 3,
      date: '',
      wakeStatus: 'belum_dicatat',
      activities: [],
      note: '',
      contentVersion: CONTENT_VERSION,
    },
    {
      id: 'night-4',
      uid: 'user-b',
      nightIndex: 4,
      date: '2026-11-12',
      wakeStatus: 'terbangun',
      activities: ['tahajud'],
      note: 'User B log',
      contentVersion: CONTENT_VERSION,
    },
  ];

  const duaEntries: DuaEntry[] = [
    {
      id: 'd1',
      uid: 'user-a',
      title: 'Doa 1',
      category: 'hubungan-dengan-allah',
      content: 'Ya Allah',
      date: '2026-11-12',
      effortNote: '',
      reflectionNote: '',
      contentVersion: CONTENT_VERSION,
    },
    {
      id: 'd2',
      uid: 'user-b',
      title: 'Doa B',
      category: 'hubungan-dengan-allah',
      content: 'Milik B',
      date: '2026-11-12',
      effortNote: '',
      reflectionNote: '',
      contentVersion: CONTENT_VERSION,
    },
  ];

  const gratitudeEntries: GratitudeEntry[] = [
    {
      id: 'g1',
      uid: 'user-a',
      date: '2026-11-12',
      item1: 'Kesehatan',
      item2: 'Ketenangan',
      item3: 'Keluarga',
      goodDeedPlan: 'Bersedekah',
      contentVersion: CONTENT_VERSION,
    },
    {
      id: 'g2',
      uid: 'user-a',
      date: '2026-11-13',
      item1: 'Tidur cukup',
      item2: 'Pagi sejuk',
      item3: 'Sahabat',
      goodDeedPlan: 'Menyapa orang tua',
      contentVersion: CONTENT_VERSION,
    },
  ];

  const stats = computeDashboardStats('user-a', {
    nightEntries: allThirty,
    tahajudLogs,
    duaEntries,
    gratitudeEntries,
  });

  assert.equal(stats.completedJournalSessions, 30);
  // Only 2 recorded logs for user-a (night-3 is belum_dicatat/empty, night-4 belongs to user-b)
  assert.equal(stats.recordedTahajudNights, 2);
  assert.equal(stats.personalDuaNotes, 1);
  assert.equal(stats.gratitudeNotes, 2);

  // Empty user defaults cleanly to 0 across every metric
  const emptyStats = computeDashboardStats('empty-user', {
    nightEntries: allThirty,
    tahajudLogs,
    duaEntries,
    gratitudeEntries,
  });
  assert.deepEqual(emptyStats, {
    completedJournalSessions: 0,
    recordedTahajudNights: 0,
    personalDuaNotes: 0,
    gratitudeNotes: 0,
  });
});

test('buildRecentActivities sorts newest-first by updatedAt/createdAt/date without mutating records or mixing users', () => {
  assert.equal(extractTimestampMs({ toMillis: () => 1763200000000 }), 1763200000000);
  assert.equal(extractTimestampMs({ seconds: 1763200000, nanoseconds: 500000000 }), 1763200000500);
  assert.equal(extractTimestampMs(null), null);

  const night1 = makeNightEntry('user-a', 1, 'completed', { toMillis: () => 1000 });
  const night15 = makeNightEntry('user-a', 15, 'completed', { seconds: 5, nanoseconds: 0 }); // 5000 ms
  const night30 = makeNightEntry('user-a', 30, 'completed', new Date(9000));
  const night2NotStarted = makeNightEntry('user-a', 2, 'not_started', new Date(99999));
  const nightOtherUser = makeNightEntry('user-b', 29, 'completed', new Date(999999));

  const duaNewest: DuaEntry = {
    id: 'dua-new',
    uid: 'user-a',
    title: 'Doa Hati Tenang',
    category: 'hubungan-dengan-allah',
    content: 'Ya Rabb...',
    date: '2026-11-10',
    effortNote: '',
    reflectionNote: '',
    contentVersion: CONTENT_VERSION,
    updatedAt: 12000,
  };

  const gratMid: GratitudeEntry = {
    id: 'grat-mid',
    uid: 'user-a',
    date: '2026-11-16',
    item1: 'Nikmat iman',
    item2: 'Kesempatan pulang',
    item3: 'Waktu luang',
    goodDeedPlan: 'Doa untuk teman',
    contentVersion: CONTENT_VERSION,
    createdAt: 7000,
  };

  const tahajudLatest: TahajudLog = {
    id: 'night-28',
    uid: 'user-a',
    nightIndex: 28,
    date: '2026-11-17',
    wakeStatus: 'terbangun',
    activities: ['tahajud'],
    note: '',
    contentVersion: CONTENT_VERSION,
    updatedAt: 15000,
  };

  const activities = buildRecentActivities('user-a', {
    nightEntries: [night1, night15, night30, night2NotStarted, nightOtherUser],
    duaEntries: [duaNewest],
    gratitudeEntries: [gratMid],
    tahajudLogs: [tahajudLatest],
  });

  // Should contain 6 items for user-a (excluding not_started night 2 and user-b night 29)
  assert.deepEqual(
    activities.map((a) => a.id),
    ['tahajud-night-28', 'dua-dua-new', 'night-night-30', 'gratitude-grat-mid', 'night-night-15', 'night-night-1']
  );

  // Top 4 slice starts with newest activity, never Nights 1-4 ascending
  assert.deepEqual(
    activities.slice(0, 4).map((a) => a.id),
    ['tahajud-night-28', 'dua-dua-new', 'night-night-30', 'gratitude-grat-mid']
  );
});

test('Privacy Policy and Terms of Use contain full sections, valid update date, and no fabricated contact email', () => {
  assert.equal(PRIVACY_POLICY_DOCUMENT.title, 'Kebijakan Privasi RUANG PULANG');
  assert.equal(PRIVACY_POLICY_DOCUMENT.lastUpdated, 'Terakhir diperbarui: 19 November 2026');
  assert.equal(PRIVACY_POLICY_DOCUMENT.sections.length, 10);

  assert.equal(TERMS_OF_USE_DOCUMENT.title, 'Ketentuan Penggunaan RUANG PULANG');
  assert.equal(TERMS_OF_USE_DOCUMENT.lastUpdated, 'Terakhir diperbarui: 19 November 2026');
  assert.equal(TERMS_OF_USE_DOCUMENT.sections.length, 12);

  const combinedText = JSON.stringify([
    PRIVACY_POLICY_DOCUMENT,
    TERMS_OF_USE_DOCUMENT,
    POLICY_DRAFT_STATUS_NOTE,
  ]);

  assert.match(combinedText, /Email bantuan akan diperbarui kemudian/i);
  assert.match(combinedText, /https:\/\/firebase\.google\.com\/support\/privacy/);
  assert.match(combinedText, /Mas Alif/);
  assert.equal(/@/.test(combinedText), false, 'Policy text must not invent any fake contact email address');
});


