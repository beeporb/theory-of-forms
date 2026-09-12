import type { ItemForm } from '../types/item';

export const ITEM_FORMS: ItemForm[] = [
  {
    id: 'iron-ore',
    name: 'Iron Ore',
    setId: 'minerals',
    icon: 'mountain',
    flavorText: 'Heavy, rust-streaked, and still faintly warm from wherever it was pulled out of.',
  },
  {
    id: 'quartz-shard',
    name: 'Quartz Shard',
    setId: 'minerals',
    icon: 'gem',
    flavorText: 'Catches the light strangely, like it remembers a sun that isn’t there anymore.',
  },
  {
    id: 'sulfur-lump',
    name: 'Sulfur Lump',
    setId: 'minerals',
    icon: 'flask',
    flavorText: 'Smells like a struck match. Nobody has explained why it’s always faintly warm.',
  },
  {
    id: 'pickaxe-head',
    name: 'Pickaxe Head',
    setId: 'mining-equipment',
    icon: 'pickaxe',
    flavorText: 'Separated from its handle a long time ago. The edge still holds.',
  },
  {
    id: 'mining-lantern',
    name: 'Mining Lantern',
    setId: 'mining-equipment',
    icon: 'lamp',
    flavorText: 'The glass is cracked but the flame inside never seems to go out.',
  },
  {
    id: 'ore-cart-wheel',
    name: 'Ore Cart Wheel',
    setId: 'mining-equipment',
    icon: 'cog',
    flavorText: 'Rolled here from somewhere much deeper. There’s no cart in sight.',
  },
];

export function getItemForm(formId: string): ItemForm {
  const form = ITEM_FORMS.find((f) => f.id === formId);
  if (!form) throw new Error(`Unknown item form: ${formId}`);
  return form;
}
