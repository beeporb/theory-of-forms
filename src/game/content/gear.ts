import type { GearItem } from '../types/gear';

// Two options per slot so losing one to death doesn't fully lock the player
// out of that slot. Gear acquisition beyond this starting catalog (finding
// more, buying more) is a deliberate later step, not built yet.
export const GEAR_CATALOG: GearItem[] = [
  {
    id: 'rusty-crowbar',
    name: 'Rusty Crowbar',
    slot: 'weapon',
    icon: 'sword',
    rarity: 'mundane',
    flavorText: 'Dented, dull, and somehow still swinging. Better than fists.',
  },
  {
    id: 'bent-pipe',
    name: 'Bent Pipe',
    slot: 'weapon',
    icon: 'sword',
    rarity: 'odd',
    flavorText: 'Pulled from somewhere it shouldn’t have fit. Rings faintly when it connects.',
  },
  {
    id: 'patched-jacket',
    name: 'Patched Jacket',
    slot: 'armor',
    icon: 'shield',
    rarity: 'mundane',
    flavorText: 'Held together by tape and stubbornness. Keeps most of the cold out.',
  },
  {
    id: 'work-overalls',
    name: 'Work Overalls',
    slot: 'armor',
    icon: 'shield',
    rarity: 'odd',
    flavorText: 'The stains never wash out, and the pockets are somehow bigger inside than out.',
  },
  {
    id: 'hand-lamp',
    name: 'Hand Lamp',
    slot: 'tool',
    icon: 'lamp',
    rarity: 'mundane',
    flavorText: 'Dim, reliable, and always exactly as bright as you need it to be.',
  },
  {
    id: 'pocket-multitool',
    name: 'Pocket Multitool',
    slot: 'tool',
    icon: 'wrench',
    rarity: 'odd',
    flavorText: 'Has more attachments than it should. One of them doesn’t have a name.',
  },
];

export function getGear(gearId: string): GearItem {
  const gear = GEAR_CATALOG.find((g) => g.id === gearId);
  if (!gear) throw new Error(`Unknown gear: ${gearId}`);
  return gear;
}

export function getGearForSlot(slot: GearItem['slot']): GearItem[] {
  return GEAR_CATALOG.filter((g) => g.slot === slot);
}
