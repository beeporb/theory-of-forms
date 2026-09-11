import type { RunOutcome } from '../types/pastRun';

export const RUN_OUTCOME_LABEL: Record<RunOutcome, string> = {
  extracted: 'Extracted',
  died: 'Died',
  abandoned: 'Abandoned',
};
