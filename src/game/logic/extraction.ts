import type { RunState } from '../types/player';

export function canExtract(run: RunState): boolean {
  const atExtractionPoint = run.dimension.extractionPoints.some(
    (p) => p.x === run.position.x && p.y === run.position.y,
  );
  return atExtractionPoint && run.moveCount >= run.dimension.minMovesToExtract;
}
