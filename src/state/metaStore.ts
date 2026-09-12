import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PlayerMeta } from '../game/types/player';
import type { ItemInstance } from '../game/types/item';
import type { GearSlot } from '../game/types/gear';
import type { PastRunRecord } from '../game/types/pastRun';
import type { AttributeId } from '../game/types/character';
import { getCollector } from '../game/content/collectors';
import { GEAR_CATALOG } from '../game/content/gear';
import { getTrait } from '../game/content/traits';
import { canDonate, applyDonation } from '../game/logic/donation';
import {
  applyCharacterXp,
  applyTagSkillXp,
  createInitialCharacter,
  xpGainForExtraction,
} from '../game/logic/leveling';
import { createIdbStorage } from '../persistence/storage';

interface MetaStore {
  meta: PlayerMeta;
  donateItem: (collectorId: string, instanceId: string) => void;
  recordDonation: (collectorId: string, item: ItemInstance) => void;
  mergeRunInventory: (items: ItemInstance[]) => void;
  setEquipped: (slot: GearSlot, gearId: string) => void;
  loseGear: (gearIds: string[]) => void;
  recordRun: (record: PastRunRecord) => void;
  allocateAttributePoint: (attributeId: AttributeId) => void;
  selectTrait: (traitId: string) => void;
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
  character: createInitialCharacter(),
};

export const useMetaStore = create<MetaStore>()(
  persist(
    (set, get) => ({
      meta: INITIAL_META,

      donateItem: (collectorId, instanceId) => {
        const { meta } = get();
        const item = meta.stash.find((i) => i.instanceId === instanceId);
        if (!item) return;

        const collector = getCollector(collectorId);
        const progress = meta.collectors[collectorId] ?? { collectorId, donated: {} };
        if (!canDonate(item, collector, progress)) return;

        set({
          meta: {
            ...meta,
            stash: meta.stash.filter((i) => i.instanceId !== instanceId),
            collectors: { ...meta.collectors, [collectorId]: applyDonation(progress, item) },
          },
        });
      },

      // Same as donateItem, but for an item that's still in the current run's
      // inventory (donating to a roaming collector encountered on the grid)
      // instead of the persisted stash.
      recordDonation: (collectorId, item) => {
        const { meta } = get();
        const collector = getCollector(collectorId);
        const progress = meta.collectors[collectorId] ?? { collectorId, donated: {} };
        if (!canDonate(item, collector, progress)) return;

        set({
          meta: {
            ...meta,
            collectors: { ...meta.collectors, [collectorId]: applyDonation(progress, item) },
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

        let character = applyTagSkillXp(meta.character, record);
        if (record.outcome === 'extracted') {
          character = applyCharacterXp(character, xpGainForExtraction(record));
        }

        set({ meta: { ...meta, pastRuns, character } });
      },

      allocateAttributePoint: (attributeId) => {
        const { meta } = get();
        const { character } = meta;
        if (character.attributePoints <= 0) return;

        set({
          meta: {
            ...meta,
            character: {
              ...character,
              attributePoints: character.attributePoints - 1,
              attributes: {
                ...character.attributes,
                [attributeId]: character.attributes[attributeId] + 1,
              },
            },
          },
        });
      },

      selectTrait: (traitId) => {
        const { meta } = get();
        const { character } = meta;
        const trait = getTrait(traitId);
        if (character.traitPoints <= 0) return;
        if (character.level < trait.requiredLevel) return;
        if (character.traitIds.includes(traitId)) return;

        set({
          meta: {
            ...meta,
            character: {
              ...character,
              traitPoints: character.traitPoints - 1,
              traitIds: [...character.traitIds, traitId],
            },
          },
        });
      },
    }),
    {
      name: 'tof-meta-v3',
      storage: createJSONStorage(createIdbStorage),
      merge: (persistedState, currentState) => {
        const persistedMeta = (persistedState as { meta?: Partial<PlayerMeta> } | undefined)?.meta;
        if (!persistedMeta) return currentState;
        return {
          ...currentState,
          meta: {
            ...currentState.meta,
            ...persistedMeta,
            character: persistedMeta.character ?? createInitialCharacter(),
          },
        };
      },
    },
  ),
);
