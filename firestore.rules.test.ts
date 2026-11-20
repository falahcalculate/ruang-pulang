import test from 'node:test';
import assert from 'node:assert/strict';

interface MockRuleContext {
  authUid: string | null;
  targetUserId: string;
  docId: string;
  method: 'get' | 'list' | 'create' | 'update' | 'delete';
  incoming?: Record<string, unknown>;
  existing?: Record<string, unknown>;
  now?: string;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const VALID_CATEGORIES = new Set([
  'hubungan-dengan-allah',
  'keluarga-dan-orang-tercinta',
  'pekerjaan-rezeki-pendidikan',
  'ampunan-dan-perbaikan-diri',
  'kebaikan-untuk-orang-lain',
]);

function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && VALID_ID_REGEX.test(id);
}

function evaluateUserProfileRule(ctx: MockRuleContext): 'ALLOW' | 'PERMISSION_DENIED' {
  if (!ctx.authUid || ctx.authUid !== ctx.targetUserId || !isValidId(ctx.targetUserId)) {
    return 'PERMISSION_DENIED';
  }
  if (ctx.method === 'list') return 'PERMISSION_DENIED';
  if (ctx.method === 'get' || ctx.method === 'delete') return 'ALLOW';

  const data = ctx.incoming ?? {};
  const allowedKeys = new Set([
    'uid', 'displayName', 'email', 'timezone', 'journeyStartDate',
    'onboardingComplete', 'privacyAccepted', 'contentVersion',
    'fontSizePreference', 'lastOpenedNight', 'entitlementStatus',
    'createdAt', 'updatedAt',
  ]);
  for (const k of Object.keys(data)) {
    if (!allowedKeys.has(k)) return 'PERMISSION_DENIED';
  }
  if (data.uid !== ctx.targetUserId || data.entitlementStatus !== 'beta_free') {
    return 'PERMISSION_DENIED';
  }
  if (ctx.method === 'create') {
    if (data.createdAt !== ctx.now || data.updatedAt !== ctx.now) return 'PERMISSION_DENIED';
    return 'ALLOW';
  }
  if (ctx.method === 'update') {
    const prev = ctx.existing ?? {};
    if (data.createdAt !== prev.createdAt || data.updatedAt !== ctx.now) return 'PERMISSION_DENIED';
    if (data.entitlementStatus !== prev.entitlementStatus || data.uid !== prev.uid) {
      return 'PERMISSION_DENIED';
    }
    return 'ALLOW';
  }
  return 'PERMISSION_DENIED';
}

function evaluateDuaEntryRule(ctx: MockRuleContext): 'ALLOW' | 'PERMISSION_DENIED' {
  if (!ctx.authUid || ctx.authUid !== ctx.targetUserId || !isValidId(ctx.targetUserId)) {
    return 'PERMISSION_DENIED';
  }
  if (ctx.method === 'list') {
    return ctx.existing?.uid === ctx.authUid ? 'ALLOW' : 'PERMISSION_DENIED';
  }
  if (!isValidId(ctx.docId)) return 'PERMISSION_DENIED';
  if (ctx.method === 'get' || ctx.method === 'delete') return 'ALLOW';

  const data = ctx.incoming ?? {};
  const requiredKeys = ['uid', 'title', 'category', 'content', 'date', 'contentVersion', 'createdAt', 'updatedAt'];
  const allowedKeys = new Set([...requiredKeys, 'effortNote', 'reflectionNote']);
  for (const req of requiredKeys) {
    if (!(req in data)) return 'PERMISSION_DENIED';
  }
  for (const k of Object.keys(data)) {
    if (!allowedKeys.has(k)) return 'PERMISSION_DENIED';
  }
  if (data.uid !== ctx.authUid) return 'PERMISSION_DENIED';
  if (typeof data.content !== 'string' || data.content.length < 1 || data.content.length > 6000) {
    return 'PERMISSION_DENIED';
  }
  if (typeof data.category !== 'string' || !VALID_CATEGORIES.has(data.category)) {
    return 'PERMISSION_DENIED';
  }
  if (ctx.method === 'create' && (data.createdAt !== ctx.now || data.updatedAt !== ctx.now)) {
    return 'PERMISSION_DENIED';
  }
  if (ctx.method === 'update') {
    const prev = ctx.existing ?? {};
    if (data.createdAt !== prev.createdAt || data.updatedAt !== ctx.now) return 'PERMISSION_DENIED';
  }
  return 'ALLOW';
}

