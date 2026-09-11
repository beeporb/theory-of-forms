import type { RunState } from '../types/player';
import type { ItemInstance } from '../types/item';
import type { Outcome } from '../types/outcome';

export interface ResolveCellResult {
  run: RunState;
  outcome: Outcome;
}

export function resolveCell(run: RunState, x: number, y: number): ResolveCellResult {
  const cell = run.dimension.cells[y]?.[x];
  if (!cell || !cell.exists || cell.status === 'opened') {
    throw new Error(`Cannot open cell (${x}, ${y})`);
  }
  const outcome = cell.outcome;
  if (!outcome) {
    throw new Error(`Cell (${x}, ${y}) has no pre-rolled outcome`);
  }

  const cells = run.dimension.cells.map((row) => row.map((c) => ({ ...c })));
  cells[y][x].status = 'opened';

  let health = run.health;
  let inventory = run.inventory;

  switch (outcome.kind) {
    case 'loot': {
      const instance: ItemInstance = {
        instanceId: crypto.randomUUID(),
        formId: outcome.formId,
        rarity: outcome.rarity,
      };
      inventory = [...inventory, instance];
      break;
    }
    case 'hazard': {
      health = Math.max(0, health - outcome.damage);
      if (outcome.stealsItem && inventory.length > 0) {
        const stolenIndex = Math.floor(Math.random() * inventory.length);
        inventory = inventory.filter((_, i) => i !== stolenIndex);
      }
      break;
    }
    case 'positive': {
      health = Math.min(run.maxHealth, health + outcome.heal);
      break;
    }
    case 'empty':
      break;
  }

  const status = health <= 0 ? 'died' : run.status;

  const nextRun: RunState = {
    ...run,
    dimension: { ...run.dimension, cells },
    health,
    inventory,
    status,
  };

  return { run: nextRun, outcome };
}
