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

// Weirdness/rarity shifts hue and adds a glow, escalating from unremarkable to forbidden.
export function weirdnessFilter(weirdness: Weirdness): string {
  switch (weirdness) {
    case 'mundane':
      return '';
    case 'odd':
      return 'hue-rotate(20deg)';
    case 'uncanny':
      return 'hue-rotate(55deg) saturate(1.4) drop-shadow(0 0 3px rgba(180, 120, 255, 0.65))';
    case 'unstable':
      return 'hue-rotate(90deg) saturate(1.6) drop-shadow(0 0 4px rgba(255, 140, 60, 0.7))';
    case 'impossible':
      return 'hue-rotate(-45deg) saturate(1.8) drop-shadow(0 0 6px rgba(120, 200, 255, 0.85))';
    case 'paradoxical':
      return 'hue-rotate(-90deg) saturate(2.1) drop-shadow(0 0 8px rgba(255, 80, 200, 0.9))';
    case 'forbidden':
      return 'hue-rotate(180deg) saturate(2.4) contrast(1.15) drop-shadow(0 0 10px rgba(220, 20, 20, 0.95))';
  }
}

export function itemQualityFilter(condition: Condition, weirdness: Weirdness): string | undefined {
  const filter = [conditionFilter(condition), weirdnessFilter(weirdness)].filter(Boolean).join(' ');
  return filter || undefined;
}

export function rarityFilter(weirdness: Weirdness): string | undefined {
  return weirdnessFilter(weirdness) || undefined;
}
