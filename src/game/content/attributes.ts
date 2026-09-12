import type { AttributeDefinition, AttributeId } from '../types/character';

export const ATTRIBUTE_CATALOG: AttributeDefinition[] = [
  {
    id: 'grit',
    name: 'Grit',
    description: 'Toughness. Each point raises your max health for the run.',
    icon: 'mountain',
  },
  {
    id: 'perception',
    name: 'Perception',
    description: 'Wariness. Each point makes hazards less likely to steal from you.',
    icon: 'search',
  },
  {
    id: 'luck',
    name: 'Luck',
    description:
      "Fortune's favor. Each point tilts what you find toward loot, and loot toward better condition and weirdness.",
    icon: 'sparkles',
  },
  {
    id: 'finesse',
    name: 'Finesse',
    description: 'Nimbleness. Each point reduces the damage hazards land on you.',
    icon: 'cog',
  },
];

export function getAttribute(id: AttributeId): AttributeDefinition {
  const attribute = ATTRIBUTE_CATALOG.find((a) => a.id === id);
  if (!attribute) throw new Error(`Unknown attribute: ${id}`);
  return attribute;
}