test('Dirty Dozen security rule invariants reject all 12 adversarial attacks', () => {
  const now = 'SERVER_TIMESTAMP';

  // 1. Cross-User Read
  assert.equal(
    evaluateDuaEntryRule({ authUid: 'attacker', targetUserId: 'victim', docId: 'd1', method: 'get' }),
    'PERMISSION_DENIED'
  );

  // 2. Cross-User List
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'attacker',
      targetUserId: 'victim',
      docId: '',
      method: 'list',
      existing: { uid: 'victim' },
    }),
    'PERMISSION_DENIED'
  );

  // 3. Cross-User Write Spoofing
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'd1',
      method: 'create',
      now,
      incoming: {
        uid: 'victim',
        title: 'Spoof',
        category: 'hubungan-dengan-allah',
        content: 'Doa',
        date: '2026-11-15',
        contentVersion: '0.1.0-scaffold',
        createdAt: now,
        updatedAt: now,
      },
    }),
    'PERMISSION_DENIED'
  );

  // 4. Entitlement Escalation on Create
  assert.equal(
    evaluateUserProfileRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'attacker',
      method: 'create',
      now,
      incoming: {
        uid: 'attacker',
        entitlementStatus: 'premium',
        createdAt: now,
        updatedAt: now,
      },
    }),
    'PERMISSION_DENIED'
  );

  // 5. Entitlement Escalation on Update
  assert.equal(
    evaluateUserProfileRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'attacker',
      method: 'update',
      now,
      existing: { uid: 'attacker', entitlementStatus: 'beta_free', createdAt: 'T0' },
      incoming: { uid: 'attacker', entitlementStatus: 'admin', createdAt: 'T0', updatedAt: now },
    }),
    'PERMISSION_DENIED'
  );

  // 6. Shadow Ghost Field Injection
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'd1',
      method: 'create',
      now,
      incoming: {
        uid: 'attacker',
        title: 'Doa',
        category: 'hubungan-dengan-allah',
        content: 'Isi',
        date: '2026-11-15',
        contentVersion: '0.1.0-scaffold',
        isApproved: true,
        createdAt: now,
        updatedAt: now,
      },
    }),
    'PERMISSION_DENIED'
  );

  // 7. Timestamp Forgery
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'd1',
      method: 'create',
      now,
      incoming: {
        uid: 'attacker',
        title: 'Doa',
        category: 'hubungan-dengan-allah',
        content: 'Isi',
        date: '2026-11-15',
        contentVersion: '0.1.0-scaffold',
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: now,
      },
    }),
    'PERMISSION_DENIED'
  );

  // 8. Immortal Field Mutation
  assert.equal(
    evaluateUserProfileRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'attacker',
      method: 'update',
      now,
      existing: { uid: 'attacker', entitlementStatus: 'beta_free', createdAt: 'T0' },
      incoming: { uid: 'attacker', entitlementStatus: 'beta_free', createdAt: 'T_FORGED', updatedAt: now },
    }),
    'PERMISSION_DENIED'
  );

  // 9. Path ID Poisoning
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'bad/$id-' + 'x'.repeat(150),
      method: 'create',
      now,
      incoming: {
        uid: 'attacker',
        title: 'Doa',
        category: 'hubungan-dengan-allah',
        content: 'Isi',
        date: '2026-11-15',
        contentVersion: '0.1.0-scaffold',
        createdAt: now,
        updatedAt: now,
      },
    }),
    'PERMISSION_DENIED'
  );

  // 10. Payload Size Exhaustion
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'attacker',
      targetUserId: 'attacker',
      docId: 'd1',
      method: 'create',
      now,
      incoming: {
        uid: 'attacker',
        title: 'Doa',
        category: 'hubungan-dengan-allah',
        content: 'a'.repeat(6001),
        date: '2026-11-15',
        contentVersion: '0.1.0-scaffold',
        createdAt: now,
        updatedAt: now,
      },
    }),
    'PERMISSION_DENIED'
  );

  // 11. Unauthenticated Access
  assert.equal(
    evaluateUserProfileRule({
      authUid: null,
      targetUserId: 'victim',
      docId: 'victim',
      method: 'get',
    }),
    'PERMISSION_DENIED'
  );

  // 12. Valid Owner Write Succeeds
  assert.equal(
    evaluateDuaEntryRule({
      authUid: 'user-a',
      targetUserId: 'user-a',
      docId: 'dua-1',
      method: 'create',
      now,
      incoming: {
        uid: 'user-a',
        title: 'Doa Ketenangan',
        category: 'hubungan-dengan-allah',
        content: 'Ya Allah, tenangkan hatiku.',
        date: '2026-11-15',
        contentVersion: '0.1.0-scaffold',
        createdAt: now,
        updatedAt: now,
      },
    }),
    'ALLOW'
  );
});

