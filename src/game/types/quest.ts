/**
 * Reward shape is intentionally the same currency/material vocabulary #54
 * (crafting) will consume: a flat widgets count, a named material + count,
 * and/or a gear id. Keep it this simple — don't add new reward kinds here
 * without checking whether #54 already covers the case.
 */
export interface QuestReward {
  widgets?: number;
  materialId?: string;
  materialCount?: number;
  gearId?: string;
}

export interface QuestDefinition {
  id: string;
  collectorId: string;
  description: string;
  /** Matched by form, not a specific version/condition/rarity — see getVersionsForForm. */
  requirement: { formId: string; count: number };
  reward: QuestReward;
}
