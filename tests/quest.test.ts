import { describe, expect, it } from 'vitest';
import { applyQuestReward, canCompleteQuest, countMatchingStash, removeQuestItems } from '../src/game/logic/quest';
import { getQuest } from '../src/game/content/quests';
import { getVersionsForForm } from '../src/game/content/versions';
import type { ItemInstance } from '../src/game/types/item';

function emptyRewardState() {
  return { widgets: 0, materials: {}, ownedGearIds: [], gearCondition: {} };
}

const quest = getQuest('jeweler-quartz-cut'); // requires 2x quartz-shard
const [quartzVersion] = getVersionsForForm('quartz-shard');

function makeItem(versionId: string, instanceId = `i-${Math.random()}`): ItemInstance {
  return { instanceId, versionId, condition: 'sound', weirdness: 'mundane' };
}

describe('countMatchingStash', () => {
  it('counts only items whose version resolves to the given form', () => {
    const stash = [makeItem(quartzVersion.id), makeItem('iron-ore-standard'), makeItem(quartzVersion.id)];
    expect(countMatchingStash(stash, 'quartz-shard')).toBe(2);
  });

  it('matches by form, not by condition/weirdness', () => {
    const stash: ItemInstance[] = [
      { instanceId: 'a', versionId: quartzVersion.id, condition: 'wrecked', weirdness: 'impossible' },
      { instanceId: 'b', versionId: quartzVersion.id, condition: 'pristine', weirdness: 'mundane' },
    ];
    expect(countMatchingStash(stash, 'quartz-shard')).toBe(2);
  });
});

describe('canCompleteQuest', () => {
  it('rejects when the stash has too few matching items', () => {
    const stash = [makeItem(quartzVersion.id)];
    expect(canCompleteQuest(quest, stash, [])).toBe(false);
  });

  it('accepts once the stash has enough matching items', () => {
    const stash = [makeItem(quartzVersion.id), makeItem(quartzVersion.id)];
    expect(canCompleteQuest(quest, stash, [])).toBe(true);
  });

  it('rejects a quest already completed, even with enough items', () => {
    const stash = [makeItem(quartzVersion.id), makeItem(quartzVersion.id)];
    expect(canCompleteQuest(quest, stash, [quest.id])).toBe(false);
  });
});

describe('removeQuestItems', () => {
  it('removes exactly requirement.count matching items and keeps the rest', () => {
    const other = makeItem('iron-ore-standard');
    const stash = [makeItem(quartzVersion.id, 'q1'), makeItem(quartzVersion.id, 'q2'), other];
    const result = removeQuestItems(stash, quest);
    expect(result).toHaveLength(1);
    expect(result).toContainEqual(other);
  });

  it('leaves extra matching items beyond the required count untouched', () => {
    const stash = [
      makeItem(quartzVersion.id, 'q1'),
      makeItem(quartzVersion.id, 'q2'),
      makeItem(quartzVersion.id, 'q3'),
    ];
    const result = removeQuestItems(stash, quest);
    expect(result).toHaveLength(1);
    expect(result[0].instanceId).toBe('q3');
  });
});

describe('applyQuestReward', () => {
  it('adds widgets', () => {
    const result = applyQuestReward({ widgets: 50 }, emptyRewardState());
    expect(result.widgets).toBe(50);
  });

  it('adds to an existing material count', () => {
    const state = { ...emptyRewardState(), materials: { 'scrap-metal': 2 } };
    const result = applyQuestReward({ materialId: 'scrap-metal', materialCount: 3 }, state);
    expect(result.materials['scrap-metal']).toBe(5);
  });

  it('starts a new material at its rewarded count', () => {
    const result = applyQuestReward({ materialId: 'worn-leather', materialCount: 3 }, emptyRewardState());
    expect(result.materials['worn-leather']).toBe(3);
  });

  it('grants gear via mergeFoundGear, defaulting to sound condition', () => {
    const result = applyQuestReward({ gearId: 'geiger-counter' }, emptyRewardState());
    expect(result.ownedGearIds).toContain('geiger-counter');
    expect(result.gearCondition['geiger-counter']).toBe('sound');
  });

  it('leaves already-owned gear alone rather than re-granting it', () => {
    const state = { ...emptyRewardState(), ownedGearIds: ['geiger-counter'], gearCondition: { 'geiger-counter': 'worn' as const } };
    const result = applyQuestReward({ gearId: 'geiger-counter' }, state);
    expect(result.gearCondition['geiger-counter']).toBe('worn');
  });

  it('leaves state untouched for an empty reward', () => {
    const state = emptyRewardState();
    expect(applyQuestReward({}, state)).toEqual(state);
  });
});
