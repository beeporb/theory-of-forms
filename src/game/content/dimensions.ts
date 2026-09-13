import type { PocketDimensionDefinition } from '../types/grid';
import { getCollector } from './collectors';
import { isMasterSetComplete } from '../logic/masterSet';

export const DIMENSIONS: PocketDimensionDefinition[] = [
  {
    id: 'warehouse',
    name: 'The Old Warehouse',
    itemPoolFormIds: [
      'iron-ore',
      'quartz-shard',
      'sulfur-lump',
      'pickaxe-head',
      'mining-lantern',
      'ore-cart-wheel',
      'copper-vein',
      'obsidian-shard',
      'pressure-gauge',
      'blasting-fuse',
      'rubber-stamp',
      'manila-folder',
      'paperclip-chain',
      'desk-fan',
      'pocket-watch',
      'leather-wallet',
      'reading-glasses',
      'brass-key',
      // Exclusive to the Warehouse — see tests/content.test.ts.
      'forklift-fork',
      'inventory-clipboard',
    ],
    gearPool: ['bent-pipe', 'work-overalls', 'pocket-multitool', 'warehouse-keycard'],
    // Floor plan is regenerated (size, shape, entry, extraction points) each time the warehouse is entered.
    minRows: 4,
    maxRows: 7,
    minCols: 4,
    maxCols: 7,
    fillRatioRange: [0.55, 0.85],
    extractionPointCountRange: [2, 3],
    minMovesToExtractRange: [3, 6],
    actorPool: ['feral-scavenger', 'wandering-peddler', 'roaming-miner'],
    actorCountRange: [1, 3],
  },
  {
    id: 'records-office',
    name: 'The Records Office',
    itemPoolFormIds: [
      'rubber-stamp',
      'manila-folder',
      'paperclip-chain',
      'desk-fan',
      'pocket-watch',
      'leather-wallet',
      'reading-glasses',
      'brass-key',
      // Exclusive to the Records Office — see tests/content.test.ts.
      'carbon-copy-ledger',
      'engraved-cufflink',
    ],
    gearPool: ['pocket-multitool', 'riot-vest', 'signal-booster', 'override-chip'],
    // A denser maze of cubicles and filing rooms rather than open warehouse floor.
    minRows: 4,
    maxRows: 6,
    minCols: 4,
    maxCols: 6,
    fillRatioRange: [0.65, 0.9],
    extractionPointCountRange: [2, 3],
    minMovesToExtractRange: [4, 7],
    actorPool: ['feral-scavenger', 'wandering-peddler', 'roaming-miner'],
    actorCountRange: [1, 2],
    unlockCondition: (meta) => meta.character.level >= 3,
  },
  {
    id: 'deep-vein',
    name: 'The Deep Vein',
    itemPoolFormIds: [
      'iron-ore',
      'quartz-shard',
      'sulfur-lump',
      'copper-vein',
      'obsidian-shard',
      'pickaxe-head',
      'mining-lantern',
      'ore-cart-wheel',
      'pressure-gauge',
      'blasting-fuse',
      // Exclusive to the Deep Vein — see tests/content.test.ts.
      'seam-crystal',
      'drill-bit-core',
    ],
    gearPool: ['scavenged-cleaver', 'arc-welder-torch', 'geiger-counter', 'lead-lined-coat'],
    // Bigger and sparser than the warehouse — a real mine, not a storeroom.
    minRows: 6,
    maxRows: 9,
    minCols: 6,
    maxCols: 9,
    fillRatioRange: [0.5, 0.75],
    extractionPointCountRange: [2, 4],
    minMovesToExtractRange: [5, 9],
    actorPool: ['feral-scavenger', 'wandering-peddler', 'roaming-miner'],
    actorCountRange: [2, 4],
    unlockCondition: (meta) => {
      const miner = getCollector('the-miner');
      const progress = meta.collectors[miner.id] ?? { collectorId: miner.id, donated: {} };
      return isMasterSetComplete(miner, progress);
    },
  },
];

export function getDimensionDefinition(dimensionId: string): PocketDimensionDefinition {
  const def = DIMENSIONS.find((d) => d.id === dimensionId);
  if (!def) throw new Error(`Unknown dimension: ${dimensionId}`);
  return def;
}
