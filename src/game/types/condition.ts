export type Condition = 'wrecked' | 'worn' | 'sound' | 'pristine';

export const CONDITION_ORDER: Condition[] = ['wrecked', 'worn', 'sound', 'pristine'];

export const CONDITION_LABEL: Record<Condition, string> = {
  wrecked: 'Wrecked',
  worn: 'Worn',
  sound: 'Sound',
  pristine: 'Pristine',
};
