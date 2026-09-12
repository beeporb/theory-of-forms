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
  {
    id: 'copper-vein',
    name: 'Copper Vein',
    setId: 'minerals',
    icon: 'layers',
    flavorText: 'Streaked blue-green, like the rock itself started to rust.',
  },
  {
    id: 'obsidian-shard',
    name: 'Obsidian Shard',
    setId: 'minerals',
    icon: 'diamond',
    flavorText: 'Black glass, sharp enough to still draw blood after all this time.',
  },
  {
    id: 'pressure-gauge',
    name: 'Pressure Gauge',
    setId: 'mining-equipment',
    icon: 'gauge',
    flavorText: "The needle's stuck well past the red line. Somehow it's still ticking.",
  },
  {
    id: 'blasting-fuse',
    name: 'Blasting Fuse',
    setId: 'mining-equipment',
    icon: 'flame',
    flavorText: 'Coiled tight and bone dry. No telling how long it’s been waiting to be lit.',
  },
  {
    id: 'rubber-stamp',
    name: 'Rubber Stamp',
    setId: 'office-relics',
    icon: 'stamp',
    flavorText: 'The ink pad dried out ages ago, but you can still make out APPROVED, backwards.',
  },
  {
    id: 'manila-folder',
    name: 'Manila Folder',
    setId: 'office-relics',
    icon: 'folder',
    flavorText: 'Whatever was inside is long gone. The folder remembers the shape of it anyway.',
  },
  {
    id: 'paperclip-chain',
    name: 'Paperclip Chain',
    setId: 'office-relics',
    icon: 'paperclip',
    flavorText: 'Somebody had a lot of time on their hands and not much else to do with it.',
  },
  {
    id: 'desk-fan',
    name: 'Desk Fan',
    setId: 'office-relics',
    icon: 'fan',
    flavorText: 'The blades still spin if you flick them. The cord goes nowhere.',
  },
  {
    id: 'pocket-watch',
    name: 'Pocket Watch',
    setId: 'personal-effects',
    icon: 'watch',
    flavorText: 'Stopped at the exact same time every day, no matter how long since it was wound.',
  },
  {
    id: 'leather-wallet',
    name: 'Worn Leather Wallet',
    setId: 'personal-effects',
    icon: 'wallet',
    flavorText: "Empty of cash, but somebody's photo is still tucked behind the seam.",
  },
  {
    id: 'reading-glasses',
    name: 'Reading Glasses',
    setId: 'personal-effects',
    icon: 'glasses',
    flavorText: 'One lens is cracked clean through. Someone still needed them enough to keep wearing them.',
  },
  {
    id: 'brass-key',
    name: 'Brass Key',
    setId: 'personal-effects',
    icon: 'key',
    flavorText: "Doesn't fit any lock still standing in this place.",
  },
];

export function getItemForm(formId: string): ItemForm {
  const form = ITEM_FORMS.find((f) => f.id === formId);
  if (!form) throw new Error(`Unknown item form: ${formId}`);
  return form;
}
