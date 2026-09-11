export type GearSlot = 'weapon' | 'armor' | 'tool';

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
}
