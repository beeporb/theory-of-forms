import type { EventDefinition } from '../types/event';

export const EVENTS: EventDefinition[] = [
  {
    id: 'locked-door',
    icon: 'lock',
    prompt: 'A door has been welded shut. Whatever is behind it might be worth the trouble.',
    choices: [
      {
        id: 'force-it',
        label: 'Force it open',
        description: 'Risk getting hurt for a real shot at something good.',
        outcomeWeights: [
          { weight: 55, value: 'loot' },
          { weight: 45, value: 'hazard' },
        ],
      },
      {
        id: 'leave-it',
        label: 'Leave it be',
        description: "Whatever's in there isn't worth it.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'strange-machine',
    icon: 'cog',
    prompt: 'A machine hums quietly in the corner, still somehow running after all this time.',
    choices: [
      {
        id: 'investigate',
        label: 'Get a closer look',
        description: 'It might be dangerous. It might be worth fixing up.',
        outcomeWeights: [
          { weight: 40, value: 'positive' },
          { weight: 60, value: 'hazard' },
        ],
      },
      {
        id: 'walk-away',
        label: 'Walk away',
        description: "Best not to mess with what's still running.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
];

export function getEvent(eventId: string): EventDefinition {
  const event = EVENTS.find((e) => e.id === eventId);
  if (!event) throw new Error(`Unknown event: ${eventId}`);
  return event;
}
