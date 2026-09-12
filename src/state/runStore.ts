import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { RunState } from '../game/types/player';
import type { Outcome } from '../game/types/outcome';
import type { PastRunRecord, RunOutcome } from '../game/types/pastRun';
import { getDimensionDefinition } from '../game/content/dimensions';
import { generateDimension } from '../game/logic/generateDimension';
import { buildLoadoutFromEquipped } from '../game/logic/loadout';
import { resolveCell } from '../game/logic/resolveCell';
import { movePlayer } from '../game/logic/movePlayer';
import { canExtract } from '../game/logic/extraction';
import { createIdbStorage } from '../persistence/storage';
import { useMetaStore } from './metaStore';

const STARTING_HEALTH = 100;

interface RunStore {
  run: RunState | null;
  startRun: (dimensionId: string) => void;
  moveTo: (x: number, y: number) => Outcome | null;
  extractRun: () => void;
  abandonRun: () => void;
  abandonDeadRun: () => void;
}

function toPastRunRecord(run: RunState, outcome: RunOutcome): PastRunRecord {
  return {
    id: crypto.randomUUID(),
    dimensionId: run.dimension.definitionId,
    outcome,
    endedAt: Date.now(),
    moveCount: run.moveCount,
    loadout: run.loadout,
    items: run.inventory,
    log: run.log,
  };
}

export const useRunStore = create<RunStore>()(
  persist(
    (set, get) => ({
      run: null,

      startRun: (dimensionId) => {
        const definition = getDimensionDefinition(dimensionId);
        const dimension = generateDimension(definition);
        const baseRun: RunState = {
          dimension,
          health: STARTING_HEALTH,
          maxHealth: STARTING_HEALTH,
          loadout: buildLoadoutFromEquipped(useMetaStore.getState().meta.equippedGearIds),
          inventory: [],
          status: 'active',
          log: [],
          position: dimension.entry,
          moveCount: 0,
        };
        const { run } = resolveCell(baseRun, dimension.entry.x, dimension.entry.y);
        set({ run });
      },

      moveTo: (x, y) => {
        const { run } = get();
        if (!run || run.status !== 'active') return null;
        const { run: nextRun, outcome } = movePlayer(run, x, y);
        set({ run: nextRun });
        return outcome;
      },

      extractRun: () => {
        const { run } = get();
        if (!run || !canExtract(run)) return;
        useMetaStore.getState().mergeRunInventory(run.inventory);
        useMetaStore.getState().recordRun(toPastRunRecord(run, 'extracted'));
        set({ run: null });
      },

      abandonRun: () => {
        const { run } = get();
        if (!run || run.status !== 'active') return;
        useMetaStore.getState().loseGear(run.loadout.map((g) => g.id));
        useMetaStore.getState().recordRun(toPastRunRecord(run, 'abandoned'));
        set({ run: null });
      },

      abandonDeadRun: () => {
        const { run } = get();
        if (run) {
          useMetaStore.getState().loseGear(run.loadout.map((g) => g.id));
          useMetaStore.getState().recordRun(toPastRunRecord(run, 'died'));
        }
        set({ run: null });
      },
    }),
    {
      name: 'tof-run-v4',
      storage: createJSONStorage(createIdbStorage),
    },
  ),
);
