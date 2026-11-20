import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from './firebase';
import { KeyedWriteQueue } from './writeQueue';
import { CONTENT_VERSION } from '../content/journalContent';
import {
  getTodayIsoDate,
  isValidDocumentId,
  sanitizeBoundedText,
  sortByDateDesc,
  sortRoutineItems,
} from '../utils/journalLogic';
import type {
  ChecklistState,
  DuaEntry,
  DuaLog,
  FinalReflection,
  GratitudeEntry,
  NightEntry,
  RoutineItem,
  TahajudLog,
  UserExportPayload,
  UserProfile,
  WeeklyMuhasabah,
} from '../types/journal';

const documentWriteQueue = new KeyedWriteQueue();

function userDocRef(uid: string) {
  return doc(db, 'users', uid);
}

function userSubcollection(uid: string, sub: string) {
  return collection(db, 'users', uid, sub);
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const path = `users/${user.uid}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = userDocRef(user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }

      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: sanitizeBoundedText(user.displayName ?? '', 120),
        email: sanitizeBoundedText(user.email ?? '', 254),
        timezone: 'Asia/Jakarta',
        journeyStartDate: getTodayIsoDate(),
        onboardingComplete: false,
        privacyAccepted: false,
        contentVersion: CONTENT_VERSION,
        fontSizePreference: 'normal',
        lastOpenedNight: 1,
        entitlementStatus: 'beta_free',
      };

      await setDoc(ref, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const created = await getDoc(ref);
      return (created.data() as UserProfile) ?? newProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<
    Pick<
      UserProfile,
      | 'displayName'
      | 'email'
      | 'timezone'
      | 'journeyStartDate'
      | 'onboardingComplete'
      | 'privacyAccepted'
      | 'fontSizePreference'
      | 'lastOpenedNight'
    >
  >
): Promise<void> {
  const path = `users/${uid}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const cleanPatch: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };
      if (patch.displayName !== undefined) {
        cleanPatch.displayName = sanitizeBoundedText(patch.displayName, 120);
      }
      if (patch.email !== undefined) {
        cleanPatch.email = sanitizeBoundedText(patch.email, 254);
      }
      if (patch.timezone !== undefined) {
        cleanPatch.timezone = sanitizeBoundedText(patch.timezone, 64) || 'Asia/Jakarta';
      }
      if (patch.journeyStartDate !== undefined) {
        cleanPatch.journeyStartDate = sanitizeBoundedText(patch.journeyStartDate, 32) || getTodayIsoDate();
      }
      if (patch.onboardingComplete !== undefined) {
        cleanPatch.onboardingComplete = Boolean(patch.onboardingComplete);
      }
      if (patch.privacyAccepted !== undefined) {
        cleanPatch.privacyAccepted = Boolean(patch.privacyAccepted);
      }
      if (patch.fontSizePreference !== undefined) {
        cleanPatch.fontSizePreference = patch.fontSizePreference === 'large' ? 'large' : 'normal';
      }
      if (patch.lastOpenedNight !== undefined) {
        cleanPatch.lastOpenedNight = Math.min(30, Math.max(1, Math.round(patch.lastOpenedNight)));
      }
      await updateDoc(userDocRef(uid), cleanPatch);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  });
}

