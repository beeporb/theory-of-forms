export type Weirdness = 'mundane' | 'odd' | 'uncanny' | 'unstable' | 'impossible' | 'paradoxical' | 'forbidden';

export const WEIRDNESS_ORDER: Weirdness[] = [
  'mundane',
  'odd',
  'uncanny',
  'unstable',
  'impossible',
  'paradoxical',
  'forbidden',
];

export const WEIRDNESS_LABEL: Record<Weirdness, string> = {
  mundane: 'Mundane',
  odd: 'Odd',
  uncanny: 'Uncanny',
  unstable: 'Unstable',
  impossible: 'Impossible',
  paradoxical: 'Paradoxical',
  forbidden: 'Forbidden',
};
