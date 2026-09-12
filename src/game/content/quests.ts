import type { QuestDefinition } from '../types/quest';

// 1-2 quests per non-secret collector, thematically tied to what each one
// already asks for. The Archivist (secret, wants everything) has none —
// nothing thematically distinct to hang a quest on.
export const QUESTS: QuestDefinition[] = [
  {
    id: 'miner-ore-run',
    collectorId: 'the-miner',
    description: 'Bring me 3 Iron Ore and I’ll break the rest down into scrap for you.',
    requirement: { formId: 'iron-ore', count: 3 },
    reward: { materialId: 'scrap-metal', materialCount: 3 },
  },
  {
    id: 'miner-pickaxe-favor',
    collectorId: 'the-miner',
    description: 'Find me a good Pickaxe Head and I’ve got a Geiger counter that’s been gathering dust.',
    requirement: { formId: 'pickaxe-head', count: 1 },
    reward: { gearId: 'geiger-counter' },
  },
  {
    id: 'jeweler-quartz-cut',
    collectorId: 'the-jeweler',
    description: 'Two clean Quartz Shards, and I’ll pay in widgets — always good for trade.',
    requirement: { formId: 'quartz-shard', count: 2 },
    reward: { widgets: 50 },
  },
  {
    id: 'jeweler-sulfur-batch',
    collectorId: 'the-jeweler',
    description: 'Bring me 2 Sulfur Lumps. Smells terrible, pays fine.',
    requirement: { formId: 'sulfur-lump', count: 2 },
    reward: { widgets: 40 },
  },
  {
    id: 'clerk-desk-fan-parts',
    collectorId: 'the-clerk',
    description: 'Bring me a working Desk Fan and I’ll strip the parts myself — paperwork be damned.',
    requirement: { formId: 'desk-fan', count: 1 },
    reward: { materialId: 'machine-parts', materialCount: 2 },
  },
  {
    id: 'clerk-stamp-run',
    collectorId: 'the-clerk',
    description: 'Two Rubber Stamps, no questions asked. I’ll make it worth your while in widgets.',
    requirement: { formId: 'rubber-stamp', count: 2 },
    reward: { widgets: 25 },
  },
  {
    id: 'widow-pocket-watch',
    collectorId: 'the-widow',
    description: 'Bring me a Pocket Watch that still ticks, and I’ll trade you something just as strange.',
    requirement: { formId: 'pocket-watch', count: 1 },
    reward: { gearId: 'override-chip' },
  },
  {
    id: 'widow-wallet-leather',
    collectorId: 'the-widow',
    description: 'Two worn wallets — I’ll salvage the leather myself. You keep the scraps.',
    requirement: { formId: 'leather-wallet', count: 2 },
    reward: { materialId: 'worn-leather', materialCount: 3 },
  },
];

export function getQuest(questId: string): QuestDefinition {
  const quest = QUESTS.find((q) => q.id === questId);
  if (!quest) throw new Error(`Unknown quest: ${questId}`);
  return quest;
}

export function getQuestsForCollector(collectorId: string): QuestDefinition[] {
  return QUESTS.filter((q) => q.collectorId === collectorId);
}
