import { COLLECTORS } from '../../game/content/collectors';
import { isCollectorRevealed } from '../../game/logic/discovery';
import { useMetaStore } from '../../state/metaStore';
import { CollectorCard } from '../collectors/CollectorCard';
import { SecretCollectorCard } from '../collectors/SecretCollectorCard';

const EMPTY_PROGRESS = { donated: {} };

export function CollectorsView() {
  const meta = useMetaStore((s) => s.meta);
  const donateItem = useMetaStore((s) => s.donateItem);

  return (
    <div className="collectors-view">
      <h2 className="view-title">Collectors</h2>
      <div className="collectors-grid">
        {COLLECTORS.map((collector) =>
          isCollectorRevealed(collector, meta) ? (
            <CollectorCard
              key={collector.id}
              definition={collector}
              progress={meta.collectors[collector.id] ?? { collectorId: collector.id, ...EMPTY_PROGRESS }}
              stash={meta.stash}
              onDonate={(instanceId) => donateItem(collector.id, instanceId)}
            />
          ) : (
            <SecretCollectorCard key={collector.id} />
          ),
        )}
      </div>
    </div>
  );
}
