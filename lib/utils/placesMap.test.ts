import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Destination } from '../content/destinations.ts';
import {
  contextLabel,
  drawPlacesMap,
  fittedBounds,
  graticuleStep,
  labelBox,
  PIN_SPACING,
  PLACES_MAP_FRAME,
  placePinLabel,
  spreadPins,
  type Box,
} from './placesMap.ts';

const hunza: Destination = JSON.parse(readFileSync(path.join(process.cwd(), 'content/destinations/hunza.json'), 'utf8'));
const { width, height, padding } = PLACES_MAP_FRAME;

describe('drawPlacesMap', () => {
  const drawing = drawPlacesMap(hunza.places!, hunza.mapLabels);

  it('puts every Hunza place inside the frame, within its padding, in list order', () => {
    expect(drawing.pins.map((p) => p.id)).toEqual(hunza.places!.map((p) => p.id));
    for (const { x, y } of drawing.pins) {
      expect(x).toBeGreaterThanOrEqual(padding);
      expect(x).toBeLessThanOrEqual(width - padding);
      expect(y).toBeGreaterThanOrEqual(padding);
      expect(y).toBeLessThanOrEqual(height - padding);
    }
  });

  it('keeps the map’s directions: Passu north of Baltit, Attabad east of it, the Rakaposhi viewpoint south-west', () => {
    const at = (id: string) => drawing.pins.find((p) => p.id === id)!;
    expect(at('passu-cones').y).toBeLessThan(at('baltit-fort').y);
    expect(at('attabad-lake').x).toBeGreaterThan(at('baltit-fort').x);
    expect(at('rakaposhi-viewpoint').x).toBeLessThan(at('baltit-fort').x);
    expect(at('rakaposhi-viewpoint').y).toBeGreaterThan(at('baltit-fort').y);
  });

  it('keeps no two pins closer than the pin spacing (Baltit and Altit are 1.5 km apart)', () => {
    const { pins } = drawing;
    for (const [i, a] of pins.entries()) {
      for (const b of pins.slice(i + 1)) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(PIN_SPACING - 0.2);
    }
  });

  it('draws a graticule every 0.1° for a valley, labelled "36.3°N" and "74.7°E"', () => {
    expect(drawing.parallels.map((p) => p.label)).toContain('36.3°N');
    expect(drawing.meridians.map((m) => m.label)).toContain('74.7°E');
    for (const [a, b] of [drawing.parallels, drawing.meridians].flatMap((lines) => lines.slice(1).map((l, i) => [lines[i], l]))) {
      expect(b.value - a.value).toBeCloseTo(0.1);
    }
  });

  it('labels Karimabad at its place and Gilgit and Khunjerab at the edges, with arrows', () => {
    expect(drawing.labels.map((l) => [l.text, l.edge])).toEqual([
      ['Karimabad', null],
      ['↓ Gilgit', 'bottom'],
      ['→ Khunjerab', 'right'],
    ]);
  });

  it('centres one place alone, at a sensible span rather than street scale', () => {
    const lone = drawPlacesMap([{ id: 'baltit-fort', lat: 36.3275, lon: 74.6696 }]);
    expect(lone.pins[0]).toEqual({ id: 'baltit-fort', x: width / 2, y: height / 2 });
    expect(lone.parallels.length).toBeGreaterThan(0);
    expect(lone.meridians.length).toBeGreaterThan(0);
  });
});

describe('fittedBounds', () => {
  it('widens a single point to the minimum span about itself', () => {
    const [sw, ne] = fittedBounds([{ lat: 36, lon: 74 }]);
    expect(ne.lat - sw.lat).toBeCloseTo(0.05);
    expect((sw.lon + ne.lon) / 2).toBeCloseTo(74);
  });

  it('keeps a wider spread as it is', () => {
    expect(fittedBounds([{ lat: 35, lon: 74 }, { lat: 36, lon: 75 }])).toEqual([{ lat: 35, lon: 74 }, { lat: 36, lon: 75 }]);
  });
});

describe('graticuleStep', () => {
  it('picks the finest step that keeps the lines few', () => {
    expect(graticuleStep(0.5)).toBe(0.1);
    expect(graticuleStep(0.15)).toBe(0.05);
    expect(graticuleStep(1.4)).toBe(0.25);
    expect(graticuleStep(9)).toBe(1);
  });
});

describe('spreadPins', () => {
  it('parts pins on the same spot, and leaves pins far apart where they are', () => {
    const [a, b, c] = spreadPins([{ x: 200, y: 200 }, { x: 200, y: 200 }, { x: 100, y: 100 }], PLACES_MAP_FRAME);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(PIN_SPACING - 0.2);
    expect(c).toEqual({ x: 100, y: 100 });
  });
});

describe('contextLabel', () => {
  const frame = { width, height };

  it('sits at its place inside the frame, on the side clear of the pins', () => {
    expect(contextLabel('Karimabad', { x: 100, y: 100 }, frame)).toEqual({ text: 'Karimabad', x: 100, y: 100, edge: null, align: 'start' });
    expect(contextLabel('Karimabad', { x: 100, y: 100 }, frame, [{ x: 130, y: 100 }]).align).toBe('end');
  });

  it('runs back from its place near the right edge, so it stays inside', () => {
    expect(contextLabel('Khunjerab', { x: 470, y: 100 }, frame).align).toBe('end');
  });

  it('pins a place beyond the frame to the nearest edge, with an arrow', () => {
    expect(contextLabel('Gilgit', { x: 40, y: 600 }, frame)).toEqual({ text: '↓ Gilgit', x: 40, y: height - 8, edge: 'bottom', align: 'start' });
    expect(contextLabel('Khunjerab', { x: 520, y: -300 }, frame)).toMatchObject({ text: '↑ Khunjerab', y: 8, edge: 'top', align: 'end' });
    expect(contextLabel('Chilas', { x: -200, y: 300 }, frame)).toMatchObject({ text: '← Chilas', x: 8, y: 300, edge: 'left' });
  });
});

describe('placePinLabel', () => {
  const frame: Box = { x: 0, y: 0, width: 484, height: 420 };
  const size = { width: 80, height: 18 };
  const pin = (x: number, y: number): Box => ({ x: x - 13, y: y - 13, width: 26, height: 26 });

  it('puts the name above the pin when that spot is clear', () => {
    expect(placePinLabel(pin(240, 200), size, frame, { pins: [], labels: [] }, 8)).toEqual({ spot: 'above', hidden: [] });
  });

  it('skips a spot that leaves the frame (a pin at the top goes below)', () => {
    expect(placePinLabel(pin(240, 20), size, frame, { pins: [], labels: [] }, 8).spot).toBe('below');
  });

  it('takes the first spot that clears the other pins', () => {
    const above = pin(240, 165);
    const below = pin(240, 235);
    expect(placePinLabel(pin(240, 200), size, frame, { pins: [above, below], labels: [] }, 8).spot).toBe('right');
  });

  it('hides the context labels its name would cover', () => {
    const lit = pin(240, 200);
    const covered = labelBox(lit, size, 'above', 8);
    const clear: Box = { x: 10, y: 10, width: 40, height: 16 };
    expect(placePinLabel(lit, size, frame, { pins: [], labels: [clear, covered] }, 8).hidden).toEqual([1]);
  });
});
