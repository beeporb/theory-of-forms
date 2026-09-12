import type { RunState } from '../types/player';
import type { ItemInstance } from '../types/item';
import type { LeafOutcome } from '../types/outcome';

export interface ApplyOutcomeResult {
  health: number;
  inventory: ItemInstance[];
  status: RunState['status'];
}

/** Applies a resolved (non-event) outcome's health/inventory effect to a run. */
export function applyLeafOutcome(run: RunState, outcome: LeafOutcome): ApplyOutcomeResult {
  let health = run.health;
  let inventory = run.inventory;

  switch (outcome.kind) {
    case 'loot': {
      const instance: ItemInstance = {
        instanceId: crypto.randomUUID(),
        versionId: outcome.versionId,
        condition: outcome.condition,
        weirdness: outcome.weirdness,
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
  return { health, inventory, status };
}
