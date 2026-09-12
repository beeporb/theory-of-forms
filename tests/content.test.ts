import { describe, expect, it } from 'vitest';
import { ITEM_FORMS, getItemForm } from '../src/game/content/items';
import { SET_LABEL } from '../src/game/content/sets';
import { DIMENSIONS } from '../src/game/content/dimensions';
import { ACTORS, getActorDefinition } from '../src/game/content/actors';
import { CONDITION_ORDER } from '../src/game/types/condition';
import { CONDITION_WEIGHTS } from '../src/game/content/conditionTable';
import { WEIRDNESS_ORDER } from '../src/game/types/weirdness';
import { WEIRDNESS_WEIGHTS } from '../src/game/content/weirdnessTable';

describe('content integrity', () => {
  it('gives every item form a labelled set', () => {
    for (const form of ITEM_FORMS) {
      expect(SET_LABEL[form.setId]).toBeDefined();
    }
  });

  it('gives every item form non-empty flavor text', () => {
    for (const form of ITEM_FORMS) {
      expect(form.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('resolves every dimension item pool entry to a real item form', () => {
    for (const dimension of DIMENSIONS) {
      for (const formId of dimension.itemPoolFormIds) {
        expect(() => getItemForm(formId)).not.toThrow();
      }
    }
  });

  it('resolves every dimension actor pool entry to a real actor definition', () => {
    for (const dimension of DIMENSIONS) {
      for (const actorId of dimension.actorPool) {
        expect(() => getActorDefinition(actorId)).not.toThrow();
      }
    }
  });

  it('gives every actor definition non-empty flavor text', () => {
    for (const actor of ACTORS) {
      expect(actor.flavorText.length).toBeGreaterThan(0);
    }
  });

  it('has exactly one condition weight per condition tier', () => {
    const weighted = CONDITION_WEIGHTS.map((w) => w.value).sort();
    expect(weighted).toEqual([...CONDITION_ORDER].sort());
  });

  it('has exactly one weirdness weight per weirdness tier', () => {
    const weighted = WEIRDNESS_WEIGHTS.map((w) => w.value).sort();
    expect(weighted).toEqual([...WEIRDNESS_ORDER].sort());
  });
});
