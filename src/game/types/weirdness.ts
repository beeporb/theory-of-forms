export type Weirdness = 'mundane' | 'odd' | 'uncanny' | 'impossible';

export const WEIRDNESS_ORDER: Weirdness[] = ['mundane', 'odd', 'uncanny', 'impossible'];

export const WEIRDNESS_LABEL: Record<Weirdness, string> = {
  mundane: 'Mundane',
  odd: 'Odd',
  uncanny: 'Uncanny',
  impossible: 'Impossible',
};
