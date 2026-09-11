import type { CollectorDefinition, CollectorProgress } from '../types/collector';

export function isMasterSetComplete(
  def: CollectorDefinition,
  progress: CollectorProgress,
): boolean {
  return def.requiredFormIds.every((id) => progress.turnedInFormIds.includes(id));
}

export function masterSetPercent(
  def: CollectorDefinition,
  progress: CollectorProgress,
): number {
  if (def.requiredFormIds.length === 0) return 1;
  const owned = def.requiredFormIds.filter((id) => progress.turnedInFormIds.includes(id));
  return owned.length / def.requiredFormIds.length;
}
