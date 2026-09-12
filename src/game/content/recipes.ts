import type { CraftingRecipe } from '../types/recipe';

// Costs roughly track the resulting gear's rarity — a mundane key is cheap,
// an uncanny weapon or armor piece wants a wider material spread plus widgets.
export const RECIPES: CraftingRecipe[] = [
  {
    id: 'craft-warehouse-keycard',
    resultGearId: 'warehouse-keycard',
    materialCosts: [
      { materialId: 'scrap-metal', count: 2 },
      { materialId: 'salvaged-circuitry', count: 1 },
    ],
    widgetCost: 20,
  },
  {
    id: 'craft-override-chip',
    resultGearId: 'override-chip',
    materialCosts: [
      { materialId: 'salvaged-circuitry', count: 3 },
      { materialId: 'machine-parts', count: 1 },
    ],
    widgetCost: 50,
  },
  {
    id: 'craft-bent-pipe',
    resultGearId: 'bent-pipe',
    materialCosts: [{ materialId: 'scrap-metal', count: 3 }],
  },
  {
    id: 'craft-work-overalls',
    resultGearId: 'work-overalls',
    materialCosts: [{ materialId: 'worn-leather', count: 3 }],
  },
  {
    id: 'craft-pocket-multitool',
    resultGearId: 'pocket-multitool',
    materialCosts: [
      { materialId: 'machine-parts', count: 2 },
      { materialId: 'scrap-metal', count: 1 },
    ],
  },
  {
    id: 'craft-scavenged-cleaver',
    resultGearId: 'scavenged-cleaver',
    materialCosts: [
      { materialId: 'scrap-metal', count: 4 },
      { materialId: 'salvaged-circuitry', count: 2 },
    ],
    widgetCost: 30,
  },
  {
    id: 'craft-riot-vest',
    resultGearId: 'riot-vest',
    materialCosts: [
      { materialId: 'worn-leather', count: 4 },
      { materialId: 'machine-parts', count: 2 },
    ],
    widgetCost: 30,
  },
  {
    id: 'craft-geiger-counter',
    resultGearId: 'geiger-counter',
    materialCosts: [
      { materialId: 'machine-parts', count: 3 },
      { materialId: 'salvaged-circuitry', count: 2 },
    ],
    widgetCost: 30,
  },
];

export function getRecipe(recipeId: string): CraftingRecipe {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) throw new Error(`Unknown recipe: ${recipeId}`);
  return recipe;
}
