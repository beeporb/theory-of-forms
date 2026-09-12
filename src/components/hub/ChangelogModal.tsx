import { CHANGELOG } from '../../game/content/changelog';

interface ChangelogModalProps {
  onDismiss: () => void;
}

export function ChangelogModal({ onDismiss }: ChangelogModalProps) {
  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="run-log-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="run-log-modal__title">What's New</h2>
        <div className="changelog-modal__list">
          {CHANGELOG.map((entry) => (
            <section key={entry.version} className="changelog-entry">
              <h3 className="changelog-entry__version">
                v{entry.version} <span className="changelog-entry__date">{entry.date}</span>
              </h3>
              <ul className="changelog-entry__changes">
                {entry.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
