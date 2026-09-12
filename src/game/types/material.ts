import type { IconName } from './icon';

// Materials are a plain named+count resource (see PlayerMeta.materials), not
// instance-based like items/gear — no condition or rarity. This is the shape
// #54 (crafting) is expected to consume as ingredients.
export interface MaterialDefinition {
  id: string;
  name: string;
  icon: IconName;
  flavorText: string;
}
