import { useState } from 'react';
import type { RunState } from '../../game/types/player';
import type { Outcome } from '../../game/types/outcome';
import { getDimensionDefinition } from '../../game/content/dimensions';
import { canExtract } from '../../game/logic/extraction';
import { useRunStore } from '../../state/runStore';
import { GridView } from '../grid/GridView';
import { OutcomeModal } from '../grid/OutcomeModal';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { LoadoutPanel } from '../inventory/LoadoutPanel';
import { RunLogModal } from './RunLogModal';
import { AbandonConfirmModal } from './AbandonConfirmModal';
import { StatusBar } from './StatusBar';

interface RunScreenProps {
  run: RunState;
}

export function RunScreen({ run }: RunScreenProps) {
  const moveTo = useRunStore((s) => s.moveTo);
  const extractRun = useRunStore((s) => s.extractRun);
  const abandonRun = useRunStore((s) => s.abandonRun);
  const [activeOutcome, setActiveOutcome] = useState<Outcome | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const definition = getDimensionDefinition(run.dimension.definitionId);

  const handleMoveTo = (x: number, y: number) => {
    setActiveOutcome(moveTo(x, y));
  };

  return (
    <div className="screen run-screen">
      <StatusBar
        health={run.health}
        maxHealth={run.maxHealth}
        canExtract={canExtract(run)}
        minMovesToExtract={definition.minMovesToExtract}
        movesMade={run.moveCount}
        onExtract={extractRun}
        onOpenLog={() => setShowLog(true)}
        onAbandon={() => setShowAbandonConfirm(true)}
      />
      <GridView
        dimension={run.dimension}
        position={run.position}
        extractionPoints={definition.extractionPoints}
        onMoveTo={handleMoveTo}
      />
      <LoadoutPanel loadout={run.loadout} />
      <InventoryPanel title="Run Inventory" items={run.inventory} emptyMessage="Nothing found yet." />
      {run.status === 'active' && activeOutcome && (
        <OutcomeModal outcome={activeOutcome} onDismiss={() => setActiveOutcome(null)} />
      )}
      {showLog && <RunLogModal log={run.log} onDismiss={() => setShowLog(false)} />}
      {showAbandonConfirm && (
        <AbandonConfirmModal onConfirm={abandonRun} onCancel={() => setShowAbandonConfirm(false)} />
      )}
    </div>
  );
}
