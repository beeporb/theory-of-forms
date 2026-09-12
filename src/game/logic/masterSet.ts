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

// A stricter, second milestone: the base master set only asks for one of
// each required version at any quality, which is how a pile of Wrecked
// Mundane donations can read as "complete." The pristine set is the actual
// end goal — every required version donated at pristine condition.
export function isPristineSetComplete(
  def: CollectorDefinition,
  progress: CollectorProgress,
): boolean {
  return getRequiredVersionIds(def).every((id) => progress.donated[id]?.condition === 'pristine');
}

export function pristineSetPercent(
  def: CollectorDefinition,
  progress: CollectorProgress,
): number {
  const required = getRequiredVersionIds(def);
  if (required.length === 0) return 1;
  const pristine = required.filter((id) => progress.donated[id]?.condition === 'pristine');
  return pristine.length / required.length;
}
