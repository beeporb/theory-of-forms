export interface CollectorDefinition {
  id: string;
  name: string;
  flavorText: string;
  requiredFormIds: string[];
}

export interface CollectorProgress {
  collectorId: string;
  turnedInFormIds: string[];
}
