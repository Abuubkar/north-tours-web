import { describe, expect, it } from 'vitest';
import { loadTours } from '../content/tours.ts';
import { sectionInView } from './scrollSpy.ts';
import { dayState, drawItinerary, ITINERARY_LINE, ITINERARY_MAP_FRAME, MINI_MAP_FRAME, routePath, routeProgress, stopStates } from './itinerary.ts';

/** A short version of the Grand: up to Hunza, out to Attabad and back, then home. */
const days = [
  { stops: ['Lahore', 'Islamabad'] },
  { stops: ['Islamabad', 'Chilas', 'Hunza'] },
  { stops: ['Attabad'] },
  { stops: ['Hunza', 'Chilas', 'Lahore'] },
];

describe('routePath', () => {
  it('starts at the start and follows each day’s stops, dropping a stop repeated straight after itself', () => {
    expect(routePath('Lahore', days).route).toEqual(['Lahore', 'Islamabad', 'Chilas', 'Hunza', 'Attabad', 'Hunza', 'Chilas', 'Lahore']);
  });

  it('marks where each day ends', () => {
    expect(routePath('Lahore', days).dayEnds).toEqual([1, 3, 4, 7]);
  });
});

describe('routeProgress', () => {
  // Along a straight line: 0 → 10 → 30 → 40.
  const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 30, y: 0 }, { x: 40, y: 0 }];

  it('is each day’s share of the route, rising day by day and ending at 1', () => {
    expect(routeProgress(points, [1, 2, 3])).toEqual([0.25, 0.75, 1]);
  });

  it('stays put on a day that doesn’t move along the route', () => {
    expect(routeProgress(points, [1, 1, 3])).toEqual([0.25, 0.25, 1]);
  });

  it('measures diagonal legs by their length', () => {
    expect(routeProgress([{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 3, y: 9 }], [1, 2])).toEqual([0.5, 1]);
  });
});

describe('the active day (sectionInView at the itinerary’s line)', () => {
  const viewport = 1000;
  /** Day tops 600px apart, day 1's at `first`. */
  const at = (first: number) => [0, 1, 2].map((i) => ({ id: `day-${i + 1}`, top: first + i * 600 }));

  it('is none before day 1 reaches the 50% line', () => {
    expect(sectionInView(at(800), viewport, ITINERARY_LINE)).toBeNull();
  });

  it('is a day once its top is just above the line, not just below', () => {
    expect(sectionInView(at(499), viewport, ITINERARY_LINE)).toBe('day-1');
    expect(sectionInView(at(501), viewport, ITINERARY_LINE)).toBeNull();
  });

  it('is the last day past the line, and the last day at the end', () => {
    expect(sectionInView(at(-200), viewport, ITINERARY_LINE)).toBe('day-2');
    expect(sectionInView(at(-2000), viewport, ITINERARY_LINE)).toBe('day-3');
  });
});

describe('dayState', () => {
  it('marks the day being read current, earlier days visited and later ones upcoming', () => {
    expect([0, 1, 2, 3].map((day) => dayState(day, 1))).toEqual(['visited', 'current', 'upcoming', 'upcoming']);
  });

  it('marks every day upcoming before day 1', () => {
    expect([0, 1].map((day) => dayState(day, -1))).toEqual(['upcoming', 'upcoming']);
  });
});

describe('stopStates', () => {
  const at = (day: number) => Object.fromEntries(stopStates('Lahore', days, day));

  it('before day 1: the start is current, everything else upcoming', () => {
    expect(at(-1)).toEqual({ Lahore: 'current', Islamabad: 'upcoming', Chilas: 'upcoming', Hunza: 'upcoming', Attabad: 'upcoming' });
  });

  it('on day 1 the day’s last stop is current and the start visited', () => {
    expect(at(0)).toEqual({ Lahore: 'visited', Islamabad: 'current', Chilas: 'upcoming', Hunza: 'upcoming', Attabad: 'upcoming' });
  });

  it('on a middle day, stops passed that day are visited', () => {
    expect(at(1)).toEqual({ Lahore: 'visited', Islamabad: 'visited', Chilas: 'visited', Hunza: 'current', Attabad: 'upcoming' });
  });

  it('on the last day the start is current again, home', () => {
    expect(at(3)).toEqual({ Lahore: 'current', Islamabad: 'visited', Chilas: 'visited', Hunza: 'visited', Attabad: 'visited' });
  });
});

describe('drawItinerary', () => {
  it('keeps every tour’s stops inside each map’s frame, within its padding', () => {
    for (const tour of loadTours().items) {
      for (const frame of [ITINERARY_MAP_FRAME, MINI_MAP_FRAME]) {
        for (const { x, y } of drawItinerary(tour.stops, tour.itinerary, frame).stops) {
          expect(x).toBeGreaterThanOrEqual(frame.padding);
          expect(x).toBeLessThanOrEqual(frame.width - frame.padding);
          expect(y).toBeGreaterThanOrEqual(frame.padding);
          expect(y).toBeLessThanOrEqual(frame.height - frame.padding);
        }
      }
    }
  });

  it('ends every tour’s progress at 1 on its last day', () => {
    for (const tour of loadTours().items) {
      expect(drawItinerary(tour.stops, tour.itinerary, ITINERARY_MAP_FRAME).progress.at(-1)).toBe(1);
    }
  });
});
