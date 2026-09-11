import type { CollectorDefinition, CollectorProgress } from '../types/collector';
import { getVersionsForForm } from '../content/versions';

export function getRequiredVersionIds(def: CollectorDefinition): string[] {
  return def.requiredFormIds.flatMap((formId) => getVersionsForForm(formId).map((v) => v.id));
}

export function isMasterSetComplete(
  def: CollectorDefinition,
  progress: CollectorProgress,
): boolean {
  return getRequiredVersionIds(def).every((id) => id in progress.donated);
}

export function masterSetPercent(
  def: CollectorDefinition,
  progress: CollectorProgress,
): number {
  const required = getRequiredVersionIds(def);
  if (required.length === 0) return 1;
  const owned = required.filter((id) => id in progress.donated);
  return owned.length / required.length;
}
