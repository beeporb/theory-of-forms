import { COLLECTORS } from '../../game/content/collectors';
import { useMetaStore } from '../../state/metaStore';
import { useRunStore } from '../../state/runStore';
import { CollectorCard } from '../collectors/CollectorCard';
import { InventoryPanel } from '../inventory/InventoryPanel';

const EMPTY_PROGRESS = { turnedInFormIds: [] as string[] };

export function HubScreen() {
  const meta = useMetaStore((s) => s.meta);
  const donateItem = useMetaStore((s) => s.donateItem);
  const startRun = useRunStore((s) => s.startRun);

  return (
    <div className="screen hub-screen">
      <header className="hub-screen__header">
        <h1>Theory of Forms</h1>
        <p className="hub-screen__tagline">
          The world ended. Here, people are doing alright. Out there, the old world is still
          waiting to be found.
        </p>
      </header>

      <button type="button" className="primary-button" onClick={() => startRun('warehouse')}>
        Start Run: The Old Warehouse
      </button>

      <div className="hub-screen__collectors">
        {COLLECTORS.map((collector) => (
          <CollectorCard
            key={collector.id}
            definition={collector}
            progress={meta.collectors[collector.id] ?? { collectorId: collector.id, ...EMPTY_PROGRESS }}
            stash={meta.stash}
            onDonate={(instanceId) => donateItem(collector.id, instanceId)}
          />
        ))}
      </div>

      <InventoryPanel title="Stash" items={meta.stash} emptyMessage="Your stash is empty. Go find something." />
    </div>
  );
}
