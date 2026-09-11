import { del, get, set } from 'idb-keyval';
import type { StateStorage } from 'zustand/middleware';

/**
 * Wraps idb-keyval as a zustand StateStorage. Swap this factory for a
 * fetch-backed implementation of the same interface to move persistence
 * to a backend later, with no changes to store logic or components.
 */
export function createIdbStorage(): StateStorage {
  return {
    getItem: async (name) => (await get(name)) ?? null,
    setItem: async (name, value) => {
      await set(name, value);
    },
    removeItem: async (name) => {
      await del(name);
    },
  };
}
