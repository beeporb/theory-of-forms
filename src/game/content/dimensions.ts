import type { PocketDimensionDefinition } from '../types/grid';

export const DIMENSIONS: PocketDimensionDefinition[] = [
  {
    id: 'warehouse',
    name: 'The Old Warehouse',
    itemPoolFormIds: [
      'iron-ore',
      'quartz-shard',
      'sulfur-lump',
      'pickaxe-head',
      'mining-lantern',
      'ore-cart-wheel',
    ],
    // Floor plan is regenerated (size, shape, entry, extraction points) each time the warehouse is entered.
    minRows: 4,
    maxRows: 7,
    minCols: 4,
    maxCols: 7,
    fillRatioRange: [0.55, 0.85],
    extractionPointCountRange: [2, 3],
    minMovesToExtractRange: [3, 6],
  },
];

export function getDimensionDefinition(dimensionId: string): PocketDimensionDefinition {
  const def = DIMENSIONS.find((d) => d.id === dimensionId);
  if (!def) throw new Error(`Unknown dimension: ${dimensionId}`);
  return def;
}
