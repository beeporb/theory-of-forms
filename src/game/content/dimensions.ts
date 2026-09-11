import type { PocketDimensionDefinition } from '../types/grid';

const T = true;
const F = false;

// 5x5 warehouse floor plan with a couple of blocked-off aisles (irregular shape).
const WAREHOUSE_SHAPE: boolean[][] = [
  [T, T, T, T, T],
  [T, T, F, T, T],
  [T, T, T, T, T],
  [F, T, T, T, F],
  [T, T, T, T, T],
];

export const DIMENSIONS: PocketDimensionDefinition[] = [
  {
    id: 'warehouse',
    name: 'The Old Warehouse',
    shape: WAREHOUSE_SHAPE,
    itemPoolFormIds: [
      'iron-ore',
      'quartz-shard',
      'sulfur-lump',
      'pickaxe-head',
      'mining-lantern',
      'ore-cart-wheel',
    ],
  },
];

export function getDimensionDefinition(dimensionId: string): PocketDimensionDefinition {
  const def = DIMENSIONS.find((d) => d.id === dimensionId);
  if (!def) throw new Error(`Unknown dimension: ${dimensionId}`);
  return def;
}
