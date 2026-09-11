import type { RunState } from '../types/player';
import { getDimensionDefinition } from '../content/dimensions';

export function canExtract(run: RunState): boolean {
  const definition = getDimensionDefinition(run.dimension.definitionId);
  const atExtractionPoint = definition.extractionPoints.some(
    (p) => p.x === run.position.x && p.y === run.position.y,
  );
  return atExtractionPoint && run.moveCount >= definition.minMovesToExtract;
}
