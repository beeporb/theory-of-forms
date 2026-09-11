import type { ItemForm } from '../types/item';

export const ITEM_FORMS: ItemForm[] = [
  { id: 'iron-ore', name: 'Iron Ore', setId: 'minerals', icon: '🪨' },
  { id: 'quartz-shard', name: 'Quartz Shard', setId: 'minerals', icon: '💎' },
  { id: 'sulfur-lump', name: 'Sulfur Lump', setId: 'minerals', icon: '🟡' },
  { id: 'pickaxe-head', name: 'Pickaxe Head', setId: 'mining-equipment', icon: '⛏️' },
  { id: 'mining-lantern', name: 'Mining Lantern', setId: 'mining-equipment', icon: '🏮' },
  { id: 'ore-cart-wheel', name: 'Ore Cart Wheel', setId: 'mining-equipment', icon: '⚙️' },
];

export function getItemForm(formId: string): ItemForm {
  const form = ITEM_FORMS.find((f) => f.id === formId);
  if (!form) throw new Error(`Unknown item form: ${formId}`);
  return form;
}
