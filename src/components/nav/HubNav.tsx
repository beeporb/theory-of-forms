import type { IconName } from '../../game/types/icon';
import { Icon } from '../common/Icon';

export type HubView = 'home' | 'collectors' | 'inventory';

interface HubNavProps {
  active: HubView;
  onNavigate: (view: HubView) => void;
}

const NAV_ITEMS: { id: HubView; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'collectors', label: 'Collectors', icon: 'collectors' },
  { id: 'inventory', label: 'Inventory', icon: 'backpack' },
];

export function HubNav({ active, onNavigate }: HubNavProps) {
  return (
    <nav className="hub-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`hub-nav__item${active === item.id ? ' hub-nav__item--active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="hub-nav__icon">
            <Icon name={item.icon} />
          </span>
          <span className="hub-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
