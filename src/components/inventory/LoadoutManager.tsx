import type { GearSlot } from '../../game/types/gear';
import { getGear, getGearForSlot } from '../../game/content/gear';
import { useMetaStore } from '../../state/metaStore';
import { Icon } from '../common/Icon';
import { ItemCard } from './ItemCard';

const SLOT_LABEL: Record<GearSlot, string> = { weapon: 'Weapon', armor: 'Armor', tool: 'Tool', key: 'Key' };
const SLOT_ICON: Record<GearSlot, 'sword' | 'shield' | 'wrench' | 'key'> = {
  weapon: 'sword',
  armor: 'shield',
  tool: 'wrench',
  key: 'key',
};
const SLOTS: GearSlot[] = ['weapon', 'armor', 'tool', 'key'];

export function LoadoutManager() {
  const meta = useMetaStore((s) => s.meta);
  const setEquipped = useMetaStore((s) => s.setEquipped);

  return (
    <section className="panel">
      <h3 className="panel__title">Loadout</h3>
      <div className="loadout-manager">
        {SLOTS.map((slot) => {
          const equippedId = meta.equippedGearIds[slot];
          const equipped = equippedId ? getGear(equippedId) : null;
          const owned = getGearForSlot(slot).filter((g) => meta.ownedGearIds.includes(g.id));

          return (
            <div key={slot} className="loadout-slot">
              <div className="loadout-slot__header">
                <span className="loadout-slot__icon">
                  <Icon name={SLOT_ICON[slot]} />
                </span>
                <span className="loadout-slot__label">{SLOT_LABEL[slot]}</span>
                <span className="loadout-slot__current">{equipped ? equipped.name : '— empty —'}</span>
              </div>
              {owned.length > 0 ? (
                <div className="item-card-grid loadout-slot__options">
                  {owned.map((gear) => (
                    <ItemCard
                      key={gear.id}
                      icon={gear.icon}
                      name={gear.name}
                      flavorText={gear.flavorText}
                      weirdness={gear.rarity}
                      condition={meta.gearCondition[gear.id] ?? 'sound'}
                      selected={gear.id === equippedId}
                      onClick={gear.id === equippedId ? undefined : () => setEquipped(slot, gear.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="panel__empty">Nothing left to equip here.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
