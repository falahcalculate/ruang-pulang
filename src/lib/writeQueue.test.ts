import test from 'node:test';
import assert from 'node:assert/strict';
import { KeyedWriteQueue } from './writeQueue';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

test('KeyedWriteQueue serializes concurrent writes for the same document path and preserves create-then-update semantics', async () => {
  const queue = new KeyedWriteQueue();
  const events: string[] = [];
  let docExists = false;
  let storedDoc: Record<string, unknown> | null = null;

  const simulateSave = (path: string, label: string, payload: { note: string; status: string }) =>
    queue.enqueue(path, async () => {
      events.push(`${label}:start`);
      const existsAtStart = docExists;
      await delay(label === 'autosave' ? 25 : 5);

      if (existsAtStart) {
        // Must only update mutable fields and never re-send createdAt / uid / immutable IDs
        events.push(`${label}:updateDoc`);
        storedDoc = {
          ...storedDoc,
          ...payload,
          updatedAt: 'serverTimestamp()',
        };
      } else {
        events.push(`${label}:setDoc`);
        docExists = true;
        storedDoc = {
          uid: 'user-1',
          nightNumber: 1,
          ...payload,
          createdAt: 'serverTimestamp()',
          updatedAt: 'serverTimestamp()',
        };
      }
      events.push(`${label}:end`);
    });

  // Trigger autosave, manual save, and unmount flush concurrently for the same document
  await Promise.all([
    simulateSave('users/user-1/nightEntries/night-1', 'autosave', {
      note: 'draft 1',
      status: 'draft',
    }),
    simulateSave('users/user-1/nightEntries/night-1', 'manual', {
      note: 'draft 2',
      status: 'completed',
    }),
    simulateSave('users/user-1/nightEntries/night-1', 'flush', {
      note: 'draft 3',
      status: 'completed',
    }),
  ]);

  assert.deepEqual(events, [
    'autosave:start',
    'autosave:setDoc',
    'autosave:end',
    'manual:start',
    'manual:updateDoc',
    'manual:end',
    'flush:start',
    'flush:updateDoc',
    'flush:end',
  ]);
  assert.equal(storedDoc?.['note'], 'draft 3');
  assert.equal(storedDoc?.['uid'], 'user-1');
  assert.equal(storedDoc?.['nightNumber'], 1);
  assert.equal(queue.pendingCount, 0);
});

test('KeyedWriteQueue allows different document paths to run concurrently without blocking', async () => {
  const queue = new KeyedWriteQueue();
  const order: string[] = [];

  await Promise.all([
    queue.enqueue('users/u1/nightEntries/night-1', async () => {
      order.push('night-1:start');
      await delay(25);
      order.push('night-1:end');
    }),
    queue.enqueue('users/u1/nightEntries/night-2', async () => {
      order.push('night-2:start');
      await delay(5);
      order.push('night-2:end');
    }),
  ]);

  assert.equal(order[0], 'night-1:start');
  assert.equal(order[1], 'night-2:start');
  assert.equal(order[2], 'night-2:end');
  assert.equal(order[3], 'night-1:end');
  assert.equal(queue.pendingCount, 0);
});

test('KeyedWriteQueue recovers cleanly after a rejected operation so subsequent writes still execute', async () => {
  const queue = new KeyedWriteQueue();
  const path = 'users/u1/checklists/night-prep';

  const first = queue.enqueue(path, async () => {
    await delay(10);
    throw new Error('network error');
  });

  const second = queue.enqueue(path, async () => {
    return 'recovered';
  });

  await assert.rejects(first, /network error/);
  assert.equal(await second, 'recovered');
  assert.equal(queue.hasPending(path), false);
});
