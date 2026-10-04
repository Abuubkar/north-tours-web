import type { Settings } from '../content/settings.ts';
import type { DetailsSummary, TripSummary } from './plannerSummary.ts';
import { fillTokens, tokensIn } from './tokens.ts';

/*
 * The planner's two WhatsApp messages (PRD #71), from the line templates in settings: the trip
 * request ("Send on WhatsApp") and the call back ("Request a call back"). A line whose tokens are
 * all empty is left out.
 */

/** The line templates in `settings.whatsapp.planner`. */
export type PlannerTemplates = Settings['whatsapp']['planner'];

/** A template filled in, or null when every token in it is empty. */
function line(template: string, values: Record<string, string | null>): string | null {
  const tokens = tokensIn(template);
  if (tokens.length > 0 && tokens.every((token) => !values[token])) return null;
  return fillTokens(template, Object.fromEntries(tokens.map((token) => [token, values[token] ?? ''])));
}

/** The values the lines take: the dates with the trip length, the group with its type, open choices as "Any". */
function values(templates: PlannerTemplates, trip: TripSummary, details: DetailsSummary): Record<string, string | null> {
  return {
    destinations: trip.destinations,
    dates: trip.dates && (trip.length ? `${trip.dates} (${trip.length})` : trip.dates),
    group: trip.group && (trip.groupType ? `${trip.group} · ${trip.groupType}` : trip.group),
    hotels: trip.hotels ?? templates.any,
    transport: trip.transport ?? templates.any,
    departingFrom: trip.from,
    budget: trip.budget,
    bestTime: details.bestTime,
    notes: details.notes,
    name: details.name,
    phone: details.phone,
  };
}

const lines = (templates: PlannerTemplates, keys: (keyof PlannerTemplates)[], filled: Record<string, string | null>) =>
  keys.map((key) => line(templates[key], filled)).filter((text) => text !== null);

/** The trip request: the greeting, the trip, the best time and notes, then who it's from. */
export function tripRequestMessage(templates: PlannerTemplates, trip: TripSummary, details: DetailsSummary): string {
  const filled = values(templates, trip, details);
  const keys: (keyof PlannerTemplates)[] = ['greeting', 'destinations', 'dates', 'group', 'stay', 'departingFrom', 'budget', 'bestTime', 'notes', 'name', 'phone'];
  return lines(templates, keys, filled).join('\n');
}

/** The call back: "Please call me back on {phone}, best time {bestTime}." (lower case, or "any time"), the trip, then the name. */
export function callBackMessage(templates: PlannerTemplates, trip: TripSummary, details: DetailsSummary): string {
  const filled = values(templates, trip, details);
  const first = fillTokens(templates.callBack, {
    phone: details.phone ?? '',
    bestTime: details.bestTime ? details.bestTime.toLowerCase() : templates.anyTime,
  });
  const keys: (keyof PlannerTemplates)[] = ['destinations', 'dates', 'group', 'stay', 'departingFrom', 'budget', 'notes', 'name'];
  return [first, ...lines(templates, keys, filled)].join('\n');
}
