export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export interface KeyValueCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs: number): Promise<void>;
  delete(key: string): Promise<void>;
}

class InMemoryKeyValueCache implements KeyValueCache {
  private store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

/**
 * Redis-backed cache placeholder.
 * Implement with ioredis GET/SETEX + JSON.stringify/parse, then swap in createKeyValueCache().
 */

function createKeyValueCache(): KeyValueCache {
  return new InMemoryKeyValueCache();
}

const globalForCache = globalThis as typeof globalThis & {
  newsKeyValueCache?: KeyValueCache;
};

export function getKeyValueCache(): KeyValueCache {
  if (!globalForCache.newsKeyValueCache) {
    globalForCache.newsKeyValueCache = createKeyValueCache();
  }

  return globalForCache.newsKeyValueCache;
}

export function buildCacheKey(namespace: string, parts: string[]): string {
  return `${namespace}:${parts.join(":")}`;
}
