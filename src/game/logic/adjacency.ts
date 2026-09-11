import type { GridPoint } from '../types/grid';

export function isAdjacent(a: GridPoint, b: GridPoint): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}
