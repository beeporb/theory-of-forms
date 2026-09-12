export interface RecipeMaterialCost {
  materialId: string;
  count: number;
}

export interface CraftingRecipe {
  id: string;
  resultGearId: string;
  materialCosts: RecipeMaterialCost[];
  widgetCost?: number;
}
