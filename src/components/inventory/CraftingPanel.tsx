import { RECIPES } from '../../game/content/recipes';
import { getGear } from '../../game/content/gear';
import { getMaterial } from '../../game/content/materials';
import { canCraft } from '../../game/logic/crafting';
import { useMetaStore } from '../../state/metaStore';
import { Icon } from '../common/Icon';

interface CostEntry {
  label: string;
  met: boolean;
}

function costEntries(materialCosts: { materialId: string; count: number }[], widgetCost: number | undefined, materials: Record<string, number>, widgets: number): CostEntry[] {
  const entries = materialCosts.map((cost) => {
    const have = materials[cost.materialId] ?? 0;
    return { label: `${cost.count} ${getMaterial(cost.materialId).name} (${have} owned)`, met: have >= cost.count };
  });
  if (widgetCost) {
    entries.push({ label: `${widgetCost} Widgets (${widgets} owned)`, met: widgets >= widgetCost });
  }
  return entries;
}

export function CraftingPanel() {
  const materials = useMetaStore((s) => s.meta.materials);
  const widgets = useMetaStore((s) => s.meta.widgets);
  const ownedGearIds = useMetaStore((s) => s.meta.ownedGearIds);
  const craftGear = useMetaStore((s) => s.craftGear);

  return (
    <section className="panel">
      <h3 className="panel__title">Crafting</h3>
      <ul className="recipe-list">
        {RECIPES.map((recipe) => {
          const gear = getGear(recipe.resultGearId);
          const affordable = canCraft(recipe, materials, widgets);
          const alreadyOwned = ownedGearIds.includes(gear.id);
          const entries = costEntries(recipe.materialCosts, recipe.widgetCost, materials, widgets);
          return (
            <li key={recipe.id} className="recipe-list__row">
              <span className="recipe-list__icon">
                <Icon name={gear.icon} />
              </span>
              <div className="recipe-list__body">
                <p className="recipe-list__name">
                  {gear.name}
                  {alreadyOwned && <span className="recipe-list__owned"> · Owned</span>}
                </p>
                <p className="recipe-list__costs">
                  {entries.map((entry, i) => (
                    <span key={i} className={entry.met ? undefined : 'recipe-list__cost--short'}>
                      {entry.label}
                      {i < entries.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
              <button type="button" disabled={!affordable} onClick={() => craftGear(recipe.id)}>
                Craft
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