// --- Night Entries ---
export function subscribeNightEntries(
  uid: string,
  onData: (items: NightEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/nightEntries`;
  const q = query(userSubcollection(uid, 'nightEntries'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<NightEntry, 'id'>),
      }));
      onData(list);
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveNightEntry(
  uid: string,
  entry: Omit<NightEntry, 'id' | 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const nightId = `night-${entry.nightNumber}`;
  if (!isValidDocumentId(nightId)) throw new Error('Invalid night identifier');
  const path = `users/${uid}/nightEntries/${nightId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'nightEntries', nightId);
      const snap = await getDoc(ref);
      const boundedAnswers = (entry.reflectionAnswers ?? [])
        .slice(0, 10)
        .map((a) => sanitizeBoundedText(a, 4000));
      const boundedChecks = (entry.smallActionChecks ?? []).slice(0, 15).map(Boolean);

      const fields = {
        status: entry.status,
        reflectionAnswers: boundedAnswers,
        smallActionNotes: sanitizeBoundedText(entry.smallActionNotes ?? '', 4000),
        smallActionChecks: boundedChecks,
        personalDua: sanitizeBoundedText(entry.personalDua ?? '', 5000),
        privateNote: sanitizeBoundedText(entry.privateNote ?? '', 5000),
        contentVersion: sanitizeBoundedText(entry.contentVersion || CONTENT_VERSION, 32),
      };

      if (snap.exists()) {
        await updateDoc(ref, {
          ...fields,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          uid,
          nightNumber: entry.nightNumber,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

// --- Personal Dua Journal ---
export function subscribeDuaEntries(
  uid: string,
  onData: (items: DuaEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/duaEntries`;
  const q = query(userSubcollection(uid, 'duaEntries'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DuaEntry, 'id'>),
      }));
      onData(sortByDateDesc(items));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveDuaEntry(
  uid: string,
  entry: Omit<DuaEntry, 'id' | 'uid' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const docId = entry.id && isValidDocumentId(entry.id) ? entry.id : `dua-${Date.now()}`;
  const path = `users/${uid}/duaEntries/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'duaEntries', docId);
      const snap = await getDoc(ref);
      const fields = {
        title: sanitizeBoundedText(entry.title.trim(), 200),
        category: entry.category,
        content: sanitizeBoundedText(entry.content.trim(), 6000),
        date: sanitizeBoundedText(entry.date || getTodayIsoDate(), 32),
        effortNote: sanitizeBoundedText(entry.effortNote ?? '', 3000),
        reflectionNote: sanitizeBoundedText(entry.reflectionNote ?? '', 3000),
        contentVersion: CONTENT_VERSION,
      };

      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteDuaEntry(uid: string, entryId: string): Promise<void> {
  const path = `users/${uid}/duaEntries/${entryId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'duaEntries', entryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- My Dua Log ---
export function subscribeDuaLogs(
  uid: string,
  onData: (items: DuaLog[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/duaLogs`;
  const q = query(userSubcollection(uid, 'duaLogs'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DuaLog, 'id'>),
      }));
      onData(sortByDateDesc(items));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveDuaLog(
  uid: string,
  entry: Omit<DuaLog, 'id' | 'uid' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const docId = entry.id && isValidDocumentId(entry.id) ? entry.id : `dualog-${Date.now()}`;
  const path = `users/${uid}/duaLogs/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'duaLogs', docId);
      const snap = await getDoc(ref);
      const fields = {
        date: sanitizeBoundedText(entry.date || getTodayIsoDate(), 32),
        topic: sanitizeBoundedText(entry.topic.trim(), 200),
        duaText: sanitizeBoundedText(entry.duaText.trim(), 6000),
        effortSteps: sanitizeBoundedText(entry.effortSteps ?? '', 4000),
        reflectionGratitude: sanitizeBoundedText(entry.reflectionGratitude ?? '', 4000),
        contentVersion: CONTENT_VERSION,
      };

      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteDuaLog(uid: string, entryId: string): Promise<void> {
  const path = `users/${uid}/duaLogs/${entryId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'duaLogs', entryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- Tahajud & Night Worship Tracker ---
export function subscribeTahajudLogs(
  uid: string,
  onData: (items: TahajudLog[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/tahajudLogs`;
  const q = query(userSubcollection(uid, 'tahajudLogs'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TahajudLog, 'id'>) })));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveTahajudLog(
  uid: string,
  log: Omit<TahajudLog, 'id' | 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const docId = `night-${log.nightIndex}`;
  const path = `users/${uid}/tahajudLogs/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'tahajudLogs', docId);
      const snap = await getDoc(ref);
      const fields = {
        date: sanitizeBoundedText(log.date ?? '', 32),
        wakeStatus: log.wakeStatus,
        activities: (log.activities ?? []).slice(0, 10).map((a) => sanitizeBoundedText(a, 64)),
        note: sanitizeBoundedText(log.note ?? '', 2000),
        contentVersion: CONTENT_VERSION,
      };

      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          nightIndex: log.nightIndex,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteTahajudLog(uid: string, nightIndex: number): Promise<void> {
  const docId = `night-${nightIndex}`;
  const path = `users/${uid}/tahajudLogs/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'tahajudLogs', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- Night Preparation Checklist ---
export function subscribeChecklistState(
  uid: string,
  onData: (item: ChecklistState | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/checklists/night-prep`;
  return onSnapshot(
    doc(db, 'users', uid, 'checklists', 'night-prep'),
    (snap) => {
      if (snap.exists()) {
        onData({ id: snap.id, ...(snap.data() as Omit<ChecklistState, 'id'>) });
      } else {
        onData(null);
      }
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

export async function saveChecklistState(
  uid: string,
  checkedIds: string[],
  personalNote: string
): Promise<void> {
  const path = `users/${uid}/checklists/night-prep`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'checklists', 'night-prep');
      const snap = await getDoc(ref);
      const fields = {
        checkedIds: checkedIds.slice(0, 20).map((id) => sanitizeBoundedText(id, 64)),
        personalNote: sanitizeBoundedText(personalNote ?? '', 3000),
        contentVersion: CONTENT_VERSION,
      };
      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

// --- Gratitude Journal ---
export function subscribeGratitudeEntries(
  uid: string,
  onData: (items: GratitudeEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/gratitudeEntries`;
  const q = query(userSubcollection(uid, 'gratitudeEntries'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GratitudeEntry, 'id'>),
      }));
      onData(sortByDateDesc(items));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveGratitudeEntry(
  uid: string,
  entry: Omit<GratitudeEntry, 'id' | 'uid' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const docId = entry.id && isValidDocumentId(entry.id) ? entry.id : `gratitude-${Date.now()}`;
  const path = `users/${uid}/gratitudeEntries/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'gratitudeEntries', docId);
      const snap = await getDoc(ref);
      const fields = {
        date: sanitizeBoundedText(entry.date || getTodayIsoDate(), 32),
        item1: sanitizeBoundedText(entry.item1.trim(), 1000),
        item2: sanitizeBoundedText(entry.item2.trim(), 1000),
        item3: sanitizeBoundedText(entry.item3.trim(), 1000),
        goodDeedPlan: sanitizeBoundedText(entry.goodDeedPlan.trim(), 2000),
        contentVersion: CONTENT_VERSION,
      };
      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteGratitudeEntry(uid: string, entryId: string): Promise<void> {
  const path = `users/${uid}/gratitudeEntries/${entryId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'gratitudeEntries', entryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- Weekly Muhasabah ---
export function subscribeWeeklyMuhasabah(
  uid: string,
  onData: (items: WeeklyMuhasabah[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/weeklyMuhasabah`;
  const q = query(userSubcollection(uid, 'weeklyMuhasabah'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<WeeklyMuhasabah, 'id'>),
      }));
      onData(sortByDateDesc(items));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveWeeklyMuhasabah(
  uid: string,
  entry: Omit<WeeklyMuhasabah, 'id' | 'uid' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const docId = entry.id && isValidDocumentId(entry.id) ? entry.id : `muhasabah-${Date.now()}`;
  const path = `users/${uid}/weeklyMuhasabah/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'weeklyMuhasabah', docId);
      const snap = await getDoc(ref);
      const fields = {
        weekLabel: sanitizeBoundedText(entry.weekLabel.trim(), 120),
        date: sanitizeBoundedText(entry.date || getTodayIsoDate(), 32),
        gratitudeThisWeek: sanitizeBoundedText(entry.gratitudeThisWeek ?? '', 4000),
        habitsToKeep: sanitizeBoundedText(entry.habitsToKeep ?? '', 4000),
        areasToImprove: sanitizeBoundedText(entry.areasToImprove ?? '', 4000),
        realisticSteps: sanitizeBoundedText(entry.realisticSteps ?? '', 4000),
        personalDua: sanitizeBoundedText(entry.personalDua ?? '', 4000),
        contentVersion: CONTENT_VERSION,
      };
      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteWeeklyMuhasabah(uid: string, entryId: string): Promise<void> {
  const path = `users/${uid}/weeklyMuhasabah/${entryId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'weeklyMuhasabah', entryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- Sustainable Spiritual Routine ---
export function subscribeRoutineItems(
  uid: string,
  onData: (items: RoutineItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/routineItems`;
  const q = query(userSubcollection(uid, 'routineItems'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<RoutineItem, 'id'>),
      }));
      onData(sortRoutineItems(items));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveRoutineItem(
  uid: string,
  item: Omit<RoutineItem, 'id' | 'uid' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const docId = item.id && isValidDocumentId(item.id) ? item.id : `routine-${Date.now()}`;
  const path = `users/${uid}/routineItems/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'routineItems', docId);
      const snap = await getDoc(ref);
      const fields = {
        moment: sanitizeBoundedText(item.moment.trim(), 120),
        habitName: sanitizeBoundedText(item.habitName.trim(), 200),
        personalBenefit: sanitizeBoundedText(item.personalBenefit ?? '', 2000),
        realisticWay: sanitizeBoundedText(item.realisticWay ?? '', 2000),
        frequency: sanitizeBoundedText(item.frequency ?? '', 120),
        sortOrder: Math.min(1000, Math.max(0, Math.round(item.sortOrder))),
        contentVersion: CONTENT_VERSION,
      };
      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteRoutineItem(uid: string, itemId: string): Promise<void> {
  const path = `users/${uid}/routineItems/${itemId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'routineItems', itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- Final Reflection & Spiritual Baseline ---
export function subscribeFinalReflections(
  uid: string,
  onData: (items: FinalReflection[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}/finalReflections`;
  const q = query(userSubcollection(uid, 'finalReflections'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FinalReflection, 'id'>) })));
    },
    (err) => {
      if (onError) onError(err);
      else handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveFinalReflection(
  uid: string,
  docId: 'baseline' | 'final-reflection',
  data: Omit<FinalReflection, 'id' | 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const path = `users/${uid}/finalReflections/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      const ref = doc(db, 'users', uid, 'finalReflections', docId);
      const snap = await getDoc(ref);
      const fields = {
        relationshipBaseline: sanitizeBoundedText(data.relationshipBaseline ?? '', 4000),
        worshipHabitsBaseline: sanitizeBoundedText(data.worshipHabitsBaseline ?? '', 4000),
        currentCondition: sanitizeBoundedText(data.currentCondition ?? '', 4000),
        supportNeeded: sanitizeBoundedText(data.supportNeeded ?? '', 4000),
        journeyIntention: sanitizeBoundedText(data.journeyIntention ?? '', 4000),
        learnedLessons: sanitizeBoundedText(data.learnedLessons ?? '', 5000),
        habitsToMaintain: sanitizeBoundedText(data.habitsToMaintain ?? '', 5000),
        areasStillGrowing: sanitizeBoundedText(data.areasStillGrowing ?? '', 5000),
        letterToFutureSelf: sanitizeBoundedText(data.letterToFutureSelf ?? '', 10000),
        contentVersion: CONTENT_VERSION,
      };

      if (snap.exists()) {
        await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, {
          uid,
          entryType: data.entryType,
          ...fields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  });
}

export async function deleteFinalReflection(
  uid: string,
  docId: 'baseline' | 'final-reflection'
): Promise<void> {
  const path = `users/${uid}/finalReflections/${docId}`;
  return documentWriteQueue.enqueue(path, async () => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'finalReflections', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  });
}

// --- Full Export & Account Deletion ---
const USER_SUBCOLLECTIONS = [
  'nightEntries',
  'duaEntries',
  'duaLogs',
  'tahajudLogs',
  'checklists',
  'gratitudeEntries',
  'weeklyMuhasabah',
  'routineItems',
  'finalReflections',
] as const;

export async function fetchAllUserDataForExport(uid: string): Promise<UserExportPayload> {
  const path = `users/${uid}`;
  try {
    const profileSnap = await getDoc(userDocRef(uid));
    const profile = profileSnap.exists() ? (profileSnap.data() as UserProfile) : null;

    const readSub = async <T,>(sub: string): Promise<T[]> => {
      const q = query(userSubcollection(uid, sub), where('uid', '==', uid));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<T, 'id'>) }) as T);
    };

    const [
      nightEntries,
      duaEntries,
      duaLogs,
      tahajudLogs,
      checklists,
      gratitudeEntries,
      weeklyMuhasabah,
      routineItems,
      finalReflections,
    ] = await Promise.all([
      readSub<NightEntry>('nightEntries'),
      readSub<DuaEntry>('duaEntries'),
      readSub<DuaLog>('duaLogs'),
      readSub<TahajudLog>('tahajudLogs'),
      readSub<ChecklistState>('checklists'),
      readSub<GratitudeEntry>('gratitudeEntries'),
      readSub<WeeklyMuhasabah>('weeklyMuhasabah'),
      readSub<RoutineItem>('routineItems'),
      readSub<FinalReflection>('finalReflections'),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      app: 'RUANG PULANG — The Comeback Journal',
      contentVersion: CONTENT_VERSION,
      uid,
      profile,
      nightEntries,
      duaEntries,
      duaLogs,
      tahajudLogs,
      checklists,
      gratitudeEntries,
      weeklyMuhasabah,
      routineItems,
      finalReflections,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export interface DeletionProgressReport {
  deletedDocuments: number;
  clearedSubcollections: string[];
  profileDeleted: boolean;
}

/**
 * Explicitly iterates through every subcollection to delete child documents before deleting /users/{uid}.
 */
export async function deleteAllUserFirestoreData(
  uid: string,
  onStep?: (message: string) => void
): Promise<DeletionProgressReport> {
  let deletedDocuments = 0;
  const clearedSubcollections: string[] = [];

  for (const sub of USER_SUBCOLLECTIONS) {
    onStep?.(`Menghapus catatan pada ${sub}...`);
    const q = query(userSubcollection(uid, sub), where('uid', '==', uid));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const docPath = `users/${uid}/${sub}/${d.id}`;
      await documentWriteQueue.enqueue(docPath, () =>
        deleteDoc(doc(db, 'users', uid, sub, d.id))
      );
      deletedDocuments++;
    }
    clearedSubcollections.push(sub);
  }

  onStep?.('Menghapus profil akun dari Firestore...');
  await documentWriteQueue.enqueue(`users/${uid}`, () => deleteDoc(userDocRef(uid)));
  return {
    deletedDocuments,
    clearedSubcollections,
    profileDeleted: true,
  };
}
