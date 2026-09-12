import type { TagSkillDefinition } from '../../game/types/character';
import { MAX_TAG_SKILL_LEVEL, TAG_SKILL_XP_PER_LEVEL, tagSkillLevel } from '../../game/logic/leveling';
import { Icon } from '../common/Icon';

interface TagSkillRowProps {
  definition: TagSkillDefinition;
  xp: number;
}

export function TagSkillRow({ definition, xp }: TagSkillRowProps) {
  const level = tagSkillLevel(xp);
  const percent =
    level >= MAX_TAG_SKILL_LEVEL
      ? 100
      : Math.round(((xp % TAG_SKILL_XP_PER_LEVEL) / TAG_SKILL_XP_PER_LEVEL) * 100);

  return (
    <div className="stat-row">
      <span className="stat-row__icon">
        <Icon name={definition.icon} />
      </span>
      <div className="stat-row__body">
        <div className="stat-row__header">
          <span className="stat-row__name">{definition.name}</span>
          <span className="stat-row__value">Lv {level}</span>
        </div>
        <p className="stat-row__description">{definition.description}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
