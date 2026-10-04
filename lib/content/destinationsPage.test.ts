import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getDestinations } from './catalog.ts';
import { getDestinationsPage } from './destinationsPage.ts';
import { destinationsCopyFile, loadDestinationsCopy, type DestinationsCopy } from './pages.ts';
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

describe('getDestinationsPage', () => {
  it('has every destination in content order, and shares the first one’s photo', () => {
    const page = getDestinationsPage();
    const destinations = getDestinations();
    expect(page.destinations.map((d) => d.slug)).toEqual(destinations.map((d) => d.slug));
    expect(page.sharePhoto).toBe(destinations[0].image);
  });
});
