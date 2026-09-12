import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PlayerMeta } from '../game/types/player';
import type { ItemInstance } from '../game/types/item';
import type { FoundGear, GearSlot } from '../game/types/gear';
import type { PastRunRecord } from '../game/types/pastRun';
import type { AttributeId } from '../game/types/character';
import { getCollector } from '../game/content/collectors';
import { STARTER_GEAR_IDS } from '../game/content/gear';
import { DIMENSIONS } from '../game/content/dimensions';
import { getTrait } from '../game/content/traits';
import { canDonate, applyDonation } from '../game/logic/donation';
import { withDimensionUnlocks } from '../game/logic/dimensionUnlocks';
import { degradeCondition, mergeFoundGear } from '../game/logic/gearCondition';
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
  acquireGear: (found: FoundGear[]) => void;
  degradeEquippedGear: (gearIds: string[]) => void;
  recordRun: (record: PastRunRecord) => void;
  allocateAttributePoint: (attributeId: AttributeId) => void;
  selectTrait: (traitId: string) => void;
}

const MAX_PAST_RUNS = 50;

const INITIAL_META: PlayerMeta = {
  version: 1,
  stash: [],
  collectors: {},
  unlockedDimensionIds: DIMENSIONS.filter((d) => !d.unlockCondition).map((d) => d.id),
  carryCapacity: 10,
  ownedGearIds: STARTER_GEAR_IDS,
  equippedGearIds: { weapon: 'rusty-crowbar', armor: 'patched-jacket', tool: 'hand-lamp' },
  gearCondition: Object.fromEntries(STARTER_GEAR_IDS.map((id) => [id, 'sound' as const])),
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
          meta: withDimensionUnlocks({
            ...meta,
            stash: meta.stash.filter((i) => i.instanceId !== instanceId),
            collectors: { ...meta.collectors, [collectorId]: applyDonation(progress, item) },
          }),
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
          meta: withDimensionUnlocks({
            ...meta,
            collectors: { ...meta.collectors, [collectorId]: applyDonation(progress, item) },
          }),
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
        const gearCondition = Object.fromEntries(
          Object.entries(meta.gearCondition).filter(([id]) => !lost.has(id)),
        );
        set({ meta: { ...meta, ownedGearIds, equippedGearIds, gearCondition } });
      },

      acquireGear: (found) => {
        const { meta } = get();
        if (found.length === 0) return;
        const { ownedGearIds, gearCondition } = mergeFoundGear(meta.ownedGearIds, meta.gearCondition, found);
        set({ meta: { ...meta, ownedGearIds, gearCondition } });
      },

      // Only extraction calls this — see runStore.extractRun for why death and
      // abandonment don't (they lose the gear outright instead).
      degradeEquippedGear: (gearIds) => {
        const { meta } = get();
        if (gearIds.length === 0) return;
        const gearCondition = { ...meta.gearCondition };
        for (const id of gearIds) {
          gearCondition[id] = degradeCondition(gearCondition[id] ?? 'sound', 1);
        }
        set({ meta: { ...meta, gearCondition } });
      },

      recordRun: (record) => {
        const { meta } = get();
        const pastRuns = [record, ...(meta.pastRuns ?? [])].slice(0, MAX_PAST_RUNS);

        let character = applyTagSkillXp(meta.character, record);
        if (record.outcome === 'extracted') {
          character = applyCharacterXp(character, xpGainForExtraction(record));
        }

        set({ meta: withDimensionUnlocks({ ...meta, pastRuns, character }) });
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
        const ownedGearIds = persistedMeta.ownedGearIds ?? currentState.meta.ownedGearIds;
        // Older saves predate gearCondition entirely; any owned gear it's still
        // missing a condition for (old save, or new gear added since) defaults to 'sound'.
        const gearCondition = { ...(persistedMeta.gearCondition ?? {}) };
        for (const id of ownedGearIds) {
          if (!(id in gearCondition)) gearCondition[id] = 'sound';
        }
        return {
          ...currentState,
          meta: withDimensionUnlocks({
            ...currentState.meta,
            ...persistedMeta,
            gearCondition,
            character: persistedMeta.character ?? createInitialCharacter(),
          }),
        };
      },
    },
  ),
);
