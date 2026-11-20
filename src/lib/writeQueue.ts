/**
 * Serializes asynchronous operations that target the same key (e.g. a Firestore document path)
 * while allowing operations on distinct keys to proceed concurrently.
 */
export class KeyedWriteQueue {
  private readonly tails = new Map<string, Promise<unknown>>();

  enqueue<T>(key: string, operation: () => Promise<T>): Promise<T> {
    const previous = this.tails.get(key) ?? Promise.resolve();
    const resultPromise = previous.catch(() => undefined).then(() => operation());
    const cleanup = () => {
      if (this.tails.get(key) === settlePromise) {
        this.tails.delete(key);
      }
    };
    const settlePromise = resultPromise.then(cleanup, cleanup);

    this.tails.set(key, settlePromise);

    return resultPromise;
  }

  hasPending(key: string): boolean {
    return this.tails.has(key);
  }

  get pendingCount(): number {
    return this.tails.size;
  }
}
