import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PlayerMeta } from '../game/types/player';
import type { ItemInstance } from '../game/types/item';
import { createIdbStorage } from '../persistence/storage';

interface MetaStore {
  meta: PlayerMeta;
  donateItem: (collectorId: string, instanceId: string) => void;
  mergeRunInventory: (items: ItemInstance[]) => void;
}

const INITIAL_META: PlayerMeta = {
  version: 1,
  stash: [],
  collectors: {},
  unlockedDimensionIds: ['warehouse'],
  carryCapacity: 10,
};

export const useMetaStore = create<MetaStore>()(
  persist(
    (set, get) => ({
      meta: INITIAL_META,

      donateItem: (collectorId, instanceId) => {
        const { meta } = get();
        const item = meta.stash.find((i) => i.instanceId === instanceId);
        if (!item) return;

        const existing = meta.collectors[collectorId] ?? { collectorId, turnedInFormIds: [] };
        const turnedInFormIds = existing.turnedInFormIds.includes(item.formId)
          ? existing.turnedInFormIds
          : [...existing.turnedInFormIds, item.formId];

        set({
          meta: {
            ...meta,
            stash: meta.stash.filter((i) => i.instanceId !== instanceId),
            collectors: {
              ...meta.collectors,
              [collectorId]: { collectorId, turnedInFormIds },
            },
          },
        });
      },

      mergeRunInventory: (items) => {
        const { meta } = get();
        set({ meta: { ...meta, stash: [...meta.stash, ...items] } });
      },
    }),
    {
      name: 'tof-meta-v1',
      storage: createJSONStorage(createIdbStorage),
    },
  ),
);
