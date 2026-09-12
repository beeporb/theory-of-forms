interface StepIndicatorProps {
  labels: string[];
  activeIndex: number;
}

export function StepIndicator({ labels, activeIndex }: StepIndicatorProps) {
  return (
    <ol className="step-indicator">
      {labels.map((label, index) => (
        <li
          key={label}
          className={`step-indicator__step${index === activeIndex ? ' step-indicator__step--active' : ''}${
            index < activeIndex ? ' step-indicator__step--done' : ''
          }`}
        >
          <span className="step-indicator__dot">{index + 1}</span>
          <span className="step-indicator__label">{label}</span>
        </li>
      ))}
    </ol>
  );
}
