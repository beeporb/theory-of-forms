import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PlayerMeta } from '../game/types/player';
import type { ItemInstance } from '../game/types/item';
import { getCollector } from '../game/content/collectors';
import { getVersion } from '../game/content/versions';
import { getRequiredVersionIds } from '../game/logic/masterSet';
import { qualityScore } from '../game/logic/quality';
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

        const version = getVersion(item.versionId);
        const collector = getCollector(collectorId);
        if (!getRequiredVersionIds(collector).includes(version.id)) return;

        const progress = meta.collectors[collectorId] ?? { collectorId, donated: {} };
        const held = progress.donated[version.id];
        const newScore = qualityScore(item.condition, item.weirdness);
        if (held && qualityScore(held.condition, held.weirdness) >= newScore) return;

        set({
          meta: {
            ...meta,
            stash: meta.stash.filter((i) => i.instanceId !== instanceId),
            collectors: {
              ...meta.collectors,
              [collectorId]: {
                collectorId,
                donated: {
                  ...progress.donated,
                  [version.id]: { condition: item.condition, weirdness: item.weirdness },
                },
              },
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
      name: 'tof-meta-v2',
      storage: createJSONStorage(createIdbStorage),
    },
  ),
);
