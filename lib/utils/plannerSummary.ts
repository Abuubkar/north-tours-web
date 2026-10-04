import type { PlannerCopy } from '../content/pages.ts';
import { messageDate, shortMonthYear } from './dates.ts';
import { internationalPhone } from './phone.ts';
import { tripLength, type TripAnswers } from './plannerAnswers.ts';
import type { Details } from './plannerDetails.ts';
import { UNSURE, type BestTime, type DepartingFrom, type GroupType, type Hotels, type PlannerBudget, type Transport, type TripLength } from './plannerOptions.ts';
import { fillTokens } from './tokens.ts';

/*
 * The trip in words (PRD #71): one summary for the review, the side column, the summary bar and
 * the WhatsApp message, so they always agree. Each value is null when the visitor hasn't answered.
 */

/** "{count} adult" and "{count} adults". */
type CountWords = { one: string; other: string };

/** The words a summary is written in: the page's labels and patterns, and the destinations' names. */
export type SummaryWords = {
  /** Destination names by slug. */
  destinations: Readonly<Record<string, string>>;
  /** "Not sure" in a summary: "Suggest something". */
  unsure: string;
  /** "{month}, about {days} days". */
  flexibleDates: string;
  /** "{from} – {to}". */
  exactDates: string;
  adults: CountWords;
  children: CountWords;
  /** After the children: "(age {ages})" and "(ages {ages})". */
  ages: CountWords;
  /** A child under 2, in the list of ages: "under 2". */
  underTwo: string;
  options: {
    length: Readonly<Record<TripLength, string>>;
    groupType: Readonly<Record<GroupType, string>>;
    hotels: Readonly<Record<Hotels, string>>;
    transport: Readonly<Record<Transport, string>>;
    departingFrom: Readonly<Record<DepartingFrom, string>>;
    budget: Readonly<Record<PlannerBudget, string>>;
    bestTime: Readonly<Record<BestTime, string>>;
  };
};

/** The summary's words from the page's copy and the destinations' names. */
export function summaryWords(copy: Pick<PlannerCopy, 'summary' | 'whereWhen' | 'whosComing' | 'details'>, destinations: readonly { slug: string; name: string }[]): SummaryWords {
  const { whosComing } = copy;
  return {
    ...copy.summary,
    destinations: Object.fromEntries(destinations.map((d) => [d.slug, d.name])),
    options: {
      length: copy.whereWhen.length.options,
      groupType: whosComing.groupType.options,
      hotels: whosComing.hotels.options,
      transport: whosComing.transport.options,
      departingFrom: whosComing.departingFrom.options,
      budget: whosComing.budget.options,
      bestTime: copy.details.bestTime.options,
    },
  };
}

/** The nine trip rows, in order. */
export const SUMMARY_ROWS = ['destinations', 'dates', 'length', 'group', 'groupType', 'hotels', 'transport', 'from', 'budget'] as const;

export type SummaryRow = (typeof SUMMARY_ROWS)[number];

export type TripSummary = Record<SummaryRow, string | null>;

const count = (n: number, words: CountWords) => fillTokens(n === 1 ? words.one : words.other, { count: String(n) });

/** "Jun 2027, about 6 days", "12 Jun 2027 – 18 Jun 2027", or null until the dates are given. */
function dates(answers: TripAnswers, words: SummaryWords): string | null {
  if (answers.dateMode === 'flexible') {
    return answers.month ? fillTokens(words.flexibleDates, { month: shortMonthYear(answers.month), days: String(answers.days) }) : null;
  }
  if (!answers.from || !answers.to) return null;
  return fillTokens(words.exactDates, { from: messageDate(answers.from), to: messageDate(answers.to) });
}

/** "2 adults, 2 children (ages 6, 9)", "1 adult, 1 child (age under 2)"; ages not given yet are left out. */
function group(answers: TripAnswers, words: SummaryWords): string {
  const adults = count(answers.adults, words.adults);
  if (answers.children === 0) return adults;
  const ages = answers.ages.filter((age) => age !== null).map((age) => (age === 0 ? words.underTwo : String(age)));
  const children = count(answers.children, words.children);
  if (ages.length === 0) return `${adults}, ${children}`;
  return `${adults}, ${children} ${fillTokens(ages.length === 1 ? words.ages.one : words.ages.other, { ages: ages.join(', ') })}`;
}

/** The trip's nine rows. */
export function tripSummary(answers: TripAnswers, words: SummaryWords): TripSummary {
  const { options } = words;
  const length = tripLength(answers);
  const from =
    answers.departingFrom === 'other' ? answers.otherCity.trim() || options.departingFrom.other : options.departingFrom[answers.departingFrom];
  return {
    destinations:
      answers.destinations.length > 0 ? answers.destinations.map((id) => (id === UNSURE ? words.unsure : words.destinations[id] ?? id)).join(', ') : null,
    dates: dates(answers, words),
    length: length && options.length[length],
    group: group(answers, words),
    groupType: answers.groupType && options.groupType[answers.groupType],
    hotels: answers.hotels && options.hotels[answers.hotels],
    transport: answers.transport && options.transport[answers.transport],
    from,
    budget: answers.budget && options.budget[answers.budget],
  };
}

/** Your details' four rows, in order. */
export const DETAIL_ROWS = ['name', 'phone', 'bestTime', 'notes'] as const;

export type DetailsSummary = Record<(typeof DETAIL_ROWS)[number], string | null>;

/** Your details in words: the number in international form once one is typed. */
export function detailsSummary(details: Details, words: SummaryWords): DetailsSummary {
  const typed = details.phone.mode === 'pk' ? details.phone.pk.trim() : `${details.phone.code}${details.phone.number}`.trim();
  return {
    name: details.name.trim() || null,
    phone: typed ? internationalPhone(details.phone) : null,
    bestTime: details.bestTime && words.options.bestTime[details.bestTime],
    notes: details.notes.trim() || null,
  };
}
