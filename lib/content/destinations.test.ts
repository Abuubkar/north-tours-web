import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadDestinations, type Destination } from './destinations.ts';
import { CONTENT_DIR } from './files.ts';
import { contentFixture } from './testing.ts';

const hunza: Destination = JSON.parse(readFileSync(path.join(CONTENT_DIR, 'destinations/hunza.json'), 'utf8'));

/** Loads Hunza after `change`, and returns the fields with problems (each naming its file). */
function fields(change: (destination: Destination) => void) {
  const destination = structuredClone(hunza);
  change(destination);
  const result = loadDestinations(contentFixture({ 'destinations/hunza.json': destination }));
  for (const problem of result.problems) expect(problem.file).toMatch(/destinations\/hunza\.json$/);
  return result.problems.map((p) => p.field);
}

describe('destinations', () => {
  it('accepts the live content', () => {
    expect(loadDestinations().problems).toEqual([]);
  });

  it('needs the hero’s lead', () => {
    expect(fields((d) => delete (d as Partial<Destination>).lead)).toEqual(['lead']);
    expect(fields((d) => Object.assign(d, { lead: ' ' }))).toEqual(['lead']);
  });

  it('needs the altitude in whole metres, not below sea level', () => {
    expect(fields((d) => Object.assign(d, { altitude: 2438.5 }))).toEqual(['altitude']);
    expect(fields((d) => Object.assign(d, { altitude: -1 }))).toEqual(['altitude']);
    expect(fields((d) => Object.assign(d, { altitude: '2,438 m' }))).toEqual(['altitude']);
  });

  it('needs the time from Lahore', () => {
    expect(fields((d) => delete (d as Partial<Destination>).fromLahore)).toEqual(['fromLahore']);
  });

  it('keeps the description to 160 characters, the meta description', () => {
    expect(fields((d) => Object.assign(d, { description: 'a'.repeat(160) }))).toEqual([]);
    expect(fields((d) => Object.assign(d, { description: 'a'.repeat(161) }))).toEqual(['description']);
  });
});
