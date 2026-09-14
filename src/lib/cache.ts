// ── Simple in-memory LRU-ish cache for extraction results ──────────────
// Identical/near-identical ideas are common; caching them is the main thing
// that keeps model API calls (and their cost) down. Process-local and ephemeral
// — fine for a stateless showcase. Swap for Redis/KV if you ever scale out.

import type { ExtractionResponse } from "./types";

const MAX_ENTRIES = 500;
const store = new Map<string, ExtractionResponse>();

// Normalize an idea into a stable cache key: lowercase + collapse whitespace.
export function cacheKey(idea: string): string {
  return idea.toLowerCase().replace(/\s+/g, " ").trim();
}

export function getCached(key: string): ExtractionResponse | undefined {
  const hit = store.get(key);
  if (hit) {
    // Refresh recency (Map preserves insertion order → re-insert to move to end).
    store.delete(key);
    store.set(key, hit);
    return { ...hit, cached: true };
  }
  return undefined;
}

export function setCached(key: string, value: ExtractionResponse): void {
  store.set(key, value);
  // Evict oldest if over capacity.
  if (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
}
