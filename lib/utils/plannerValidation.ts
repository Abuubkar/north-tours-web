import type { PlannerCopy } from '../content/pages.ts';
import type { TripAnswers } from './plannerAnswers.ts';
import { monthOf } from './plannerOptions.ts';

/*
 * What Next checks on each planner step (PRD #71). Each problem names where its message shows
 * (`group`), the controls that are wrong (`fields`, the first is focused) and the message, in page
 * order, so the page can show every message and take the visitor to the first.
 */

export type FieldError = {
  /** Where the message shows: one per field or group of controls. */
  group: string;
  /** The controls marked invalid, in page order; the page focuses the first. */
  fields: string[];
  message: string;
};

export type ErrorMessages = PlannerCopy['errors'];

/** Step 1, Where and when. `today` is YYYY-MM-DD in Karachi: no date or month before it. */
export function whereWhenErrors(answers: TripAnswers, today: string, messages: ErrorMessages): FieldError[] {
  const errors: FieldError[] = [];
  if (answers.destinations.length === 0) {
    errors.push({ group: 'destinations', fields: ['destinations'], message: messages.destinations });
  }
  const dates = datesError(answers, today, messages);
  if (dates) errors.push(dates);
  return errors;
}

function datesError(answers: TripAnswers, today: string, messages: ErrorMessages): FieldError | null {
  const problem = (fields: string[], message: string) => ({ group: 'dates', fields, message });
  if (answers.dateMode === 'flexible') {
    return answers.month && answers.month >= monthOf(today) ? null : problem(['month'], messages.month);
  }
  const { from, to } = answers;
  if (!from || !to) return problem([!from && 'from', !to && 'to'].filter((f) => f !== false), messages.dates);
  if (from < today || to < today) return problem([from < today && 'from', to < today && 'to'].filter((f) => f !== false), messages.pastDate);
  if (to < from) return problem(['to'], messages.endBeforeStart);
  return null;
}

/** The message a group shows, if it has a problem. */
export function groupError(errors: readonly FieldError[], group: string): string | undefined {
  return errors.find((error) => error.group === group)?.message;
}

/** Whether a control is marked invalid. */
export function fieldInvalid(errors: readonly FieldError[], field: string): boolean {
  return errors.some((error) => error.fields.includes(field));
}
