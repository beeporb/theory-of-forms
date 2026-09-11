import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PlayerMeta } from '../game/types/player';
import type { ItemInstance } from '../game/types/item';
import type { GearSlot } from '../game/types/gear';
import type { PastRunRecord } from '../game/types/pastRun';
import { getCollector } from '../game/content/collectors';
import { getVersion } from '../game/content/versions';
import { GEAR_CATALOG } from '../game/content/gear';
import { getRequiredVersionIds } from '../game/logic/masterSet';
import { qualityScore } from '../game/logic/quality';
import { createIdbStorage } from '../persistence/storage';

interface MetaStore {
  meta: PlayerMeta;
  donateItem: (collectorId: string, instanceId: string) => void;
  mergeRunInventory: (items: ItemInstance[]) => void;
  setEquipped: (slot: GearSlot, gearId: string) => void;
  loseGear: (gearIds: string[]) => void;
  recordRun: (record: PastRunRecord) => void;
}

const MAX_PAST_RUNS = 50;

const INITIAL_META: PlayerMeta = {
  version: 1,
  stash: [],
  collectors: {},
  unlockedDimensionIds: ['warehouse'],
  carryCapacity: 10,
  ownedGearIds: GEAR_CATALOG.map((g) => g.id),
  equippedGearIds: { weapon: 'rusty-crowbar', armor: 'patched-jacket', tool: 'hand-lamp' },
  pastRuns: [],
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

      setEquipped: (slot, gearId) => {
        const { meta } = get();
        set({ meta: { ...meta, equippedGearIds: { ...meta.equippedGearIds, [slot]: gearId } } });
      },

      loseGear: (gearIds) => {
        const { meta } = get();
        const lost = new Set(gearIds);
        const ownedGearIds = meta.ownedGearIds.filter((id) => !lost.has(id));
        const equippedGearIds = Object.fromEntries(
          Object.entries(meta.equippedGearIds).filter(([, id]) => !lost.has(id as string)),
        ) as PlayerMeta['equippedGearIds'];
        set({ meta: { ...meta, ownedGearIds, equippedGearIds } });
      },

      recordRun: (record) => {
        const { meta } = get();
        const pastRuns = [record, ...(meta.pastRuns ?? [])].slice(0, MAX_PAST_RUNS);
        set({ meta: { ...meta, pastRuns } });
      },
    }),
    {
      name: 'tof-meta-v3',
      storage: createJSONStorage(createIdbStorage),
    },
  ),
);
