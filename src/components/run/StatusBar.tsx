import type { ThreatLevel } from '../../game/types/threat';
import { THREAT_LEVEL_LABEL } from '../../game/types/threat';
import { Icon } from '../common/Icon';

interface StatusBarProps {
  health: number;
  maxHealth: number;
  threatLevel: ThreatLevel;
  canExtract: boolean;
  minMovesToExtract: number;
  movesMade: number;
  onExtract: () => void;
  onOpenLog: () => void;
  onAbandon: () => void;
}

export function StatusBar({
  health,
  maxHealth,
  threatLevel,
  canExtract,
  minMovesToExtract,
  movesMade,
  onExtract,
  onOpenLog,
  onAbandon,
}: StatusBarProps) {
  const percent = Math.max(0, Math.round((health / maxHealth) * 100));
  const movesRemaining = minMovesToExtract - movesMade;
  const extractTitle = canExtract
    ? 'Extract'
    : movesMade < minMovesToExtract
      ? `Extract (explore ${movesRemaining} more)`
      : 'Extract (reach an extraction point)';

  return (
    <div className="status-bar">
      <div className="status-bar__health">
        <div className="status-bar__health-track">
          <div className="status-bar__health-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="status-bar__health-label">
          {health} / {maxHealth} HP
        </span>
      </div>
      <span className={`badge badge--threat-${threatLevel} status-bar__threat`}>{THREAT_LEVEL_LABEL[threatLevel]}</span>
      <button type="button" className="status-bar__log" onClick={onOpenLog}>
        Log
      </button>
      <button type="button" className="status-bar__abandon" onClick={onAbandon}>
        Abandon
      </button>
      <button
        type="button"
        className="status-bar__extract"
        onClick={onExtract}
        disabled={!canExtract}
        title={extractTitle}
      >
        {canExtract ? (
          'Extract'
        ) : movesMade < minMovesToExtract ? (
          `Extract (explore ${movesRemaining} more)`
        ) : (
          <>
            Extract (reach a <Icon name="door" />)
          </>
        )}
      </button>
    </div>
  );
}
