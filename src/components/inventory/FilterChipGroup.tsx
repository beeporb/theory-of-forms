interface FilterChipGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function FilterChipGroup({ label, options, selected, onToggle }: FilterChipGroupProps) {
  return (
    <div className="filter-chip-group">
      <span className="filter-chip-group__label">{label}</span>
      <div className="filter-chip-group__chips">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-chip${selected.includes(option.value) ? ' filter-chip--active' : ''}`}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
