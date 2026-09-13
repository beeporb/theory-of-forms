import type { GearItem } from '../types/gear';

// Starting loadout: one item per equippable slot, so a fresh player has
// something in hand without owning the whole catalog outright. Everything
// else here is found in pocket dimensions (see PocketDimensionDefinition.gearPool
// and the 'gear' outcome in generateDimension.ts) and kept on extraction.
export const STARTER_GEAR_IDS: string[] = ['rusty-crowbar', 'patched-jacket', 'hand-lamp'];

export const GEAR_CATALOG: GearItem[] = [
  {
    id: 'rusty-crowbar',
    name: 'Rusty Crowbar',
    slot: 'weapon',
    icon: 'sword',
    rarity: 'mundane',
    flavorText: 'Dented, dull, and somehow still swinging. Better than fists.',
    effect: { hazardDamageMultiplierBonus: -0.05 },
  },
  {
    id: 'bent-pipe',
    name: 'Bent Pipe',
    slot: 'weapon',
    icon: 'sword',
    rarity: 'odd',
    flavorText: 'Pulled from somewhere it shouldn’t have fit. Rings faintly when it connects.',
    effect: { hazardDamageMultiplierBonus: -0.08 },
  },
  {
    id: 'scavenged-cleaver',
    name: 'Scavenged Cleaver',
    slot: 'weapon',
    icon: 'sword',
    rarity: 'uncanny',
    flavorText: 'Somebody’s kitchen knife, sharpened past recognition. Still remembers what it was for.',
    effect: { hazardDamageMultiplierBonus: -0.12 },
  },
  {
    id: 'arc-welder-torch',
    name: 'Arc Welder Torch',
    slot: 'weapon',
    icon: 'flame',
    rarity: 'unstable',
    flavorText: 'The tank hisses when you don’t expect it to. Cuts through more than metal.',
    effect: { hazardDamageMultiplierBonus: -0.18 },
  },
  {
    id: 'patched-jacket',
    name: 'Patched Jacket',
    slot: 'armor',
    icon: 'shield',
    rarity: 'mundane',
    flavorText: 'Held together by tape and stubbornness. Keeps most of the cold out.',
    effect: { hazardStealChanceMultiplierBonus: -0.05 },
  },
  {
    id: 'work-overalls',
    name: 'Work Overalls',
    slot: 'armor',
    icon: 'shield',
    rarity: 'odd',
    flavorText: 'The stains never wash out, and the pockets are somehow bigger inside than out.',
    effect: { hazardStealChanceMultiplierBonus: -0.08, maxHealthBonus: 5 },
  },
  {
    id: 'riot-vest',
    name: 'Riot Vest',
    slot: 'armor',
    icon: 'shield',
    rarity: 'uncanny',
    flavorText: 'Government-issue, decades expired. The plates still stop most of what matters.',
    effect: { hazardStealChanceMultiplierBonus: -0.12, maxHealthBonus: 10 },
  },
  {
    id: 'lead-lined-coat',
    name: 'Lead-Lined Coat',
    slot: 'armor',
    icon: 'shield',
    rarity: 'impossible',
    flavorText: 'Heavier than it should be, and the lining hums faintly if you stand still too long.',
    effect: { hazardStealChanceMultiplierBonus: -0.2, maxHealthBonus: 15 },
  },
  {
    id: 'hand-lamp',
    name: 'Hand Lamp',
    slot: 'tool',
    icon: 'lamp',
    rarity: 'mundane',
    flavorText: 'Dim, reliable, and always exactly as bright as you need it to be.',
    effect: { lootWeightBonus: 3 },
  },
  {
    id: 'pocket-multitool',
    name: 'Pocket Multitool',
    slot: 'tool',
    icon: 'wrench',
    rarity: 'odd',
    flavorText: 'Has more attachments than it should. One of them doesn’t have a name.',
    effect: { lootWeightBonus: 5, positiveHealMultiplierBonus: 0.05 },
  },
  {
    id: 'geiger-counter',
    name: 'Geiger Counter',
    slot: 'tool',
    icon: 'gauge',
    rarity: 'uncanny',
    flavorText: 'Clicks more than it should, even in rooms that seem perfectly normal.',
    effect: { lootWeightBonus: 6, weirdnessTierBias: 1 },
  },
  {
    id: 'signal-booster',
    name: 'Signal Booster',
    slot: 'tool',
    icon: 'radio',
    rarity: 'unstable',
    flavorText: 'Picks up broadcasts from stations that stopped transmitting years ago.',
    effect: { lootWeightBonus: 10, positiveHealMultiplierBonus: 0.1 },
  },
  {
    id: 'warehouse-keycard',
    name: 'Warehouse Keycard',
    slot: 'key',
    icon: 'key',
    rarity: 'mundane',
    flavorText: 'The photo’s worn to a smear, but the strip still reads. Should still open something.',
  },
  {
    id: 'override-chip',
    name: 'Override Chip',
    slot: 'key',
    icon: 'cpu',
    rarity: 'odd',
    flavorText: 'Pulled from a machine that was never supposed to be opened. Fits sockets that shouldn’t exist yet.',
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
