import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getDestinations } from './catalog.ts';
import { destinationsSharePhoto, getDestinationsPage } from './destinationsPage.ts';
import { destinationsCopyFile, getHomeCopy, loadDestinationsCopy, type DestinationsCopy } from './pages.ts';
import { contentFixture } from './testing.ts';

const copy: DestinationsCopy = JSON.parse(readFileSync(destinationsCopyFile(), 'utf8'));

function fields(change: (copy: DestinationsCopy) => void) {
  const changed = structuredClone(copy);
  change(changed);
  const result = loadDestinationsCopy(contentFixture({ 'pages/destinations.json': changed }));
  for (const problem of result.problems) expect(problem.file).toMatch(/pages\/destinations\.json$/);
  return result.problems.map((p) => p.field);
}

describe('destinations page copy', () => {
  it('accepts the live copy', () => {
    expect(loadDestinationsCopy().problems).toEqual([]);
  });

  it('rejects a missing or empty field', () => {
    expect(fields((c) => delete (c as Partial<DestinationsCopy>).description)).toEqual(['description']);
    expect(fields((c) => delete (c.header as Partial<DestinationsCopy['header']>).lead)).toEqual(['header.lead']);
    expect(fields((c) => Object.assign(c.destinations, { seasonLabel: ' ' }))).toEqual(['destinations.seasonLabel']);
    expect(fields((c) => delete (c.banner as Partial<DestinationsCopy['banner']>).askLabel)).toEqual(['banner.askLabel']);
  });

  it('rejects a field it doesn’t know and a token', () => {
    expect(fields((c) => Object.assign(c.banner, { image: 'lake.jpg' }))).toEqual(['banner']);
    expect(fields((c) => Object.assign(c.header, { headline: '{destination} and more' }))).toEqual(['header.headline']);
  });

  it('fails a broken file', () => {
    const result = loadDestinationsCopy(contentFixture({ 'pages/destinations.json': '{ "title": ' }));
    expect(result.problems).toHaveLength(1);
    expect(result.problems[0].file).toMatch(/pages\/destinations\.json$/);
  });
});

describe('destinationsSharePhoto', () => {
  const home = getHomeCopy().hero.image;
  const [first, second] = getDestinations().map((d) => d.image);
  const placeholder = { placeholder: 'Hunza at dawn', alt: 'Hunza' };

  it('is the first destination’s photo', () => {
    expect(destinationsSharePhoto([{ image: first }, { image: second }], home)).toBe(first);
  });

  it('skips a destination still waiting for its photo, and falls back to the Homepage’s', () => {
    expect(destinationsSharePhoto([{ image: placeholder }, { image: second }], home)).toBe(second);
    expect(destinationsSharePhoto([{ image: placeholder }], home)).toBe(home);
  });
});

describe('getDestinationsPage', () => {
  it('has every destination in content order, picked down to what a card shows', () => {
    const { destinations } = getDestinationsPage();
    expect(destinations.map((d) => d.slug)).toEqual(getDestinations().map((d) => d.slug));
    expect(Object.keys(destinations[0]).sort()).toEqual(['bestSeason', 'image', 'name', 'slug']);
  });
});
