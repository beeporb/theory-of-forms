import type { RunState } from '../../game/types/player';
import { getDimensionDefinition } from '../../game/content/dimensions';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { LoadoutPanel } from '../inventory/LoadoutPanel';

interface DeathScreenProps {
  run: RunState;
  onReturnToHub: () => void;
}

export function DeathScreen({ run, onReturnToHub }: DeathScreenProps) {
  const definition = getDimensionDefinition(run.dimension.definitionId);

  return (
    <div className="screen death-screen">
      <h1>You didn't make it out.</h1>
      <p className="death-screen__message">
        Everything you carried into {definition.name} is gone for good.
      </p>

      <LoadoutPanel loadout={run.loadout} />
      <InventoryPanel title="Lost Inventory" items={run.inventory} emptyMessage="You hadn't found anything yet." />

      <button type="button" className="primary-button" onClick={onReturnToHub}>
        Return to Hub
      </button>
    </div>
  );
}
