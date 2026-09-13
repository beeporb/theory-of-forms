/** Re-rolled independently each time a run is started — the same dimension can come up calm one run and brutal the next. */
export type ThreatLevel = 'safe' | 'low' | 'medium' | 'high' | 'danger';

export const THREAT_LEVEL_ORDER: ThreatLevel[] = ['safe', 'low', 'medium', 'high', 'danger'];

export const THREAT_LEVEL_LABEL: Record<ThreatLevel, string> = {
  safe: 'Safe',
  low: 'Low Threat',
  medium: 'Medium Threat',
  high: 'High Threat',
  danger: 'Danger Zone',
};

export const THREAT_LEVEL_DESCRIPTION: Record<ThreatLevel, string> = {
  safe: 'Quiet. Barely anything roaming, and hazards are rare.',
  low: 'The odd roaming feral, hazards are sparse.',
  medium: 'More roaming ferals, and events are more likely to turn bad.',
  high: 'Ferals everywhere, and healing is scarce. Better loot, though.',
  danger: 'No healing to be found, ferals thick on the ground, and only one way out.',
};
