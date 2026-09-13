import { useState } from 'react';
import type { RunState } from '../../game/types/player';
import type { Outcome } from '../../game/types/outcome';
import type { ActorEncounter } from '../../game/types/actor';
import { canExtract } from '../../game/logic/extraction';
import { useRunStore } from '../../state/runStore';
import { useMetaStore } from '../../state/metaStore';
import { GridView } from '../grid/GridView';
import { OutcomeModal } from '../grid/OutcomeModal';
import { EventModal } from '../grid/EventModal';
import { ActorEncounterModal } from '../grid/ActorEncounterModal';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { LoadoutPanel } from '../inventory/LoadoutPanel';
import { RunLogModal } from './RunLogModal';
import { AbandonConfirmModal } from './AbandonConfirmModal';
import { PackFullModal } from './PackFullModal';
import { StatusBar } from './StatusBar';

interface RunScreenProps {
  run: RunState;
}

export function RunScreen({ run }: RunScreenProps) {
  const moveTo = useRunStore((s) => s.moveTo);
  const resolveEventChoice = useRunStore((s) => s.resolveEventChoice);
  const donateToCollector = useRunStore((s) => s.donateToCollector);
  const dropItem = useRunStore((s) => s.dropItem);
  const extractRun = useRunStore((s) => s.extractRun);
  const abandonRun = useRunStore((s) => s.abandonRun);
  const collectors = useMetaStore((s) => s.meta.collectors);
  const gearCondition = useMetaStore((s) => s.meta.gearCondition);
  const [activeOutcome, setActiveOutcome] = useState<Outcome | null>(null);
  const [activeEncounter, setActiveEncounter] = useState<ActorEncounter | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const handleMoveTo = (x: number, y: number) => {
    const { outcome, actorEncounter } = moveTo(x, y);
    setActiveEncounter(actorEncounter);
    setActiveOutcome(outcome);
  };

  const handleDonate = (instanceId: string) => {
    if (activeEncounter?.kind === 'collector') {
      donateToCollector(activeEncounter.collectorId, instanceId);
    }
  };

  return (
    <div className="screen run-screen">
      <StatusBar
        health={run.health}
        maxHealth={run.maxHealth}
        threatLevel={run.threatLevel}
        canExtract={canExtract(run)}
        minMovesToExtract={run.dimension.minMovesToExtract}
        movesMade={run.moveCount}
        onExtract={extractRun}
        onOpenLog={() => setShowLog(true)}
        onAbandon={() => setShowAbandonConfirm(true)}
      />
      <GridView
        dimension={run.dimension}
        position={run.position}
        extractionPoints={run.dimension.extractionPoints}
        onMoveTo={handleMoveTo}
      />
      <LoadoutPanel loadout={run.loadout} gearCondition={gearCondition} />
      <InventoryPanel
        title={`Run Inventory (${run.inventory.length}/${run.carryCapacity})`}
        items={run.inventory}
        emptyMessage="Nothing found yet."
      />
      {run.status === 'active' && activeEncounter && (
        <ActorEncounterModal
          encounter={activeEncounter}
          runInventory={run.inventory}
          collectorProgress={activeEncounter.kind === 'collector' ? collectors[activeEncounter.collectorId] : undefined}
          onDonate={handleDonate}
          onDismiss={() => setActiveEncounter(null)}
        />
      )}
      {run.status === 'active' &&
        !activeEncounter &&
        activeOutcome &&
        (activeOutcome.kind === 'event' ? (
          <EventModal
            outcome={activeOutcome}
            onChoose={(index) => resolveEventChoice(activeOutcome.choices[index].outcome)}
            onDismiss={() => setActiveOutcome(null)}
          />
        ) : (
          <OutcomeModal outcome={activeOutcome} onDismiss={() => setActiveOutcome(null)} />
        ))}
      {run.status === 'active' &&
        !activeEncounter &&
        !activeOutcome &&
        run.inventory.length > run.carryCapacity && (
          <PackFullModal inventory={run.inventory} carryCapacity={run.carryCapacity} onDrop={dropItem} />
        )}
      {showLog && <RunLogModal log={run.log} onDismiss={() => setShowLog(false)} />}
      {showAbandonConfirm && (
        <AbandonConfirmModal onConfirm={abandonRun} onCancel={() => setShowAbandonConfirm(false)} />
      )}
    </div>
  );
}
