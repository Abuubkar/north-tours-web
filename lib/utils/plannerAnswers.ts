import {
  ADULTS,
  CHILDREN,
  GROUP_TYPES,
  HOTELS,
  PLANNER_BUDGETS,
  toggled,
  TRANSPORT,
  TRIP_LENGTHS,
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
 * Pure, so the steps, the review and the message always agree. Most choice questions take any
 * number of answers (owner feedback, 2026-10-05), each kept in its options' order; the date mode
 * and the departing city stay one answer.
 */

export type TripAnswers = {
  /** Destination slugs and "unsure", in the choices' order. */
  destinations: string[];
  dateMode: DateMode;
  /** Exact dates, YYYY-MM-DD. */
  from: string | null;
  to: string | null;
  /** The flexible months, YYYY-MM, earliest first. */
  months: string[];
  /** The trip lengths picked: the planner's only length question. */
  lengths: TripLength[];
  adults: number;
  children: number;
  /** One per child: 0 for "Under 2", or 2 to 17; null until given. */
  ages: (number | null)[];
  groupType: GroupType[];
  hotels: Hotels[];
  transport: Transport[];
  /** Always one city: Lahore by default (the owner kept it a single answer, 2026-10-05). */
  departingFrom: DepartingFrom;
  /** The city typed for "Other city". */
  otherCity: string;
  budget: PlannerBudget[];
};

/** Who's coming's optional questions answered with any number of chips, named as in page copy. */
export type ChipQuestion = 'groupType' | 'hotels' | 'transport' | 'budget';

/** An option of one of those questions, e.g. "family" for the group type. */
export type ChipValue<K extends ChipQuestion> = TripAnswers[K][number];

/** Each of those questions' options, in order. */
export const CHIP_OPTIONS: { [K in ChipQuestion]: readonly ChipValue<K>[] } = {
  groupType: GROUP_TYPES,
  hotels: HOTELS,
  transport: TRANSPORT,
  budget: PLANNER_BUDGETS,
};

export const DEFAULT_ANSWERS: TripAnswers = {
  destinations: [],
  dateMode: 'flexible',
  from: null,
  to: null,
  months: [],
  lengths: [],
  adults: ADULTS.default,
  children: CHILDREN.default,
  ages: [],
  groupType: [],
  hotels: [],
  transport: [],
  departingFrom: 'lahore',
  otherCity: '',
  budget: [],
};

/** Ticks or unticks a destination, keeping the choices' order (`choices`). */
export function toggleDestination(answers: TripAnswers, id: string, choices: readonly string[]): TripAnswers {
  return { ...answers, destinations: toggled(answers.destinations, id, choices) };
}

/** Picks a flexible month, or unpicks it: any number, earliest first. */
export function pickMonth(answers: TripAnswers, month: string): TripAnswers {
  const months = answers.months.includes(month) ? answers.months.filter((m) => m !== month) : [...answers.months, month].sort();
  return { ...answers, months };
}

/** Picks a trip length, or unpicks it: any number, shortest first. */
export function pickLength(answers: TripAnswers, length: TripLength): TripAnswers {
  return { ...answers, lengths: toggled(answers.lengths, length, TRIP_LENGTHS) };
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

/** An optional chip question: picks the option, or unpicks it; any number, in the options' order. */
export function pickOption<K extends ChipQuestion>(answers: TripAnswers, question: K, id: ChipValue<K>): TripAnswers {
  return { ...answers, [question]: toggled<ChipValue<K>>(answers[question] as readonly ChipValue<K>[], id, CHIP_OPTIONS[question]) };
}

/** The city typed for "Other city". */
export function setOtherCity(answers: TripAnswers, otherCity: string): TripAnswers {
  return { ...answers, otherCity };
}

/** Where the trip starts: always one city, so another replaces it and pressing the chosen one keeps it. */
export function pickDeparture(answers: TripAnswers, from: DepartingFrom): TripAnswers {
  return { ...answers, departingFrom: from };
}
