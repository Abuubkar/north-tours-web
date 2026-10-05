import type { PlannerCopy } from '../content/pages.ts';
import { phoneProblem } from './phone.ts';
import type { TripAnswers } from './plannerAnswers.ts';
import type { Details } from './plannerDetails.ts';
import { monthOf } from './plannerOptions.ts';

/*
 * What Next checks on each planner step (PRD #71). Each problem names where its message shows
 * (`group`), the controls that are wrong (`fields`, the first is focused) and the message, in page
 * order, so the page can show every message and take the visitor to the first.
 */

export type FieldProblem = {
  /** Where the message shows: one per field or group of controls. */
  group: string;
  /** The controls marked invalid, in page order; the page focuses the first. */
  fields: string[];
  message: string;
};

type ErrorMessages = PlannerCopy['errors'];

/** Step 1, Where and when. `today` is YYYY-MM-DD in Karachi: no date or month before it. */
export function whereWhenErrors(answers: TripAnswers, today: string, messages: ErrorMessages): FieldProblem[] {
  const errors: FieldProblem[] = [];
  if (answers.destinations.length === 0) {
    errors.push({ group: 'destinations', fields: ['destinations'], message: messages.destinations });
  }
  const dates = datesError(answers, today, messages);
  if (dates) errors.push(dates);
  return errors;
}

/** Step 2, Who's coming: every child needs an age ("Under 2" counts). The first child without one is focused. */
export function whosComingErrors(answers: TripAnswers, messages: ErrorMessages): FieldProblem[] {
  const missing = answers.ages.flatMap((age, i) => (age === null ? [`age-${i}`] : []));
  return missing.length > 0 ? [{ group: 'ages', fields: missing, message: messages.ages }] : [];
}

function datesError(answers: TripAnswers, today: string, messages: ErrorMessages): FieldProblem | null {
  const problem = (fields: string[], message: string) => ({ group: 'dates', fields, message });
  if (answers.dateMode === 'flexible') {
    // At least one month, none of them past.
    const ok = answers.months.length > 0 && answers.months.every((month) => month >= monthOf(today));
    return ok ? null : problem(['month'], messages.month);
  }
  const { from, to } = answers;
  if (!from || !to) return problem([!from && 'from', !to && 'to'].filter((f) => f !== false), messages.dates);
  if (from < today || to < today) return problem([from < today && 'from', to < today && 'to'].filter((f) => f !== false), messages.pastDate);
  if (to < from) return problem(['to'], messages.endBeforeStart);
  return null;
}

/** Step 3, Your details: a name (not just spaces), then the WhatsApp number's rules. */
export function detailsErrors(details: Details, messages: ErrorMessages): FieldProblem[] {
  const errors: FieldProblem[] = [];
  if (details.name.trim() === '') errors.push({ group: 'name', fields: ['name'], message: messages.name });
  const phone = phoneProblem(details.phone, messages);
  if (phone) errors.push({ group: 'phone', ...phone });
  return errors;
}

/** What Next checks on a step: 1 Where and when, 2 Who's coming, 3 Your details. */
export function stepErrors(step: number, answers: TripAnswers, details: Details, today: string, messages: ErrorMessages): FieldProblem[] {
  if (step === 1) return whereWhenErrors(answers, today, messages);
  if (step === 2) return whosComingErrors(answers, messages);
  if (step === 3) return detailsErrors(details, messages);
  return [];
}

/** The message a group shows, if it has a problem. */
export function groupError(errors: readonly FieldProblem[], group: string): string | undefined {
  return errors.find((error) => error.group === group)?.message;
}

/** Whether a control is marked invalid. */
export function fieldInvalid(errors: readonly FieldProblem[], field: string): boolean {
  return errors.some((error) => error.fields.includes(field));
}
