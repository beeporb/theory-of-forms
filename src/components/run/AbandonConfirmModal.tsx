interface AbandonConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function AbandonConfirmModal({ onConfirm, onCancel }: AbandonConfirmModalProps) {
  return (
    <div className="outcome-modal-backdrop" onClick={onCancel}>
      <div className="outcome-modal" onClick={(e) => e.stopPropagation()}>
        <p>Abandon this run?</p>
        <p className="outcome-modal__stat outcome-modal__stat--bad">
          You'll lose everything you're carrying and all equipped gear.
        </p>
        <div className="abandon-confirm-modal__actions">
          <button type="button" className="outcome-modal__dismiss" onClick={onCancel}>
            Keep Going
          </button>
          <button type="button" className="abandon-confirm-modal__confirm" onClick={onConfirm}>
            Abandon
          </button>
        </div>
      </div>
    </div>
  );
}
