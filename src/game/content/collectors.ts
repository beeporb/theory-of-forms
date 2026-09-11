import type { CollectorDefinition } from '../types/collector';

export const COLLECTORS: CollectorDefinition[] = [
  {
    id: 'the-miner',
    name: 'The Miner',
    flavorText:
      "Used to work the deep shafts before everything ended. Says the old mines are still down there — full of ore and gear, if you're willing to go looking.",
    requiredFormIds: [
      'iron-ore',
      'quartz-shard',
      'sulfur-lump',
      'pickaxe-head',
      'mining-lantern',
      'ore-cart-wheel',
    ],
  },
];

export function getCollector(collectorId: string): CollectorDefinition {
  const collector = COLLECTORS.find((c) => c.id === collectorId);
  if (!collector) throw new Error(`Unknown collector: ${collectorId}`);
  return collector;
}
