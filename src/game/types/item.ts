import type { Rarity } from './rarity';

export interface ItemForm {
  id: string;
  name: string;
  setId: string;
  icon: string;
}

export interface ItemInstance {
  instanceId: string;
  formId: string;
  rarity: Rarity;
}
