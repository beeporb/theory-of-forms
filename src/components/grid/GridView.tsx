import type { PocketDimensionInstance } from '../../game/types/grid';
import { GridCell } from './GridCell';

interface GridViewProps {
  dimension: PocketDimensionInstance;
  onOpenCell: (x: number, y: number) => void;
}

export function GridView({ dimension, onOpenCell }: GridViewProps) {
  const cols = dimension.cells[0]?.length ?? 0;

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
            onOpen={() => onOpenCell(cell.x, cell.y)}
          />
        )),
      )}
    </div>
  );
}
