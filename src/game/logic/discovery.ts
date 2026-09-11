import type { CollectorDefinition } from '../types/collector';
import type { PlayerMeta } from '../types/player';

export function isCollectorRevealed(def: CollectorDefinition, meta: PlayerMeta): boolean {
  return !def.secret || (def.revealCondition?.(meta) ?? false);
}
