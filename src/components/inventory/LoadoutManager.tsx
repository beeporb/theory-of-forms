import type { GearSlot } from '../../game/types/gear';
import type { IconName } from '../../game/types/icon';
import { getGear, getGearForSlot } from '../../game/content/gear';
import { useMetaStore } from '../../state/metaStore';
import { Icon } from '../common/Icon';

const SLOT_LABEL: Record<GearSlot, string> = { weapon: 'Weapon', armor: 'Armor', tool: 'Tool' };
const SLOT_ICON: Record<GearSlot, IconName> = { weapon: 'sword', armor: 'shield', tool: 'wrench' };
const SLOTS: GearSlot[] = ['weapon', 'armor', 'tool'];

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
                <div className="loadout-slot__options">
                  {owned.map((gear) => (
                    <button
                      key={gear.id}
                      type="button"
                      className={`filter-chip${gear.id === equippedId ? ' filter-chip--active' : ''}`}
                      onClick={() => setEquipped(slot, gear.id)}
                      disabled={gear.id === equippedId}
                    >
                      {gear.name}
                    </button>
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
