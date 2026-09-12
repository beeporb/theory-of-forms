import type { CollectorDefinition, CollectorProgress } from '../../game/types/collector';
import type { ItemInstance } from '../../game/types/item';
import type { QuestReward } from '../../game/types/quest';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { getMaterial } from '../../game/content/materials';
import { getGear } from '../../game/content/gear';
import { getQuestsForCollector } from '../../game/content/quests';
import { getRequiredVersionIds } from '../../game/logic/masterSet';
import { countMatchingStash } from '../../game/logic/quest';
import { useMetaStore } from '../../state/metaStore';
import { Icon } from '../common/Icon';

interface CollectorDetailModalProps {
  definition: CollectorDefinition;
  progress: CollectorProgress;
  stash: ItemInstance[];
  onDismiss: () => void;
}

function rewardLabel(reward: QuestReward): string {
  const parts: string[] = [];
  if (reward.widgets) parts.push(`${reward.widgets} Widgets`);
  if (reward.materialId && reward.materialCount) {
    parts.push(`${reward.materialCount} ${getMaterial(reward.materialId).name}`);
  }
  if (reward.gearId) parts.push(getGear(reward.gearId).name);
  return parts.join(', ');
}

export function CollectorDetailModal({ definition, progress, stash, onDismiss }: CollectorDetailModalProps) {
  const requiredVersionIds = getRequiredVersionIds(definition);
  const completedQuestIds = useMetaStore((s) => s.meta.completedQuestIds);
  const completeQuest = useMetaStore((s) => s.completeQuest);
  const quests = getQuestsForCollector(definition.id).filter((q) => !completedQuestIds.includes(q.id));

  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="run-log-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="run-log-modal__title collector-detail-modal__title">
          <span className="collector-card__icon">
            <Icon name={definition.icon} />
          </span>
          {definition.name}
        </h2>
        <p className="collector-card__flavor">{definition.flavorText}</p>

        <ul className="collector-detail-modal__list">
          {requiredVersionIds.map((versionId) => {
            const version = getVersion(versionId);
            const form = getItemForm(version.formId);
            const held = progress.donated[versionId];
            return (
              <li
                key={versionId}
                className={`collector-detail-modal__row${held ? ' collector-detail-modal__row--done' : ''}`}
              >
                <span className="item-list__icon">
                  <Icon name={form.icon} />
                </span>
                <span className="item-list__name">{version.name}</span>
                {held ? (
                  <span className="item-list__badges">
                    <span className="badge">{CONDITION_LABEL[held.condition]}</span>
                    <span className="badge">{WEIRDNESS_LABEL[held.weirdness]}</span>
                  </span>
                ) : (
                  <span className="collector-detail-modal__missing">Still needed</span>
                )}
              </li>
            );
          })}
        </ul>

        {quests.length > 0 && (
          <div className="collector-detail-modal__quests">
            <p className="panel__subtitle">Quests</p>
            <ul className="quest-list">
              {quests.map((quest) => {
                const have = countMatchingStash(stash, quest.requirement.formId);
                const need = quest.requirement.count;
                const formName = getItemForm(quest.requirement.formId).name;
                const met = have >= need;
                return (
                  <li key={quest.id} className="quest-list__row">
                    <p className="quest-list__description">{quest.description}</p>
                    <p className="quest-list__reward">Reward: {rewardLabel(quest.reward)}</p>
                    <div className="quest-list__footer">
                      <span className="quest-list__progress">
                        {have} / {need} {formName}
                      </span>
                      <button type="button" disabled={!met} onClick={() => completeQuest(quest.id)}>
                        Turn In
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
