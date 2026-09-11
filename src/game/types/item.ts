import type { Condition } from './condition';
import type { Weirdness } from './weirdness';

export interface ItemForm {
  id: string;
  name: string;
  setId: string;
  icon: string;
}

export interface ItemInstance {
  instanceId: string;
  versionId: string;
  condition: Condition;
  weirdness: Weirdness;
}
