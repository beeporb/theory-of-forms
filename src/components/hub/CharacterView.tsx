import { ATTRIBUTE_CATALOG } from '../../game/content/attributes';
import { TAG_SKILL_CATALOG } from '../../game/content/tagSkills';
import { TRAIT_CATALOG } from '../../game/content/traits';
import { xpForLevel } from '../../game/logic/leveling';
import { useMetaStore } from '../../state/metaStore';
import { AttributeRow } from '../character/AttributeRow';
import { TagSkillRow } from '../character/TagSkillRow';
import { TraitCard } from '../character/TraitCard';
import { Icon } from '../common/Icon';

export function CharacterView() {
  const character = useMetaStore((s) => s.meta.character);
  const allocateAttributePoint = useMetaStore((s) => s.allocateAttributePoint);
  const selectTrait = useMetaStore((s) => s.selectTrait);

  const xpNeeded = xpForLevel(character.level);
  const xpPercent = Math.round((character.xp / xpNeeded) * 100);

  return (
    <div className="character-view">
      <h2 className="view-title">Character</h2>

      <section className="panel character-header">
        <div className="character-header__level">
          <Icon name="star" />
          <span>Level {character.level}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${xpPercent}%` }} />
        </div>
        <p className="panel__subtitle">
          {character.xp} / {xpNeeded} XP — earned from successful extractions
        </p>
      </section>

      <section className="panel">
        <h3 className="panel__title">
          Attributes
          {character.attributePoints > 0 && (
            <span className="badge character-view__points">{character.attributePoints} to spend</span>
          )}
        </h3>
        <div className="stat-row-list">
          {ATTRIBUTE_CATALOG.map((attribute) => (
            <AttributeRow
              key={attribute.id}
              definition={attribute}
              value={character.attributes[attribute.id]}
              canAllocate={character.attributePoints > 0}
              onAllocate={() => allocateAttributePoint(attribute.id)}
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Tag Skills</h3>
        <div className="stat-row-list">
          {TAG_SKILL_CATALOG.map((skill) => (
            <TagSkillRow key={skill.id} definition={skill} xp={character.tagSkillXp[skill.id]} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">
          Traits
          {character.traitPoints > 0 && (
            <span className="badge character-view__points">{character.traitPoints} to spend</span>
          )}
        </h3>
        <div className="trait-grid">
          {TRAIT_CATALOG.map((trait) => {
            const owned = character.traitIds.includes(trait.id);
            return (
              <TraitCard
                key={trait.id}
                definition={trait}
                owned={owned}
                canTake={!owned && character.traitPoints > 0 && character.level >= trait.requiredLevel}
                characterLevel={character.level}
                onTake={() => selectTrait(trait.id)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
