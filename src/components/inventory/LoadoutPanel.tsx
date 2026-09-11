import type { LoadoutItem } from '../../game/types/player';

interface LoadoutPanelProps {
  loadout: LoadoutItem[];
}

const SLOT_ICON: Record<LoadoutItem['slot'], string> = {
  weapon: '🗡️',
  armor: '🛡️',
  tool: '🔧',
};

export function LoadoutPanel({ loadout }: LoadoutPanelProps) {
  return (
    <section className="panel">
      <h3 className="panel__title">Loadout</h3>
      <ul className="item-list">
        {loadout.map((item) => (
          <li key={item.id} className="item-list__row">
            <span className="item-list__icon">{SLOT_ICON[item.slot]}</span>
            <span className="item-list__name">{item.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
