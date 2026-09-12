import type { CollectorDefinition } from '../types/collector';
import { ITEM_FORMS } from './items';
import { isMasterSetComplete } from '../logic/masterSet';

export const COLLECTORS: CollectorDefinition[] = [
  {
    id: 'the-miner',
    name: 'The Miner',
    flavorText:
      "Used to work the deep shafts before everything ended. Says the old mines are still down there — full of ore and gear, if you're willing to go looking.",
    icon: 'pickaxe',
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
    icon: 'gem',
    requiredFormIds: ['iron-ore', 'quartz-shard', 'sulfur-lump'],
  },
  {
    id: 'the-clerk',
    name: 'The Clerk',
    flavorText:
      "Still keeps office hours, somehow. Says the paperwork never really stopped — it just stopped mattering to anyone but him.",
    icon: 'stamp',
    requiredFormIds: ['rubber-stamp', 'manila-folder', 'paperclip-chain', 'desk-fan'],
  },
  {
    id: 'the-widow',
    name: 'The Widow',
    flavorText: "Never says whose things she's collecting. Just says she'll know them when she sees them.",
    icon: 'watch',
    requiredFormIds: ['pocket-watch', 'leather-wallet', 'reading-glasses', 'brass-key'],
  },
  {
    id: 'the-archivist',
    name: 'The Archivist',
    flavorText:
      "Wants one of everything, no exceptions. Nobody's sure what they're actually archiving, or for who.",
    icon: 'book',
    // Wants one of everything, literally — every item form that exists, not a fixed snapshot.
    requiredFormIds: ITEM_FORMS.map((f) => f.id),
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