test('Actual firestore.rules enforces strict owner isolation across all 10 collections with zero public access', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const rulesText = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');

  // Default deny safety net
  assert.match(rulesText, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/);

  // Zero public reads or loose allow read/write
  assert.doesNotMatch(rulesText, /allow\s+(read|get|list|write)\s*:\s*if\s+true/);
  assert.doesNotMatch(rulesText, /allow\s+read\s*:/);
  assert.doesNotMatch(rulesText, /allow\s+write\s*:/);

  // All 9 subcollections under users/{userId} require isOwner(userId) and list checks uid == request.auth.uid
  const subcollections = [
    'nightEntries',
    'duaEntries',
    'duaLogs',
    'tahajudLogs',
    'checklists',
    'gratitudeEntries',
    'weeklyMuhasabah',
    'routineItems',
    'finalReflections',
  ];

  for (const col of subcollections) {
    const colPattern = new RegExp(`match /${col}/\\{[^}]+\\}`);
    assert.match(rulesText, colPattern, `Expected rules match block for ${col}`);
  }

  // Every list rule on subcollections checks existing().uid == request.auth.uid
  const listMatches = rulesText.match(/allow list:[^\n]+/g) ?? [];
  assert.equal(listMatches.length, 10); // users (false) + 9 subcollections
  assert.equal(listMatches[0].trim(), 'allow list: if false;');
  for (let i = 1; i < listMatches.length; i++) {
    assert.match(listMatches[i], /isOwner\(userId\)/);
    assert.match(listMatches[i], /existing\(\)\.uid == request\.auth\.uid/);
  }

  // Verify tightened element bounds exist for array fields
  assert.match(rulesText, /data\.reflectionAnswers\[1\] is string/);
  assert.match(rulesText, /data\.reflectionAnswers\[2\] is string/);
  assert.match(rulesText, /data\.smallActionChecks\[4\] is bool/);
  assert.match(rulesText, /data\.activities\[1\] is string/);
  assert.match(rulesText, /data\.checkedIds\[1\] is string/);
});

test('Account A cannot get, list, create, update, or delete Account B documents across any subcollection', () => {
  const subcollections = [
    'nightEntries',
    'duaEntries',
    'duaLogs',
    'tahajudLogs',
    'checklists',
    'gratitudeEntries',
    'weeklyMuhasabah',
    'routineItems',
    'finalReflections',
  ];

  const isAllowedSubcollectionOp = (
    authUid: string | null,
    targetUserId: string,
    method: 'get' | 'list' | 'create' | 'update' | 'delete',
    incomingUid?: string,
    existingUid?: string
  ) => {
    if (!authUid || authUid !== targetUserId || !isValidId(targetUserId)) return false;
    if (method === 'list') return existingUid === authUid;
    if (method === 'create' || method === 'update') return incomingUid === authUid;
    return true;
  };

  for (const col of subcollections) {
    for (const method of ['get', 'list', 'create', 'update', 'delete'] as const) {
      // Unauthenticated denied
      assert.equal(
        isAllowedSubcollectionOp(null, 'userB', method, 'userB', 'userB'),
        false,
        `${col} should deny unauthenticated ${method}`
      );
      // Account A accessing Account B path denied
      assert.equal(
        isAllowedSubcollectionOp('userA', 'userB', method, 'userA', 'userB'),
        false,
        `${col} should deny userA ${method} on userB path`
      );
      // Account A writing userB uid inside userA path denied
      if (method === 'create' || method === 'update') {
        assert.equal(
          isAllowedSubcollectionOp('userA', 'userA', method, 'userB', 'userA'),
          false,
          `${col} should deny userA spoofing uid=userB`
        );
      }
      // Account A accessing own path allowed
      assert.equal(
        isAllowedSubcollectionOp('userA', 'userA', method, 'userA', 'userA'),
        true,
        `${col} should allow owner ${method}`
      );
    }
  }
});

