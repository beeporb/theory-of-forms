import type { ActorDefinition } from '../types/actor';

export const ACTORS: ActorDefinition[] = [
  {
    id: 'feral-scavenger',
    kind: 'adversary',
    name: 'Feral Scavenger',
    icon: 'skull',
    flavorText: "Something's been living down here longer than you have, and it doesn't want company.",
    damageRange: [5, 15],
  },
  {
    id: 'wandering-peddler',
    kind: 'trader',
    name: 'Wandering Peddler',
    icon: 'coins',
    flavorText: 'Sets up shop anywhere with a floor. Patches you up before you even ask why.',
    healAmount: 15,
  },
  {
    id: 'roaming-miner',
    kind: 'collector',
    name: 'The Miner',
    icon: 'pickaxe',
    flavorText: "Out doing his own digging instead of waiting back home for donations.",
    collectorId: 'the-miner',
  },
];

export function getActorDefinition(actorId: string): ActorDefinition {
  const actor = ACTORS.find((a) => a.id === actorId);
  if (!actor) throw new Error(`Unknown actor: ${actorId}`);
  return actor;
}
