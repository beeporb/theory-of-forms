import type { TagSkillDefinition, TagSkillId } from '../types/character';

// Icons mirror LoadoutManager's SLOT_ICON so a slot reads the same everywhere.
export const TAG_SKILL_CATALOG: TagSkillDefinition[] = [
  {
    id: 'weapon',
    name: 'Weaponcraft',
    description: 'Built up by carrying a weapon into runs. Reduces hazard damage.',
    icon: 'sword',
  },
  {
    id: 'armor',
    name: 'Armorwork',
    description: 'Built up by carrying armor into runs. Makes hazards less likely to steal from you.',
    icon: 'shield',
  },
  {
    id: 'tool',
    name: 'Toolcraft',
    description: 'Built up by carrying a tool into runs. Improves what positive encounters recover.',
    icon: 'wrench',
  },
];

export function getTagSkill(id: TagSkillId): TagSkillDefinition {
  const skill = TAG_SKILL_CATALOG.find((s) => s.id === id);
  if (!skill) throw new Error(`Unknown tag skill: ${id}`);
  return skill;
}
