type Primitive = string | number | boolean;
type CacheValue = Primitive | Primitive[] | Set<Primitive> | Map<string, Primitive>;

export interface ICacheService {
  set(key: string, value: CacheValue, ttl: number): void;
  get(key: string): CacheValue | null;
  delete(key: string): void;
}

export class CacheService implements ICacheService {
  cache: Map<string, CacheValue>;

  constructor() {
    this.cache = new Map<string, CacheValue>();
  }

  set(key: string, value: CacheValue, ttlms: number) {
    this.cache.set(key, value);

    setTimeout(() => {
      this.cache.delete(key);
    }, ttlms);
  }

  get(key: string): CacheValue | null {
    const value = this.cache.get(key);

    return value || null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}
