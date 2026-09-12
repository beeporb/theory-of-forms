import type { ActorEncounter } from '../../game/types/actor';
import type { ItemInstance } from '../../game/types/item';
import type { CollectorProgress } from '../../game/types/collector';
import { getActorDefinition } from '../../game/content/actors';
import { getCollector } from '../../game/content/collectors';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { getRequiredVersionIds } from '../../game/logic/masterSet';
import { qualityScore } from '../../game/logic/quality';
import { Icon } from '../common/Icon';

interface ActorEncounterModalProps {
  encounter: ActorEncounter;
  runInventory: ItemInstance[];
  collectorProgress: CollectorProgress | undefined;
  onDonate: (instanceId: string) => void;
  onDismiss: () => void;
}

function CollectorDonateList({
  collectorId,
  runInventory,
  progress,
  onDonate,
}: {
  collectorId: string;
  runInventory: ItemInstance[];
  progress: CollectorProgress;
  onDonate: (instanceId: string) => void;
}) {
  const collector = getCollector(collectorId);
  const requiredVersionIds = getRequiredVersionIds(collector);
  const donatable = runInventory.filter((item) => {
    if (!requiredVersionIds.includes(item.versionId)) return false;
    const held = progress.donated[item.versionId];
    if (!held) return true;
    return qualityScore(item.condition, item.weirdness) > qualityScore(held.condition, held.weirdness);
  });

  if (donatable.length === 0) {
    return <p className="panel__empty">Nothing in your pack interests them right now.</p>;
  }

  return (
    <ul className="item-list">
      {donatable.map((item) => {
        const version = getVersion(item.versionId);
        const form = getItemForm(version.formId);
        return (
          <li key={item.instanceId} className="item-list__row">
            <span className="item-list__icon">
              <Icon name={form.icon} />
            </span>
            <span className="item-list__name">{version.name}</span>
            <button type="button" onClick={() => onDonate(item.instanceId)}>
              Donate
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ActorEncounterModal({
  encounter,
  runInventory,
  collectorProgress,
  onDonate,
  onDismiss,
}: ActorEncounterModalProps) {
  const def = getActorDefinition(encounter.definitionId);
  const tone = encounter.kind === 'adversary' ? 'bad' : encounter.kind === 'trader' ? 'good' : undefined;

  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="outcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="outcome-modal__icon">
          <Icon name={def.icon} tone={tone} />
        </div>
        <p>You run into {def.name}.</p>
        <p className="outcome-modal__flavor">{def.flavorText}</p>

        {encounter.kind === 'adversary' && (
          <p className="outcome-modal__stat outcome-modal__stat--bad">-{encounter.damage} HP</p>
        )}
        {encounter.kind === 'trader' && (
          <p className="outcome-modal__stat outcome-modal__stat--good">+{encounter.heal} HP</p>
        )}
        {encounter.kind === 'collector' && (
          <CollectorDonateList
            collectorId={encounter.collectorId}
            runInventory={runInventory}
            progress={collectorProgress ?? { collectorId: encounter.collectorId, donated: {} }}
            onDonate={onDonate}
          />
        )}

        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Continue
        </button>
      </div>
    </div>
  );
}
