import { describe, expect, it } from 'vitest';
import { drawRouteMap, MAP_FRAME, mapProjection } from './projection.ts';

const places = {
  Lahore: { lat: 31.55, lon: 74.34 },
  Islamabad: { lat: 33.69, lon: 73.05 },
  Swat: { lat: 34.78, lon: 72.36 },
  Gilgit: { lat: 35.92, lon: 74.31 },
  Hunza: { lat: 36.32, lon: 74.66 },
  Skardu: { lat: 35.3, lon: 75.63 },
};

const { project, parallels, meridians } = mapProjection(Object.values(places));
const at = (name: keyof typeof places) => project(places[name]);

describe('mapProjection', () => {
  it('puts Lahore south of Hunza (lower on the map)', () => {
    expect(at('Lahore').y).toBeGreaterThan(at('Hunza').y);
  });

  it('puts Skardu east of Gilgit', () => {
    expect(at('Skardu').x).toBeGreaterThan(at('Gilgit').x);
  });

  it('keeps every place inside the frame, within the padding', () => {
    for (const { x, y } of Object.values(places).map(project)) {
      expect(x).toBeGreaterThanOrEqual(MAP_FRAME.padding);
      expect(x).toBeLessThanOrEqual(MAP_FRAME.width - MAP_FRAME.padding);
      expect(y).toBeGreaterThanOrEqual(MAP_FRAME.padding);
      expect(y).toBeLessThanOrEqual(MAP_FRAME.height - MAP_FRAME.padding);
    }
  });

  it('fills the frame’s height, the longer side of this route', () => {
    expect(at('Hunza').y).toBe(MAP_FRAME.padding);
    expect(at('Lahore').y).toBe(MAP_FRAME.height - MAP_FRAME.padding);
  });

  it('draws a labelled line on each whole degree inside the frame', () => {
    expect(parallels.map((p) => p.label)).toEqual(['32°N', '33°N', '34°N', '35°N', '36°N']);
    expect(meridians.map((m) => m.label)).toEqual(['72°E', '73°E', '74°E', '75°E', '76°E']);
    for (const { at: y } of parallels) expect(y >= 0 && y <= MAP_FRAME.height).toBe(true);
    for (const { at: x } of meridians) expect(x >= 0 && x <= MAP_FRAME.width).toBe(true);
  });

  it('places each line where a point on that degree would be', () => {
    const point = project({ lat: 34, lon: 74 });
    expect(parallels.find((p) => p.value === 34)!.at).toBe(point.y);
    expect(meridians.find((m) => m.value === 74)!.at).toBe(point.x);
  });
});

describe('drawRouteMap', () => {
  const drawing = drawRouteMap({
    stops: [
      { name: 'Lahore', lat: 31.55, lon: 74.34, kind: 'start', label: 'right' },
      { name: 'Islamabad', lat: 33.69, lon: 73.05, kind: 'waypoint', label: 'left' },
      { name: 'Hunza', lat: 36.32, lon: 74.66, kind: 'destination', label: 'right' },
    ],
    roads: { main: [['Lahore', 'Islamabad', { lat: 34.93, lon: 72.87 }, 'Hunza']], valley: [] },
  });
  const point = (name: string) => drawing.stops.find((s) => s.name === name)!;

  it('draws each road through its stops and bends, from the first', () => {
    const [main] = drawing.roads.main;
    expect(main.startsWith(`M${point('Lahore').x} ${point('Lahore').y} L${point('Islamabad').x} ${point('Islamabad').y} L`)).toBe(true);
    expect(main.endsWith(`L${point('Hunza').x} ${point('Hunza').y}`)).toBe(true);
    expect(main.split(' L')).toHaveLength(4);
  });

  it('fits the bends in the frame too', () => {
    const xs = drawing.roads.main[0].match(/[ML](\d+(\.\d)?)/g)!.map((m) => Number(m.slice(1)));
    for (const x of xs) expect(x >= MAP_FRAME.padding && x <= MAP_FRAME.width - MAP_FRAME.padding).toBe(true);
  });
});
