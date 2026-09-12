import type { MaterialDefinition } from '../types/material';

export const MATERIALS: MaterialDefinition[] = [
  {
    id: 'scrap-metal',
    name: 'Scrap Metal',
    icon: 'cog',
    flavorText: 'Bent and rust-spotted, but still good stock for something new.',
  },
  {
    id: 'salvaged-circuitry',
    name: 'Salvaged Circuitry',
    icon: 'cpu',
    flavorText: 'Pried out of something that used to hum. Most of the traces still look intact.',
  },
  {
    id: 'worn-leather',
    name: 'Worn Leather',
    icon: 'layers',
    flavorText: 'Cracked and soft with age, cut down from something that used to be whole.',
  },
  {
    id: 'machine-parts',
    name: 'Machine Parts',
    icon: 'wrench',
    flavorText: 'Gears, springs, and fittings pulled from a dozen different machines. None of them match.',
  },
];

export function getMaterial(materialId: string): MaterialDefinition {
  const material = MATERIALS.find((m) => m.id === materialId);
  if (!material) throw new Error(`Unknown material: ${materialId}`);
  return material;
}
