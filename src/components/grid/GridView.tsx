import type { GridPoint, PocketDimensionInstance } from '../../game/types/grid';
import { isAdjacent } from '../../game/logic/adjacency';
import { GridCell } from './GridCell';

interface GridViewProps {
  dimension: PocketDimensionInstance;
  position: GridPoint;
  extractionPoints: GridPoint[];
  onMoveTo: (x: number, y: number) => void;
}

export function GridView({ dimension, position, extractionPoints, onMoveTo }: GridViewProps) {
  const cols = dimension.cells[0]?.length ?? 0;
  const actorsByCell = new Map(dimension.actors.map((a) => [`${a.position.x},${a.position.y}`, a]));

  return (
    <div
      className="grid-view"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {dimension.cells.map((row) =>
        row.map((cell) => (
          <GridCell
            key={`${cell.x}-${cell.y}`}
            cell={cell}
            isCurrent={cell.x === position.x && cell.y === position.y}
            isReachable={cell.exists && isAdjacent(position, cell)}
            isExtractionPoint={extractionPoints.some((p) => p.x === cell.x && p.y === cell.y)}
            actor={actorsByCell.get(`${cell.x},${cell.y}`)}
            onMoveTo={() => onMoveTo(cell.x, cell.y)}
          />
        )),
      )}
    </div>
  );
}
