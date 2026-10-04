import { DAYS, lengthForDays, type DateMode, type TripLength } from './plannerOptions.ts';

/*
 * The Trip Planner's answers about the trip (PRD #71), and the changes the steps make to them.
 * Pure, so the steps, the review and the message always agree.
 */

export type TripAnswers = {
  /** Destination slugs and "unsure", in the choices' order. */
  destinations: string[];
  dateMode: DateMode;
  /** Exact dates, YYYY-MM-DD. */
  from: string | null;
  to: string | null;
  /** A flexible month, YYYY-MM. */
  month: string | null;
  /** Roughly how many days, for flexible dates. */
  days: number;
  /** The trip length the visitor picked. */
  length: TripLength | null;
  /** True until the visitor picks (or clears) a length: until then it follows the flexible days. */
  lengthAuto: boolean;
};

export const DEFAULT_ANSWERS: TripAnswers = {
  destinations: [],
  dateMode: 'flexible',
  from: null,
  to: null,
  month: null,
  days: DAYS.default,
  length: null,
  lengthAuto: true,
};

/** Ticks or unticks a destination, keeping the choices' order (`choices`). */
export function toggleDestination(answers: TripAnswers, id: string, choices: readonly string[]): TripAnswers {
  const on = answers.destinations.includes(id);
  return { ...answers, destinations: choices.filter((choice) => (choice === id ? !on : answers.destinations.includes(choice))) };
}

/** One month at a time: another replaces it, and picking it again clears it. */
export function pickMonth(answers: TripAnswers, month: string): TripAnswers {
  return { ...answers, month: answers.month === month ? null : month };
}

/** Picking a length stops the auto-fill; picking the shown length again clears it. */
export function pickLength(answers: TripAnswers, length: TripLength): TripAnswers {
  return { ...answers, length: tripLength(answers) === length ? null : length, lengthAuto: false };
}

/**
 * The trip length shown and sent: the one the visitor picked, or, until they pick one, the
 * length that fits their flexible days once they've chosen a month.
 */
export function tripLength(answers: TripAnswers): TripLength | null {
  if (!answers.lengthAuto) return answers.length;
  return answers.dateMode === 'flexible' && answers.month ? lengthForDays(answers.days) : null;
}

/** Whether the trip length is being filled from the flexible days (its hint says so). */
export function lengthIsAutoFilled(answers: TripAnswers): boolean {
  return answers.lengthAuto && tripLength(answers) !== null;
}
