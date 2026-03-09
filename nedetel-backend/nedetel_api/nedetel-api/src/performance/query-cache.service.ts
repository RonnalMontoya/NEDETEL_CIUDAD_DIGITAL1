import { Injectable } from '@nestjs/common';

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

@Injectable()
export class QueryCacheService {
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly inFlight = new Map<string, Promise<unknown>>();

  async getOrSet<T>(
    key: string,
    ttlMs: number,
    producer: () => Promise<T>,
  ): Promise<{ value: T; cacheHit: boolean }> {
    const now = Date.now();
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > now) {
      return { value: cached.value, cacheHit: true };
    }

    const pending = this.inFlight.get(key) as Promise<T> | undefined;
    if (pending) {
      const value = await pending;
      return { value, cacheHit: true };
    }

    const request = producer();
    this.inFlight.set(key, request);

    try {
      const value = await request;
      this.cache.set(key, { value, expiresAt: now + ttlMs });
      return { value, cacheHit: false };
    } finally {
      this.inFlight.delete(key);
    }
  }

  invalidate(prefix: string): number {
    let removed = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        removed += 1;
      }
    }
    return removed;
  }
}
