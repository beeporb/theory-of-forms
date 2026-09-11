import { useState } from 'react';
import type { RunState } from '../../game/types/player';
import { useRunStore } from '../../state/runStore';
import { GridView } from '../grid/GridView';
import { OutcomeModal } from '../grid/OutcomeModal';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { LoadoutPanel } from '../inventory/LoadoutPanel';
import { StatusBar } from './StatusBar';

interface RunScreenProps {
  run: RunState;
}

export function RunScreen({ run }: RunScreenProps) {
  const openCell = useRunStore((s) => s.openCell);
  const extractRun = useRunStore((s) => s.extractRun);
  const [openedCoords, setOpenedCoords] = useState<{ x: number; y: number } | null>(null);

  const handleOpenCell = (x: number, y: number) => {
    openCell(x, y);
    setOpenedCoords({ x, y });
  };

  const openedOutcome = openedCoords
    ? run.dimension.cells[openedCoords.y][openedCoords.x].outcome
    : null;

  return (
    <div className="screen run-screen">
      <StatusBar health={run.health} maxHealth={run.maxHealth} onExtract={extractRun} />
      <GridView dimension={run.dimension} onOpenCell={handleOpenCell} />
      <LoadoutPanel loadout={run.loadout} />
      <InventoryPanel title="Run Inventory" items={run.inventory} emptyMessage="Nothing found yet." />
      {run.status === 'active' && openedOutcome && (
        <OutcomeModal outcome={openedOutcome} onDismiss={() => setOpenedCoords(null)} />
      )}
    </div>
  );
}
