import type { GearItem } from '../../game/types/gear';
import type { IconName } from '../../game/types/icon';
import { Icon } from '../common/Icon';

interface LoadoutPanelProps {
  loadout: GearItem[];
}

const SLOT_ICON: Record<GearItem['slot'], IconName> = {
  weapon: 'sword',
  armor: 'shield',
  tool: 'wrench',
};

export function LoadoutPanel({ loadout }: LoadoutPanelProps) {
  return (
    <section className="panel">
      <h3 className="panel__title">Loadout</h3>
      <ul className="item-list">
        {loadout.map((item) => (
          <li key={item.id} className="item-list__row">
            <span className="item-list__icon">
              <Icon name={SLOT_ICON[item.slot]} />
            </span>
            <span className="item-list__name">{item.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
