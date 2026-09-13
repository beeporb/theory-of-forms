import { describe, expect, it } from 'vitest';
import { ITEM_FORMS, getItemForm } from '../src/game/content/items';
import { SET_LABEL } from '../src/game/content/sets';
import { DIMENSIONS } from '../src/game/content/dimensions';
import { ACTORS, getActorDefinition } from '../src/game/content/actors';
import { COLLECTORS, getCollector } from '../src/game/content/collectors';
import { GEAR_CATALOG, getGear } from '../src/game/content/gear';
import { MATERIALS, getMaterial } from '../src/game/content/materials';
import { QUESTS } from '../src/game/content/quests';
import { RECIPES } from '../src/game/content/recipes';
import { EVENTS } from '../src/game/content/events';
import { BREAKDOWN_MATERIAL_BY_SET } from '../src/game/logic/breakdown';
import { CONDITION_ORDER } from '../src/game/types/condition';
import { CONDITION_WEIGHTS } from '../src/game/content/conditionTable';
import { WEIRDNESS_ORDER } from '../src/game/types/weirdness';
import { WEIRDNESS_WEIGHTS } from '../src/game/content/weirdnessTable';

describe('content integrity', () => {
  it('gives every item form a labelled set', () => {
    for (const form of ITEM_FORMS) {
      expect(SET_LABEL[form.setId]).toBeDefined();
    }
  });

  it('gives every item form non-empty flavor text', () => {
    for (const form of ITEM_FORMS) {
      expect(form.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('resolves every dimension item pool entry to a real item form', () => {
    for (const dimension of DIMENSIONS) {
      for (const formId of dimension.itemPoolFormIds) {
        expect(() => getItemForm(formId)).not.toThrow();
      }
    }
  });

  it('gives every dimension at least one item form found nowhere else (#80)', () => {
    for (const dimension of DIMENSIONS) {
      const others = DIMENSIONS.filter((d) => d.id !== dimension.id);
      const exclusive = dimension.itemPoolFormIds.filter(
        (formId) => !others.some((d) => d.itemPoolFormIds.includes(formId)),
      );
      expect(exclusive.length).toBeGreaterThan(0);
    }
  });

  it('resolves every dimension actor pool entry to a real actor definition', () => {
    for (const dimension of DIMENSIONS) {
      for (const actorId of dimension.actorPool) {
        expect(() => getActorDefinition(actorId)).not.toThrow();
      }
    }
  });

  it('gives every actor definition non-empty flavor text', () => {
    for (const actor of ACTORS) {
      expect(actor.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('resolves every dimension gear pool entry to a real gear item', () => {
    for (const dimension of DIMENSIONS) {
      for (const gearId of dimension.gearPool) {
        expect(() => getGear(gearId)).not.toThrow();
      }
    }
  });

  it('gives every gear item non-empty flavor text', () => {
    for (const gear of GEAR_CATALOG) {
      expect(gear.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('has at least one gear item per slot', () => {
    const slots = new Set(GEAR_CATALOG.map((g) => g.slot));
    expect(slots).toEqual(new Set(['weapon', 'armor', 'tool', 'key']));
  });

  it('resolves every event choice’s guaranteedByGearId to a real gear item', () => {
    for (const event of EVENTS) {
      for (const choice of event.choices) {
        if (!choice.guaranteedByGearId) continue;
        expect(() => getGear(choice.guaranteedByGearId!)).not.toThrow();
        expect(choice.guaranteedKind).toBeDefined();
      }
    }
  });

  it('has a unique id per event', () => {
    const ids = EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every event a non-empty prompt and at least two choices', () => {
    for (const event of EVENTS) {
      expect(event.prompt.length).toBeGreaterThan(0);
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('gives every event choice a non-empty label/description and at least one outcome weight', () => {
    for (const event of EVENTS) {
      for (const choice of event.choices) {
        expect(choice.label.length).toBeGreaterThan(0);
        expect(choice.description.length).toBeGreaterThan(0);
        expect(choice.outcomeWeights.length).toBeGreaterThan(0);
      }
    }
  });

  it('gives every event at least one choice with no chance of a hazard outcome', () => {
    // Preserves the player's ability to always back out of an event risk-free.
    for (const event of EVENTS) {
      const hasSafeChoice = event.choices.some(
        (c) => !c.outcomeWeights.some((w) => w.value === 'hazard' && w.weight > 0),
      );
      expect(hasSafeChoice).toBe(true);
    }
  });

  it('has exactly one condition weight per condition tier', () => {
    const weighted = CONDITION_WEIGHTS.map((w) => w.value).sort();
    expect(weighted).toEqual([...CONDITION_ORDER].sort());
  });

  it('has exactly one weirdness weight per weirdness tier', () => {
    const weighted = WEIRDNESS_WEIGHTS.map((w) => w.value).sort();
    expect(weighted).toEqual([...WEIRDNESS_ORDER].sort());
  });

  it('resolves every collector required form id to a real item form', () => {
    for (const collector of COLLECTORS) {
      expect(collector.requiredFormIds.length).toBeGreaterThan(0);
      for (const formId of collector.requiredFormIds) {
        expect(() => getItemForm(formId)).not.toThrow();
      }
    }
  });

  it('gives every collector non-empty flavor text', () => {
    for (const collector of COLLECTORS) {
      expect(collector.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('has a unique id per collector', () => {
    const ids = COLLECTORS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every material non-empty flavor text', () => {
    for (const material of MATERIALS) {
      expect(material.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('has a unique id per material', () => {
    const ids = MATERIALS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolves every quest collectorId to a real, non-secret collector', () => {
    for (const quest of QUESTS) {
      const collector = getCollector(quest.collectorId);
      expect(collector.secret).toBeFalsy();
    }
  });

  it('resolves every quest requirement.formId to a real item form', () => {
    for (const quest of QUESTS) {
      expect(() => getItemForm(quest.requirement.formId)).not.toThrow();
      expect(quest.requirement.count).toBeGreaterThan(0);
    }
  });

  it('resolves every quest reward materialId/gearId to real content', () => {
    for (const quest of QUESTS) {
      const { reward } = quest;
      if (reward.materialId) {
        expect(() => getMaterial(reward.materialId!)).not.toThrow();
        expect(reward.materialCount).toBeGreaterThan(0);
      }
      if (reward.gearId) {
        expect(() => getGear(reward.gearId!)).not.toThrow();
      }
    }
  });

  it('gives every quest a non-empty description and at least one reward', () => {
    for (const quest of QUESTS) {
      expect(quest.description.length).toBeGreaterThan(0);
      const { reward } = quest;
      expect(reward.widgets || reward.materialId || reward.gearId).toBeTruthy();
    }
  });

  it('has a unique id per quest', () => {
    const ids = QUESTS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolves every recipe resultGearId to a real gear item', () => {
    for (const recipe of RECIPES) {
      expect(() => getGear(recipe.resultGearId)).not.toThrow();
    }
  });

  it('resolves every recipe materialCosts materialId to a real material', () => {
    for (const recipe of RECIPES) {
      for (const cost of recipe.materialCosts) {
        expect(() => getMaterial(cost.materialId)).not.toThrow();
        expect(cost.count).toBeGreaterThan(0);
      }
    }
  });

  it('gives every recipe at least one material cost', () => {
    for (const recipe of RECIPES) {
      expect(recipe.materialCosts.length).toBeGreaterThan(0);
    }
  });

  it('has a unique id per recipe', () => {
    const ids = RECIPES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('maps every item set to a breakdown material', () => {
    for (const setId of Object.keys(SET_LABEL)) {
      expect(() => getMaterial(BREAKDOWN_MATERIAL_BY_SET[setId])).not.toThrow();
    }
  });
});
