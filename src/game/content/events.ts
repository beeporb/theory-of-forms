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
        guaranteedByGearId: 'warehouse-keycard',
        guaranteedKind: 'loot',
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
        guaranteedByGearId: 'override-chip',
        guaranteedKind: 'positive',
      },
      {
        id: 'walk-away',
        label: 'Walk away',
        description: "Best not to mess with what's still running.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'vending-machine',
    icon: 'coins',
    prompt: 'A vending machine hums, lit from inside by a bulb that shouldn’t still work. The buttons are stiff, but not stuck.',
    choices: [
      {
        id: 'hit-it',
        label: 'Give it a firm hit',
        description: 'The old trick. Sometimes it even works.',
        outcomeWeights: [
          { weight: 50, value: 'loot' },
          { weight: 20, value: 'hazard' },
          { weight: 30, value: 'empty' },
        ],
      },
      {
        id: 'leave-it-running',
        label: 'Leave it running',
        description: "Don't disturb machines that shouldn't work anymore.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'sleeping-form',
    icon: 'skull',
    prompt: 'Something is curled up in the corner, motionless. It might be asleep. It might be something else.',
    choices: [
      {
        id: 'check-it',
        label: 'Check it out',
        description: "Get close enough to know for sure, whatever that costs.",
        outcomeWeights: [
          { weight: 25, value: 'positive' },
          { weight: 60, value: 'hazard' },
          { weight: 15, value: 'empty' },
        ],
      },
      {
        id: 'back-away',
        label: 'Back away slowly',
        description: "Some questions aren't worth answering.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'crumbling-shelf',
    icon: 'layers',
    prompt: "A shelf leans at a dangerous angle, still loaded with whatever's left on it.",
    choices: [
      {
        id: 'pull-it-down',
        label: 'Pull it down carefully',
        description: "It'll come down one way or another. Better controlled than not.",
        outcomeWeights: [
          { weight: 60, value: 'loot' },
          { weight: 40, value: 'hazard' },
        ],
      },
      {
        id: 'leave-it-standing',
        label: 'Leave it standing',
        description: "It's not worth being underneath it when it finally goes.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'twin-doors',
    icon: 'door',
    prompt: 'Two doors, side by side, both slightly ajar. Nothing marks which is which.',
    choices: [
      {
        id: 'left-door',
        label: 'Take the left door',
        description: 'No way to know what’s behind it until you’re through.',
        outcomeWeights: [
          { weight: 50, value: 'loot' },
          { weight: 50, value: 'hazard' },
        ],
      },
      {
        id: 'right-door',
        label: 'Take the right door',
        description: 'Same odds, different door.',
        outcomeWeights: [
          { weight: 50, value: 'positive' },
          { weight: 50, value: 'hazard' },
        ],
      },
      {
        id: 'neither-door',
        label: 'Take neither',
        description: "Two unmarked doors isn't a choice worth making.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'humming-fridge',
    icon: 'flask',
    prompt: "A fridge hums to itself, door duct-taped shut. Something's been kept cold in there for a very long time.",
    choices: [
      {
        id: 'open-it',
        label: 'Cut the tape and open it',
        description: 'Cold usually means preserved. Usually.',
        outcomeWeights: [
          { weight: 40, value: 'positive' },
          { weight: 35, value: 'hazard' },
          { weight: 25, value: 'empty' },
        ],
      },
      {
        id: 'unplug-and-leave',
        label: 'Unplug it and walk away',
        description: "Whatever's kept that cold this long, better it stays shut.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'graffiti-wall',
    icon: 'scroll',
    prompt: "Someone scrawled warnings across the wall, in handwriting that isn't quite steady.",
    choices: [
      {
        id: 'read-closely',
        label: 'Read it closely',
        description: "Probably nothing. Might be worth knowing, if it isn't.",
        outcomeWeights: [
          { weight: 20, value: 'loot' },
          { weight: 80, value: 'empty' },
        ],
      },
      {
        id: 'ignore-it',
        label: 'Ignore it',
        description: "Someone's warning isn't your problem.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'unattended-toolbox',
    icon: 'wrench',
    prompt: 'A toolbox sits open and unattended, like whoever was using it just stepped away.',
    choices: [
      {
        id: 'take-what-you-can',
        label: 'Take what you can',
        description: "They're not coming back for it. Probably.",
        outcomeWeights: [
          { weight: 70, value: 'loot' },
          { weight: 30, value: 'hazard' },
        ],
      },
      {
        id: 'leave-it',
        label: 'Leave it be',
        description: "Somebody's tools. Somebody's business.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'radio-static',
    icon: 'radio',
    prompt: 'A radio crackles with static, then something almost like a voice, then static again.',
    choices: [
      {
        id: 'listen',
        label: 'Listen closer',
        description: "It could be nothing. It could be someone trying to say something.",
        outcomeWeights: [
          { weight: 30, value: 'positive' },
          { weight: 20, value: 'hazard' },
          { weight: 50, value: 'empty' },
        ],
      },
      {
        id: 'turn-it-off',
        label: 'Turn it off',
        description: "Static's easier to ignore in silence.",
        outcomeWeights: [{ weight: 100, value: 'empty' }],
      },
    ],
  },
  {
    id: 'careful-search',
    icon: 'search',
    prompt: 'The room is a mess, but a careful eye might still find something in the wreckage.',
    choices: [
      {
        id: 'search-carefully',
        label: 'Search carefully',
        description: 'Slow and thorough. Nothing here should hurt you if you take your time.',
        outcomeWeights: [{ weight: 100, value: 'loot' }],
      },
      {
        id: 'search-quickly',
        label: 'Search quickly',
        description: "Faster, but you might knock something loose doing it.",
        outcomeWeights: [
          { weight: 70, value: 'loot' },
          { weight: 30, value: 'hazard' },
        ],
      },
    ],
  },
  {
    id: 'shared-meal',
    icon: 'user',
    prompt: "Someone left food out, still looks edible. Or someone wants you to think that.",
    choices: [
      {
        id: 'eat-it',
        label: 'Eat it',
        description: "You're hungry enough to gamble on it.",
        outcomeWeights: [
          { weight: 50, value: 'positive' },
          { weight: 50, value: 'hazard' },
        ],
      },
      {
        id: 'pass',
        label: 'Pass on it',
        description: "Free food in a place like this always has a catch.",
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
