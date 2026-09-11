import type { Outcome } from './outcome';

export type CellStatus = 'unopened' | 'opened';

export interface GridPoint {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  exists: boolean;
  status: CellStatus;
  outcome: Outcome | null;
}

export interface PocketDimensionDefinition {
  id: string;
  name: string;
  /** Rows x cols mask; true = playable cell. Allows irregular (non-rectangular) shapes. */
  shape: boolean[][];
  itemPoolFormIds: string[];
  /** Where the player starts, and can first move from. */
  entry: GridPoint;
  /** Squares the player must reach to extract. */
  extractionPoints: GridPoint[];
  /** Moves the player must make through the grid before extraction is allowed. */
  minMovesToExtract: number;
}

export interface PocketDimensionInstance {
  definitionId: string;
  cells: Cell[][];
}
