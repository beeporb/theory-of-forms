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
  itemPoolFormIds: string[];
  /** Bounding box row/col counts a generated layout is randomly sized within. */
  minRows: number;
  maxRows: number;
  minCols: number;
  maxCols: number;
  /** Fraction of the bounding box that ends up playable, randomised per run to vary shape irregularity. */
  fillRatioRange: [number, number];
  /** How many extraction points a generated layout gets. */
  extractionPointCountRange: [number, number];
  /** Moves the player must make through the grid before extraction is allowed. */
  minMovesToExtractRange: [number, number];
}

export interface PocketDimensionInstance {
  definitionId: string;
  cells: Cell[][];
  /** Where the player started this run, and can first move from. */
  entry: GridPoint;
  /** Squares the player must reach to extract this run. */
  extractionPoints: GridPoint[];
  /** Moves the player must make through the grid before extraction is allowed this run. */
  minMovesToExtract: number;
}
