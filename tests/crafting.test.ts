import { describe, expect, it } from 'vitest';
import { applyCraft, canCraft } from '../src/game/logic/crafting';
import { getRecipe } from '../src/game/content/recipes';

const recipe = getRecipe('craft-bent-pipe'); // 3x scrap-metal, no widgetCost
const paidRecipe = getRecipe('craft-warehouse-keycard'); // 2x scrap-metal, 1x salvaged-circuitry, 20 widgets

function emptyCraftState() {
  return { materials: {}, widgets: 0, ownedGearIds: [], gearCondition: {} };
}

describe('canCraft', () => {
  it('rejects when a required material is missing entirely', () => {
    expect(canCraft(recipe, {}, 0)).toBe(false);
  });

  it('rejects when a required material is short', () => {
    expect(canCraft(recipe, { 'scrap-metal': 2 }, 0)).toBe(false);
  });

  it('accepts when every material cost is met', () => {
    expect(canCraft(recipe, { 'scrap-metal': 3 }, 0)).toBe(true);
  });

  it('accepts with materials to spare', () => {
    expect(canCraft(recipe, { 'scrap-metal': 10 }, 0)).toBe(true);
  });

  it('rejects when materials are met but widgets are short', () => {
    const materials = { 'scrap-metal': 2, 'salvaged-circuitry': 1 };
    expect(canCraft(paidRecipe, materials, 19)).toBe(false);
  });

  it('accepts when both materials and widgets are met', () => {
    const materials = { 'scrap-metal': 2, 'salvaged-circuitry': 1 };
    expect(canCraft(paidRecipe, materials, 20)).toBe(true);
  });
});

describe('applyCraft', () => {
  it('deducts each material cost', () => {
    const state = { ...emptyCraftState(), materials: { 'scrap-metal': 5 } };
    const result = applyCraft(recipe, state);
    expect(result.materials['scrap-metal']).toBe(2);
  });

  it('deducts the widget cost', () => {
    const state = { ...emptyCraftState(), materials: { 'scrap-metal': 2, 'salvaged-circuitry': 1 }, widgets: 30 };
    const result = applyCraft(paidRecipe, state);
    expect(result.widgets).toBe(10);
  });

  it('leaves widgets untouched for a recipe with no widgetCost', () => {
    const state = { ...emptyCraftState(), materials: { 'scrap-metal': 3 }, widgets: 5 };
    const result = applyCraft(recipe, state);
    expect(result.widgets).toBe(5);
  });

  it('grants the resulting gear via mergeFoundGear, defaulting to sound condition', () => {
    const state = { ...emptyCraftState(), materials: { 'scrap-metal': 3 } };
    const result = applyCraft(recipe, state);
    expect(result.ownedGearIds).toContain('bent-pipe');
    expect(result.gearCondition['bent-pipe']).toBe('sound');
  });

  it('leaves already-owned gear condition alone rather than re-granting it', () => {
    const state = {
      ...emptyCraftState(),
      materials: { 'scrap-metal': 3 },
      ownedGearIds: ['bent-pipe'],
      gearCondition: { 'bent-pipe': 'wrecked' as const },
    };
    const result = applyCraft(recipe, state);
    expect(result.gearCondition['bent-pipe']).toBe('wrecked');
  });

  it('does not mutate the input materials object', () => {
    const materials = { 'scrap-metal': 5 };
    const state = { ...emptyCraftState(), materials };
    applyCraft(recipe, state);
    expect(materials['scrap-metal']).toBe(5);
  });
});
