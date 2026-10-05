import {
  ADULTS,
  CHILDREN,
  type DateMode,
  type DepartingFrom,
  type GroupType,
  type Hotels,
  type PlannerBudget,
  type Transport,
  type TripLength,
} from './plannerOptions.ts';

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
  /** The trip length the visitor picked: the planner's only length question. */
  length: TripLength | null;
  adults: number;
  children: number;
  /** One per child: 0 for "Under 2", or 2 to 17; null until given. */
  ages: (number | null)[];
  groupType: GroupType | null;
  hotels: Hotels | null;
  transport: Transport | null;
  /** Always set: Lahore by default. */
  departingFrom: DepartingFrom;
  /** The city typed for "Other city". */
  otherCity: string;
  budget: PlannerBudget | null;
};

/** The optional questions answered with one chip, which a second press clears. */
export type ChipQuestion = 'groupType' | 'hotels' | 'transport' | 'budget';

/** An option of one of those questions, e.g. "family" for the group type. */
export type ChipValue<K extends ChipQuestion> = NonNullable<TripAnswers[K]>;

export const DEFAULT_ANSWERS: TripAnswers = {
  destinations: [],
  dateMode: 'flexible',
  from: null,
  to: null,
  month: null,
  length: null,
  adults: ADULTS.default,
  children: CHILDREN.default,
  ages: [],
  groupType: null,
  hotels: null,
  transport: null,
  departingFrom: 'lahore',
  otherCity: '',
  budget: null,
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

/** One trip length at a time: another replaces it, and picking it again clears it. */
export function pickLength(answers: TripAnswers, length: TripLength): TripAnswers {
  return { ...answers, length: answers.length === length ? null : length };
}

/** An exact date typed or picked; an emptied field is no date. */
export function setDate(answers: TripAnswers, end: 'from' | 'to', date: string): TripAnswers {
  return { ...answers, [end]: date || null };
}

/** The earliest date a field offers: today in Karachi, and for "To", the start once it's set. */
export function dateMin(answers: TripAnswers, end: 'from' | 'to', today: string): string {
  return end === 'to' && answers.from && answers.from > today ? answers.from : today;
}

/** A number kept within its limits. */
const within = (value: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, value));

/** A new number of children: an age slot each, keeping the ages already given and dropping the extra ones. */
export function setChildren(answers: TripAnswers, children: number): TripAnswers {
  const count = within(children, CHILDREN);
  return { ...answers, children: count, ages: Array.from({ length: count }, (_, i) => answers.ages[i] ?? null) };
}

/** A new number of adults, kept from 1 to 40. */
export function setAdults(answers: TripAnswers, adults: number): TripAnswers {
  return { ...answers, adults: within(adults, ADULTS) };
}

/** One child's age. */
export function setAge(answers: TripAnswers, child: number, age: number): TripAnswers {
  return { ...answers, ages: answers.ages.map((given, i) => (i === child ? age : given)) };
}

/** An optional chip question: picking the chosen option again clears it. */
export function pickOption<K extends ChipQuestion>(answers: TripAnswers, question: K, id: ChipValue<K>): TripAnswers {
  return { ...answers, [question]: answers[question] === id ? null : id };
}

/** The city typed for "Other city". */
export function setOtherCity(answers: TripAnswers, otherCity: string): TripAnswers {
  return { ...answers, otherCity };
}

/** Where the trip starts: always one city, so pressing the chosen one keeps it. */
export function pickDeparture(answers: TripAnswers, from: DepartingFrom): TripAnswers {
  return { ...answers, departingFrom: from };
}
