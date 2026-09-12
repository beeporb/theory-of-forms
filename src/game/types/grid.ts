import type { Outcome } from './outcome';
import type { ActorInstance } from './actor';
import type { PlayerMeta } from './player';

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
  /** Gear ids a 'loot' cell here can occasionally yield instead of an item — see rollLeafOutcome. */
  gearPool: string[];
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
  /** Actor definition ids that can be spawned into a generated layout. */
  actorPool: string[];
  /** How many roaming actors a generated layout gets. */
  actorCountRange: [number, number];
  /** Unlocked from the very start when omitted; otherwise checked after runs/donations. */
  unlockCondition?: (meta: PlayerMeta) => boolean;
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
  /** Roaming actors currently on the board; they move each time the player does. */
  actors: ActorInstance[];
}
