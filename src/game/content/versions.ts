import type { ItemVersion } from '../types/version';
import { ITEM_FORMS } from './items';

// One Version per Form for now (auto-derived, same name as the Form). When a
// Form gets a real second design/variant, replace this derivation with an
// explicit hand-written array of ItemVersion entries.
export const ITEM_VERSIONS: ItemVersion[] = ITEM_FORMS.map((form) => ({
  id: `${form.id}-standard`,
  formId: form.id,
  name: form.name,
}));

export function getVersion(versionId: string): ItemVersion {
  const version = ITEM_VERSIONS.find((v) => v.id === versionId);
  if (!version) throw new Error(`Unknown item version: ${versionId}`);
  return version;
}

export function getVersionsForForm(formId: string): ItemVersion[] {
  return ITEM_VERSIONS.filter((v) => v.formId === formId);
}
