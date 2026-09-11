export type HubView = 'home' | 'collectors' | 'inventory';

interface HubNavProps {
  active: HubView;
  onNavigate: (view: HubView) => void;
}

const NAV_ITEMS: { id: HubView; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'collectors', label: 'Collectors', icon: '🧑‍🤝‍🧑' },
  { id: 'inventory', label: 'Inventory', icon: '🎒' },
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
          <span className="hub-nav__icon">{item.icon}</span>
          <span className="hub-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
