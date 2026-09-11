export function weightedPick<T>(entries: { weight: number; value: T }[]): T {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    if (roll < entry.weight) return entry.value;
    roll -= entry.weight;
  }
  return entries[entries.length - 1].value;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
