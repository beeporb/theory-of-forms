import type { GridPoint, PocketDimensionDefinition } from '../types/grid';
import { randomInt } from '../utils/rng';

export interface GeneratedLayout {
  shape: boolean[][];
  entry: GridPoint;
  extractionPoints: GridPoint[];
  /** Distance (in steps) of every existing cell from the entry, keyed by `pointKey`. */
  distances: Map<string, number>;
}

type LayoutConfig = Pick<
  PocketDimensionDefinition,
  'minRows' | 'maxRows' | 'minCols' | 'maxCols' | 'fillRatioRange' | 'extractionPointCountRange'
>;

export function pointKey(p: GridPoint): string {
  return `${p.x},${p.y}`;
}

const key = pointKey;

function neighborsOf(p: GridPoint): GridPoint[] {
  return [
    { x: p.x + 1, y: p.y },
    { x: p.x - 1, y: p.y },
    { x: p.x, y: p.y + 1 },
    { x: p.x, y: p.y - 1 },
  ];
}

function inBounds(p: GridPoint, rows: number, cols: number): boolean {
  return p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows;
}

function bfsDistances(shape: boolean[][], start: GridPoint): Map<string, number> {
  const rows = shape.length;
  const cols = shape[0]?.length ?? 0;
  const distances = new Map<string, number>([[key(start), 0]]);
  const queue: GridPoint[] = [start];

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    for (const neighbor of neighborsOf(current)) {
      if (
        inBounds(neighbor, rows, cols) &&
        shape[neighbor.y][neighbor.x] &&
        !distances.has(key(neighbor))
      ) {
        distances.set(key(neighbor), (distances.get(key(current)) ?? 0) + 1);
        queue.push(neighbor);
      }
    }
  }

  return distances;
}

/**
 * Grows a random, always-connected floor plan outward from a random entry cell
 * (a randomized flood fill), so every playable cell is guaranteed reachable
 * without needing a separate connectivity check.
 */
export function generateLayout(config: LayoutConfig): GeneratedLayout {
  const rows = randomInt(config.minRows, config.maxRows);
  const cols = randomInt(config.minCols, config.maxCols);
  const [minFill, maxFill] = config.fillRatioRange;
  const fillRatio = minFill + Math.random() * (maxFill - minFill);
  const [minPoints, maxPoints] = config.extractionPointCountRange;
  const totalCells = rows * cols;
  const targetCount = Math.min(totalCells, Math.max(minPoints + 2, Math.round(totalCells * fillRatio)));

  const entry: GridPoint = { x: randomInt(0, cols - 1), y: randomInt(0, rows - 1) };
  const existing = new Set<string>([key(entry)]);
  const frontier: GridPoint[] = neighborsOf(entry).filter((p) => inBounds(p, rows, cols));

  while (existing.size < targetCount && frontier.length > 0) {
    const index = randomInt(0, frontier.length - 1);
    const [candidate] = frontier.splice(index, 1);
    if (existing.has(key(candidate))) continue;
    existing.add(key(candidate));
    for (const neighbor of neighborsOf(candidate)) {
      if (inBounds(neighbor, rows, cols) && !existing.has(key(neighbor))) {
        frontier.push(neighbor);
      }
    }
  }

  const shape: boolean[][] = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => existing.has(key({ x, y }))),
  );

  const distances = bfsDistances(shape, entry);
  const reachable = [...existing]
    .filter((k) => k !== key(entry))
    .map((k) => {
      const [x, y] = k.split(',').map(Number);
      return { x, y };
    })
    .sort((a, b) => (distances.get(key(b)) ?? 0) - (distances.get(key(a)) ?? 0));

  const pointCount = Math.min(reachable.length, Math.max(1, randomInt(minPoints, maxPoints)));
  const candidatePool = reachable.slice(0, Math.max(pointCount, Math.ceil(reachable.length / 2)));
  const extractionPoints: GridPoint[] = [];
  while (extractionPoints.length < pointCount && candidatePool.length > 0) {
    const index = randomInt(0, candidatePool.length - 1);
    extractionPoints.push(candidatePool.splice(index, 1)[0]);
  }

  return { shape, entry, extractionPoints, distances };
}
