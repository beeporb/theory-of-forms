import type { Condition } from '../types/condition';
import type { Weirdness } from '../types/weirdness';

// Condition darkens/desaturates a beat-up find and brightens a pristine one.
function conditionFilter(condition: Condition): string {
  switch (condition) {
    case 'wrecked':
      return 'grayscale(0.65) brightness(0.7) contrast(0.9)';
    case 'worn':
      return 'grayscale(0.3) brightness(0.85)';
    case 'sound':
      return '';
    case 'pristine':
      return 'saturate(1.3) brightness(1.15)';
  }
}

// Weirdness/rarity shifts hue and adds a glow, escalating from unremarkable to impossible.
export function weirdnessFilter(weirdness: Weirdness): string {
  switch (weirdness) {
    case 'mundane':
      return '';
    case 'odd':
      return 'hue-rotate(20deg)';
    case 'uncanny':
      return 'hue-rotate(55deg) saturate(1.4) drop-shadow(0 0 3px rgba(180, 120, 255, 0.65))';
    case 'impossible':
      return 'hue-rotate(-45deg) saturate(1.8) drop-shadow(0 0 6px rgba(120, 200, 255, 0.85))';
  }
}

export function itemQualityFilter(condition: Condition, weirdness: Weirdness): string | undefined {
  const filter = [conditionFilter(condition), weirdnessFilter(weirdness)].filter(Boolean).join(' ');
  return filter || undefined;
}

export function rarityFilter(weirdness: Weirdness): string | undefined {
  return weirdnessFilter(weirdness) || undefined;
}
