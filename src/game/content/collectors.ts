import type { CollectorDefinition } from '../types/collector';
import { isMasterSetComplete } from '../logic/masterSet';

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
  {
    id: 'the-jeweler',
    name: 'The Jeweler',
    flavorText:
      "Doesn't care about the rusted tools, just the stones. Says a good mineral has more character now than it ever did before the world ended.",
    requiredFormIds: ['iron-ore', 'quartz-shard', 'sulfur-lump'],
  },
  {
    id: 'the-archivist',
    name: 'The Archivist',
    flavorText:
      "Wants one of everything, no exceptions. Nobody's sure what they're actually archiving, or for who.",
    requiredFormIds: [
      'iron-ore',
      'quartz-shard',
      'sulfur-lump',
      'pickaxe-head',
      'mining-lantern',
      'ore-cart-wheel',
    ],
    secret: true,
    revealCondition: (meta) =>
      COLLECTORS.some(
        (c) =>
          !c.secret &&
          isMasterSetComplete(c, meta.collectors[c.id] ?? { collectorId: c.id, donated: {} }),
      ),
  },
];

export function getCollector(collectorId: string): CollectorDefinition {
  const collector = COLLECTORS.find((c) => c.id === collectorId);
  if (!collector) throw new Error(`Unknown collector: ${collectorId}`);
  return collector;
}
