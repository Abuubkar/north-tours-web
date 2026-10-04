import { DEFAULT_ANSWERS, toggleDestination, type TripAnswers } from './plannerAnswers.ts';
import { EMPTY_DETAILS } from './plannerDetails.ts';
import {
  ADULTS,
  AGES,
  CHILDREN,
  DATE_MODES,
  DAYS,
  DEPARTING_FROM,
  destinationChoices,
  GROUP_TYPES,
  HOTELS,
  monthChoices,
  PLANNER_BUDGETS,
  TRANSPORT,
  TRIP_LENGTHS,
} from './plannerOptions.ts';
import { stepErrors } from './plannerValidation.ts';
import type { PlannerCopy } from '../content/pages.ts';

/*
 * The planner's saved answers (ADR-0018): the trip answers and the step, in localStorage under
 * one key. Your details are never written. What comes back is checked field by field with this
 * hand-written parser (no schema code ships to visitors, ADR-0013): an invalid field falls back
 * to its default on its own.
 */

export const PLANNER_STORAGE_KEY = 'planner-answers-v1';

/** The review: the furthest step saved. The thank-you is never saved. */
const LAST_SAVED_STEP = 4;

/** The trip answers and the step, as written: never the name, number, best time or notes. */
export function serialisePlanner(answers: TripAnswers, step: number): string {
  return JSON.stringify({ ...answers, step: Math.min(step, LAST_SAVED_STEP) });
}

/** What the parser checks against: the destinations in content, today in Karachi, and the page's messages. */
export type ParseContext = { destinations: readonly string[]; today: string; messages: PlannerCopy['errors'] };

const isInt = (value: unknown, { min, max }: { min: number; max: number }): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

/** One of the options, or the fallback. */
const oneOf = <T extends string | number>(options: readonly T[], value: unknown, fallback: T | null): T | null =>
  options.includes(value as T) ? (value as T) : fallback;

const realDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);

/** A date still to come (today counts), or null. */
const comingDate = (value: unknown, today: string) => (realDate(value) && value >= today ? value : null);

/** The trip answers in saved data, each field checked on its own; anything unreadable gives the defaults. */
export function parseAnswers(raw: string | null, { destinations, today }: Omit<ParseContext, 'messages'>): TripAnswers {
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = raw === null ? null : JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return DEFAULT_ANSWERS;
    data = parsed as Record<string, unknown>;
  } catch {
    return DEFAULT_ANSWERS;
  }
  const d = DEFAULT_ANSWERS;
  const choices = destinationChoices(destinations);
  const saved = Array.isArray(data.destinations) ? data.destinations : [];
  const adults = isInt(data.adults, ADULTS) ? data.adults : d.adults;
  const children = isInt(data.children, CHILDREN) ? data.children : d.children;
  const agesFit = Array.isArray(data.ages) && data.ages.length === children && data.ages.every((age) => age === null || AGES.includes(age as number));
  const month = typeof data.month === 'string' && monthChoices(today).includes(data.month) ? data.month : null;
  return {
    destinations: choices.filter((choice) => saved.includes(choice)),
    dateMode: oneOf(DATE_MODES, data.dateMode, d.dateMode) ?? d.dateMode,
    from: comingDate(data.from, today),
    to: comingDate(data.to, today),
    month,
    days: isInt(data.days, DAYS) ? data.days : d.days,
    length: oneOf(TRIP_LENGTHS, data.length, null),
    lengthAuto: typeof data.lengthAuto === 'boolean' ? data.lengthAuto : d.lengthAuto,
    adults,
    children,
    ages: agesFit ? (data.ages as (number | null)[]) : Array.from({ length: children }, () => null),
    groupType: oneOf(GROUP_TYPES, data.groupType, null),
    hotels: oneOf(HOTELS, data.hotels, null),
    transport: oneOf(TRANSPORT, data.transport, null),
    departingFrom: oneOf(DEPARTING_FROM, data.departingFrom, d.departingFrom) ?? d.departingFrom,
    otherCity: typeof data.otherCity === 'string' ? data.otherCity : d.otherCity,
    budget: oneOf(PLANNER_BUDGETS, data.budget, null),
  };
}

/**
 * The step to return to: the saved one (never past the review), moved back to the first step
 * that doesn't pass. Your details are never saved, so a saved review returns to Your details.
 */
export function restoredStep(raw: string | null, answers: TripAnswers, { today, messages }: Omit<ParseContext, 'destinations'>): number {
  let saved = 1;
  try {
    const step: unknown = raw === null ? null : (JSON.parse(raw) as { step?: unknown }).step;
    if (isInt(step, { min: 1, max: LAST_SAVED_STEP })) saved = step;
  } catch {
    return 1;
  }
  for (let step = 1; step < saved; step++) {
    if (stepErrors(step, answers, EMPTY_DETAILS, today, messages).length > 0) return step;
  }
  return saved;
}

/** The planner as saved: its answers and its step. */
export function parsePlanner(raw: string | null, context: ParseContext): { answers: TripAnswers; step: number } {
  const answers = parseAnswers(raw, context);
  return { answers, step: restoredStep(raw, answers, context) };
}

/**
 * A link's destination (`/plan?dest=hunza`) added to the answers, keeping what's chosen; anything
 * that isn't a destination in content is ignored.
 */
export function withLinkedDestination(answers: TripAnswers, search: string, destinations: readonly string[]): TripAnswers {
  const dest = new URLSearchParams(search).get('dest');
  if (!dest || !destinations.includes(dest) || answers.destinations.includes(dest)) return answers;
  return toggleDestination(answers, dest, destinationChoices(destinations));
}

/** The query without `dest`, so a reload doesn't add the destination again: "?dest=hunza&x=1" → "?x=1". */
export function searchWithoutDestination(search: string): string {
  const query = new URLSearchParams(search);
  query.delete('dest');
  const rest = query.toString();
  return rest ? `?${rest}` : '';
}

/** Set on <html> while saved answers or a linked destination haven't been applied: the planner stays hidden, its space kept. */
export const PLANNER_PENDING = 'data-planner-pending';

/**
 * A tiny script for the page's HTML, run before the planner is painted: with saved answers or a
 * `?dest=` link it marks the planner as pending, so step 1's defaults never flash before the
 * restored step. Without JavaScript it never runs, and nothing is hidden.
 */
export const PLANNER_PENDING_SCRIPT = `try{if(localStorage.getItem('${PLANNER_STORAGE_KEY}')||/[?&]dest=/.test(location.search))document.documentElement.setAttribute('${PLANNER_PENDING}','')}catch(e){if(/[?&]dest=/.test(location.search))document.documentElement.setAttribute('${PLANNER_PENDING}','')}`;
