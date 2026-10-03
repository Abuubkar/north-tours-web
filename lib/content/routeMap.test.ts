import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadRouteMap, routeMapFile, type RouteMap } from './routeMap.ts';
import { contentFixture } from './testing.ts';

const live: RouteMap = JSON.parse(readFileSync(routeMapFile(), 'utf8'));

function withChange(change: (map: RouteMap) => void) {
  const copy = structuredClone(live);
  change(copy);
  return loadRouteMap(contentFixture({ 'route-map.json': copy }));
}

const fields = (result: ReturnType<typeof loadRouteMap>) => result.problems.map((p) => p.field);

describe('route map', () => {
  it('accepts the live file', () => {
    expect(loadRouteMap().problems).toEqual([]);
  });

  it('rejects a stop without coordinates', () => {
    expect(fields(withChange((m) => delete (m.stops[1] as Partial<RouteMap['stops'][number]>).lat))).toEqual(['stops.1.lat']);
  });

  it('rejects a latitude out of range', () => {
    const result = withChange((m) => Object.assign(m.stops[0], { lat: 131.55 }));
    expect(fields(result)).toEqual(['stops.0.lat']);
    expect(result.problems[0].file).toMatch(/route-map\.json$/);
  });

  it('rejects a road naming a stop that does not exist', () => {
    const result = withChange((m) => m.roads.valley.push(['Islamabad', 'Chitral']));
    expect(result.problems).toEqual([expect.objectContaining({ field: 'roads.valley.4.1', message: 'No stop named "Chitral"' })]);
  });

  it('rejects a listed stop that does not exist', () => {
    expect(fields(withChange((m) => Object.assign(m.list.stops[2], { stop: 'Besham' })))).toEqual(['list.stops.2.stop']);
  });

  it('rejects two stops with the same name', () => {
    const result = withChange((m) => m.stops.push({ ...m.stops[3] }));
    expect(fields(result)).toEqual([`stops.${live.stops.length}.name`]);
  });
});
