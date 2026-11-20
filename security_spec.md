# Security Specification — RUANG PULANG

## 1. Data Invariants
1. **Strict Ownership Isolation**: Every document lives under `/users/{userId}` or one of its 9 subcollections (`nightEntries`, `duaEntries`, `duaLogs`, `tahajudLogs`, `checklists`, `gratitudeEntries`, `weeklyMuhasabah`, `routineItems`, `finalReflections`). No document is readable, listable, writable, or deletable unless `request.auth != null && request.auth.uid == userId`.
2. **Default-Deny Catch-All**: All unmatched paths in Firestore are explicitly denied (`allow read, write: if false`).
3. **Immutable Ownership & Timestamps**: `uid` and `createdAt` must match `request.auth.uid` and `request.time` on create, and cannot be altered on update. `updatedAt` must always equal `request.time`.
4. **Client Entitlement Hardening**: `entitlementStatus` on `/users/{userId}` can only be initialized as `'beta_free'` on create and cannot be modified by the client on update (reserved for future server-side provisioning). No `role` or `isAdmin` fields are accepted from the client.
5. **Bounded Payloads & Safe IDs**: All document path IDs (`userId`, `nightId`, `entryId`, `dateId`, `checklistId`, `itemId`) must match `^[a-zA-Z0-9_\-]+$` and be `<= 128` characters. All strings and arrays enforce explicit `.size()` bounds to prevent resource exhaustion ("Denial of Wallet").
6. **Parent Existence for Subcollections**: Every subcollection write verifies ownership via `userId == request.auth.uid` and validates `exists(/databases/$(database)/documents/users/$(userId))` on create (or `existsAfter` when batched with user creation).

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Cross-User Read (`GET /users/victimUid/nightEntries/night-1`)**: Authenticated as `attackerUid`. Fails because `request.auth.uid != userId`.
2. **Cross-User List (`LIST /users/victimUid/duaEntries`)**: Authenticated as `attackerUid`. Fails because `request.auth.uid != userId`.
3. **Cross-User Write Spoofing (`CREATE /users/attackerUid/duaEntries/e1` with `uid: "victimUid"`)**: Fails `isValidDuaEntry` because `incoming().uid != request.auth.uid`.
4. **Entitlement Escalation on Create (`CREATE /users/attackerUid` with `entitlementStatus: "premium"`)**: Fails `isValidUserProfile` because `entitlementStatus` must be `'beta_free'`.
5. **Entitlement Escalation on Update (`UPDATE /users/attackerUid` changing `entitlementStatus` to `"admin"`)**: Fails `affectedKeys().hasOnly(...)` and immutability check.
6. **Shadow Ghost Field Injection (`CREATE /users/attackerUid/gratitudeEntries/g1` with extra `isApproved: true`)**: Fails `keys().hasOnly(...)`.
7. **Timestamp Forgery (`CREATE /users/attackerUid/duaLogs/d1` with `createdAt: "2020-01-01T00:00:00Z"`)**: Fails `incoming().createdAt == request.time`.
8. **Immortal Field Mutation (`UPDATE /users/attackerUid/nightEntries/night-1` altering `createdAt` or `nightNumber`)**: Fails immutability check and `affectedKeys().hasOnly(...)`.
9. **Path ID Poisoning (`CREATE /users/attackerUid/duaEntries/` + 200-char junk ID with `/$`)**: Fails `isValidId(entryId)`.
10. **Payload Size Exhaustion (`CREATE /users/attackerUid/duaEntries/d1` with `content` > 6000 chars)**: Fails `data.content.size() <= 6000`.
11. **Unbounded Array Injection (`CREATE /users/attackerUid/tahajudLogs/night-1` with 25 activities)**: Fails `data.activities.size() <= 10`.
12. **Unauthenticated Access (`GET /users/anyUid` with `request.auth == null`)**: Fails `isSignedIn()`.
