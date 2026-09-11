export type Rarity = 'broken' | 'cartoon' | 'anthropomorphized';

export const RARITY_ORDER: Rarity[] = ['broken', 'cartoon', 'anthropomorphized'];

export const RARITY_LABEL: Record<Rarity, string> = {
  broken: 'Broken',
  cartoon: 'Cartoon',
  anthropomorphized: 'Anthropomorphized',
};
