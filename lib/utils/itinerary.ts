import type { Tour } from '../content/tours.ts';
import { mapProjection, type MapFrame } from './projection.ts';

/*
 * The itinerary's route and progress (PRD #47): the path the trip takes, how far along it each
 * day ends, and each stop's state on a given day. Schematic only (CLAUDE.md §8).
 */

type Day = Pick<Tour['itinerary'][number], 'stops'>;

/** A day's place on the map: index -1 is before the first day (the start, Lahore). */
export type StopState = 'current' | 'visited' | 'upcoming';

/**
 * The route as stop names: the start, then each day's stops in order, a stop repeated straight
 * after itself dropped. Also where each day ends on it (an index into the route).
 */
export function routePath(start: string, days: readonly Day[]): { route: string[]; dayEnds: number[] } {
  const route = [start];
  const dayEnds = days.map(({ stops }) => {
    for (const stop of stops) if (route[route.length - 1] !== stop) route.push(stop);
    return route.length - 1;
  });
  return { route, dayEnds };
}

type Point = { x: number; y: number };

/**
 * How far along the route each day ends, as a share of its whole length (0 to 1), measured
 * along the drawn points. The last day ends at 1. A route with no length counts every day as done.
 */
export function routeProgress(points: readonly Point[], dayEnds: readonly number[]): number[] {
  const upTo = [0];
  for (let i = 1; i < points.length; i++) {
    upTo.push(upTo[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  const total = upTo[upTo.length - 1];
  return dayEnds.map((end) => (total === 0 ? 1 : upTo[end] / total));
}

/**
 * Each stop's state on `day` (0-based; -1 before the first day): the day's last stop is current
 * (the start before day 1); stops first reached on an earlier day, or passed earlier on this
 * one, are visited; the rest are upcoming.
 */
export function stopStates(start: string, days: readonly Day[], day: number): Map<string, StopState> {
  const states = new Map<string, StopState>([[start, day < 0 ? 'current' : 'visited']]);
  days.forEach(({ stops }, i) => {
    for (const stop of stops) if (!states.has(stop)) states.set(stop, i <= day ? 'visited' : 'upcoming');
  });
  if (day >= 0) {
    const today = days[day].stops;
    states.set(today[today.length - 1], 'current');
  }
  return states;
}

/** The side map's drawing (340px wide beside the days) and each day's mini map (112×156). */
export const ITINERARY_MAP_FRAME = { width: 560, height: 700, padding: 56 } as const;
export const MINI_MAP_FRAME = { width: 560, height: 780, padding: 110 } as const;

/** A day counts as being read once its top is above half the viewport (#46's rule, at 50%). */
export const ITINERARY_LINE = 0.5;

type Stop = Tour['stops'][number];

/**
 * Everything an itinerary map draws, in the frame's coordinates: each stop's point, the route
 * as an SVG path, and how far along it each day ends. The projection fits the tour's stops.
 */
export function drawItinerary(stops: readonly Stop[], days: readonly Day[], frame: MapFrame) {
  const { project } = mapProjection(stops, frame);
  const points = new Map(stops.map((stop) => [stop.name, project(stop)]));
  const { route, dayEnds } = routePath(stops[0].name, days);
  const path = route.map((name) => points.get(name)!);
  return {
    stops: stops.map((stop) => ({ ...stop, ...points.get(stop.name)! })),
    d: path.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' '),
    progress: routeProgress(path, dayEnds),
  };
}
