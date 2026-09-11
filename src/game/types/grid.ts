import type { Outcome } from './outcome';

export type CellStatus = 'unopened' | 'opened';

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
}

export interface PocketDimensionInstance {
  definitionId: string;
  cells: Cell[][];
}
