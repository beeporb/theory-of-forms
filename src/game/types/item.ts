import type { Condition } from './condition';
import type { Weirdness } from './weirdness';
import type { IconName } from './icon';

export interface ItemForm {
  id: string;
  name: string;
  setId: string;
  icon: IconName;
  flavorText: string;
}

export interface ItemInstance {
  instanceId: string;
  versionId: string;
  condition: Condition;
  weirdness: Weirdness;
}
