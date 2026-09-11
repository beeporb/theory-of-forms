import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { RunState } from '../game/types/player';
import { getDimensionDefinition } from '../game/content/dimensions';
import { generateDimension } from '../game/logic/generateDimension';
import { buildLoadoutFromEquipped } from '../game/logic/loadout';
import { resolveCell } from '../game/logic/resolveCell';
import { createIdbStorage } from '../persistence/storage';
import { useMetaStore } from './metaStore';

const STARTING_HEALTH = 100;

interface RunStore {
  run: RunState | null;
  startRun: (dimensionId: string) => void;
  openCell: (x: number, y: number) => void;
  extractRun: () => void;
  abandonDeadRun: () => void;
}

export const useRunStore = create<RunStore>()(
  persist(
    (set, get) => ({
      run: null,

      startRun: (dimensionId) => {
        const definition = getDimensionDefinition(dimensionId);
        set({
          run: {
            dimension: generateDimension(definition),
            health: STARTING_HEALTH,
            maxHealth: STARTING_HEALTH,
            loadout: buildLoadoutFromEquipped(useMetaStore.getState().meta.equippedGearIds),
            inventory: [],
            status: 'active',
          },
        });
      },

      openCell: (x, y) => {
        const { run } = get();
        if (!run || run.status !== 'active') return;
        const { run: nextRun } = resolveCell(run, x, y);
        set({ run: nextRun });
      },

      extractRun: () => {
        const { run } = get();
        if (!run) return;
        useMetaStore.getState().mergeRunInventory(run.inventory);
        set({ run: null });
      },

      abandonDeadRun: () => {
        const { run } = get();
        if (run) {
          useMetaStore.getState().loseGear(run.loadout.map((g) => g.id));
        }
        set({ run: null });
      },
    }),
    {
      name: 'tof-run-v2',
      storage: createJSONStorage(createIdbStorage),
    },
  ),
);
