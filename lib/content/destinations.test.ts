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

describe('destination overview', () => {
  it('needs a headline and one or two paragraphs', () => {
    expect(fields((d) => delete (d.overview as Partial<Destination['overview']>).headline)).toEqual(['overview.headline']);
    expect(fields((d) => d.overview.paragraphs.splice(0))).toEqual(['overview.paragraphs']);
    expect(fields((d) => d.overview.paragraphs.push('A third paragraph.'))).toEqual(['overview.paragraphs']);
  });
});

describe('season calendar', () => {
  it('needs all twelve months, each best, good or avoid', () => {
    expect(fields((d) => d.months.pop())).toEqual(['months']);
    expect(fields((d) => Object.assign(d.months, { 2: 'shoulder' }))).toEqual(['months.2']);
  });

  it('must agree with the best season: its ends best, nothing best outside it', () => {
    expect(fields((d) => Object.assign(d.months, { 10: 'best' }))).toEqual(['months.10']);
    expect(fields((d) => Object.assign(d.months, { 3: 'good' }))).toEqual(['months.3']);
    expect(fields((d) => Object.assign(d, { bestSeason: { from: 'May', to: 'Oct' } }))).toEqual(['months.3']);
  });

  it('needs the four seasons, spring to winter, in order', () => {
    expect(fields((d) => d.seasons.pop())).toEqual(['seasons']);
    expect(fields((d) => d.seasons.reverse())).toEqual(['seasons.0.season', 'seasons.1.season', 'seasons.2.season', 'seasons.3.season']);
    expect(fields((d) => Object.assign(d.seasons[0], { season: 'monsoon' }))).toEqual(['seasons.0.season']);
  });
});

describe('places to see', () => {
  const place = (d: Destination) => d.places![0];

  it('takes 1 to 8 places, or none at all', () => {
    expect(fields((d) => delete d.places)).toEqual([]);
    expect(fields((d) => Object.assign(d, { places: [] }))).toEqual(['places']);
    expect(fields((d) => d.places!.push({ ...place(d), id: 'eighth' }))).toEqual([]);
    expect(fields((d) => d.places!.push({ ...place(d), id: 'eighth' }, { ...place(d), id: 'ninth' }))).toEqual(['places']);
  });

  it('needs each place’s id once', () => {
    expect(fields((d) => Object.assign(d.places![1], { id: place(d).id }))).toEqual(['places.1.id']);
  });

  it('takes the five kinds only', () => {
    expect(fields((d) => Object.assign(place(d), { kind: 'museum' }))).toEqual(['places.0.kind']);
  });

  it('needs coordinates in range', () => {
    expect(fields((d) => Object.assign(place(d), { lat: 91 }))).toEqual(['places.0.lat']);
    expect(fields((d) => Object.assign(place(d), { lon: -181 }))).toEqual(['places.0.lon']);
  });

  it('needs alt text on every place photo', () => {
    expect(fields((d) => Object.assign(place(d).image, { alt: '' }))).toEqual(['places.0.image.alt']);
  });
});

describe('map labels', () => {
  it('are optional, and need coordinates in range', () => {
    expect(fields((d) => delete d.mapLabels)).toEqual([]);
    expect(fields((d) => Object.assign(d.mapLabels![0], { lat: -91 }))).toEqual(['mapLabels.0.lat']);
    expect(fields((d) => Object.assign(d.mapLabels![0], { lon: 181 }))).toEqual(['mapLabels.0.lon']);
  });
});

describe('getting there', () => {
  const stops = (d: Destination) => d.gettingThere.stops;

  it('starts the road at Lahore', () => {
    expect(fields((d) => Object.assign(stops(d)[0], { name: 'Islamabad' }))).toEqual(['gettingThere.stops.0.name']);
  });

  it('needs at least two stops', () => {
    expect(fields((d) => Object.assign(d.gettingThere, { stops: [{ name: 'Lahore' }] }))).toEqual(['gettingThere.stops']);
  });

  it('needs a drive time on every stop but the last, and none on the last', () => {
    expect(fields((d) => delete stops(d)[1].drive)).toEqual(['gettingThere.stops.1.drive']);
    expect(fields((d) => Object.assign(stops(d).at(-1)!, { drive: '1 hr' }))).toEqual(['gettingThere.stops.4.drive']);
  });

  it('needs the "By road" and "By air" notes', () => {
    expect(fields((d) => delete (d.gettingThere as Partial<Destination['gettingThere']>).byAir)).toEqual(['gettingThere.byAir']);
  });
});

describe('good to know', () => {
  it('takes up to 6 notes, or none at all (empty or left out)', () => {
    expect(fields((d) => delete d.notes)).toEqual([]);
    expect(fields((d) => Object.assign(d, { notes: [] }))).toEqual([]);
    expect(fields((d) => d.notes!.push({ title: 'One more', text: 'A seventh note.' }))).toEqual(['notes']);
  });
});
