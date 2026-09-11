import type { GearItem } from '../types/gear';

// Two options per slot so losing one to death doesn't fully lock the player
// out of that slot. Gear acquisition beyond this starting catalog (finding
// more, buying more) is a deliberate later step, not built yet.
export const GEAR_CATALOG: GearItem[] = [
  { id: 'rusty-crowbar', name: 'Rusty Crowbar', slot: 'weapon' },
  { id: 'bent-pipe', name: 'Bent Pipe', slot: 'weapon' },
  { id: 'patched-jacket', name: 'Patched Jacket', slot: 'armor' },
  { id: 'work-overalls', name: 'Work Overalls', slot: 'armor' },
  { id: 'hand-lamp', name: 'Hand Lamp', slot: 'tool' },
  { id: 'pocket-multitool', name: 'Pocket Multitool', slot: 'tool' },
];

export function getGear(gearId: string): GearItem {
  const gear = GEAR_CATALOG.find((g) => g.id === gearId);
  if (!gear) throw new Error(`Unknown gear: ${gearId}`);
  return gear;
}

export function getGearForSlot(slot: GearItem['slot']): GearItem[] {
  return GEAR_CATALOG.filter((g) => g.slot === slot);
}
