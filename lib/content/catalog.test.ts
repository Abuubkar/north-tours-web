import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { catalogAsOf, loadCatalog } from './catalog.ts';
import type { Destination } from './destinations.ts';
import { CONTENT_DIR } from './files.ts';
import { contentFixture } from './testing.ts';
import type { RoomPrices, Tour } from './tours.ts';

const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
const hunza = read<Destination>('destinations/hunza.json');
const skardu = read<Destination>('destinations/skardu.json');
const grand = read<Tour>('tours/hunza-skardu-grand.json');

/** Loads a fixture holding Hunza, Skardu and the Grand tour after `change`. */
function load(change: (tour: Tour, destination: Destination) => void = () => {}) {
  const tour = structuredClone(grand);
  const destination = structuredClone(hunza);
  change(tour, destination);
  return loadCatalog(
    contentFixture({
      'destinations/hunza.json': destination,
      'destinations/skardu.json': skardu,
      'tours/hunza-skardu-grand.json': tour,
    }),
  );
}

/** Fields with problems; also checks every problem names the file it came from. */
const fields = (result: ReturnType<typeof load>) => {
  for (const problem of result.problems) expect(problem.file).toMatch(/^.*content-[^/]+\/(tours|destinations)\/[a-z-]+\.json$/);
  return result.problems.map((p) => p.field);
};
const firstDeparture = (tour: Tour) => tour.departures[0];

describe('catalog: tours and destinations', () => {
  it('accepts the live content', () => {
    expect(loadCatalog().problems).toEqual([]);
  });

  it('accepts the fixture unchanged and sorts departures by date', () => {
    const result = load((tour) => tour.departures.reverse());
    expect(result.problems).toEqual([]);
    const starts = result.tours[0].departures.map((d) => d.start);
    expect(starts).toEqual([...starts].sort());
  });

  it('rejects more seats left than seats in total, or negative seats', () => {
    expect(fields(load((t) => Object.assign(firstDeparture(t), { seatsLeft: 17 })))).toEqual([
      'departures.0.seatsLeft',
    ]);
    expect(fields(load((t) => Object.assign(firstDeparture(t), { seatsLeft: -1 })))).toEqual([
      'departures.0.seatsLeft',
    ]);
  });

  it('rejects dates that are not real YYYY-MM-DD dates', () => {
    expect(fields(load((t) => Object.assign(firstDeparture(t), { start: '12/05/2027' })))).toContain(
      'departures.0.start',
    );
    expect(fields(load((t) => Object.assign(firstDeparture(t), { start: '2027-02-30' })))).toContain(
      'departures.0.start',
    );
  });

  it('rejects a departure ending before it starts', () => {
    expect(fields(load((t) => Object.assign(firstDeparture(t), { end: '2027-05-01' })))).toContain(
      'departures.0.end',
    );
  });

  it('rejects a departure whose length does not match the tour', () => {
    const result = load((t) => Object.assign(firstDeparture(t), { end: '2027-05-21' }));
    expect(result.problems).toEqual([
      expect.objectContaining({ field: 'departures.0.end', message: 'Lasts 10 days; the tour is 9' }),
    ]);
  });

  it('rejects two departures on the same date', () => {
    expect(fields(load((t) => t.departures.push({ ...firstDeparture(t) })))).toContain('departures.4.start');
  });

  it('rejects an image without alt text, as a photo or a placeholder', () => {
    expect(fields(load((t) => Object.assign(t.image, { alt: '' })))).toEqual(['image.alt']);
    expect(
      fields(
        load((t) => {
          t.image = { src: '/images/hunza/attabad.jpg', alt: '', width: 1600, height: 1200, credit: { source: 'owner' } };
        }),
      ),
    ).toEqual(['image.alt']);
  });

  it('accepts a real photo with a Wikimedia credit', () => {
    const result = load((t) => {
      t.image = {
        src: '/images/hunza/attabad.jpg',
        alt: 'Boats on Attabad Lake',
        width: 1600,
        height: 1200,
        credit: {
          source: 'wikimedia',
          author: 'Example Author',
          licence: 'CC BY-SA 4.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
        },
      };
    });
    expect(result.problems).toEqual([]);
  });

  it('rejects a slug that does not match its file name, naming the file', () => {
    const result = load((t) => Object.assign(t, { slug: 'hunza-grand' }));
    expect(result.problems).toEqual([
      expect.objectContaining({ field: 'slug', file: expect.stringMatching(/hunza-skardu-grand\.json$/) }),
    ]);
  });

  it('rejects a slug that is not lowercase words joined by hyphens', () => {
    expect(fields(load((t) => t.destinations.push('Hunza_Valley')))).toEqual(['destinations.2']);
  });

  it('rejects a tour pointing to a destination that does not exist', () => {
    const result = load((t) => t.destinations.push('chitral'));
    expect(result.problems).toEqual([
      expect.objectContaining({ field: 'destinations.2', message: expect.stringContaining('chitral') }),
    ]);
  });

  it('rejects an unknown region or month on a destination', () => {
    expect(fields(load((_, d) => Object.assign(d, { region: 'Sindh' })))).toEqual(['region']);
    expect(fields(load((_, d) => Object.assign(d.bestSeason, { from: 'April' })))).toEqual(['bestSeason.from']);
  });

  it('needs a twin, triple and quad price in whole rupees', () => {
    expect(fields(load((t) => delete (t.prices as Partial<RoomPrices>).quad))).toEqual(['prices.quad']);
    expect(fields(load((t) => Object.assign(t.prices, { triple: 135000.5 })))).toEqual(['prices.triple']);
  });

  it('rejects room prices out of order: sharing never costs more per person', () => {
    expect(fields(load((t) => Object.assign(t.prices, { quad: 136000 })))).toEqual(['prices.quad']);
    expect(fields(load((t) => Object.assign(t.prices, { triple: 150000 })))).toEqual(['prices.triple']);
    expect(fields(load((t) => Object.assign(t.prices, { triple: 145000, quad: 145000 })))).toEqual([]);
  });

  it('checks a departure’s own room prices the same way', () => {
    const eid = { twin: 160000, triple: 150000, quad: 140000 };
    expect(fields(load((t) => Object.assign(firstDeparture(t), { prices: eid })))).toEqual([]);
    expect(fields(load((t) => Object.assign(firstDeparture(t), { prices: { ...eid, quad: 155000 } })))).toEqual([
      'departures.0.prices.quad',
    ]);
    expect(fields(load((t) => Object.assign(firstDeparture(t), { prices: { twin: 160000 } })))).toEqual([
      'departures.0.prices.triple',
      'departures.0.prices.quad',
    ]);
  });

  it('rejects the old single prices (ADR-0017)', () => {
    const tourPrice = load((t) => Object.assign(t, { priceFrom: 145000 }));
    expect(fields(tourPrice)).toEqual(['']);
    expect(tourPrice.problems[0].message).toMatch(/"priceFrom"/);
    const departurePrice = load((t) => Object.assign(firstDeparture(t), { price: 150000 }));
    expect(fields(departurePrice)).toEqual(['departures.0']);
    expect(departurePrice.problems[0].message).toMatch(/"price"/);
  });

  it('needs a summary of at most 160 characters', () => {
    expect(fields(load((t) => delete (t as Partial<Tour>).summary))).toEqual(['summary']);
    expect(fields(load((t) => Object.assign(t, { summary: 'x'.repeat(160) })))).toEqual([]);
    expect(fields(load((t) => Object.assign(t, { summary: 'x'.repeat(161) })))).toEqual(['summary']);
  });

  it('rejects a tour’s best season with an unknown month', () => {
    expect(fields(load((t) => Object.assign(t.bestSeason, { to: 'October' })))).toEqual(['bestSeason.to']);
    expect(fields(load((t) => delete (t as Partial<Tour>).bestSeason))).toEqual(['bestSeason']);
  });

  it('reports every problem at once', () => {
    const result = load((t, d) => {
      Object.assign(firstDeparture(t), { seatsLeft: 99 });
      Object.assign(d, { region: 'Sindh' });
    });
    expect(result.problems).toHaveLength(2);
  });
});

describe('catalogAsOf', () => {
  const dates = (today: string) =>
    catalogAsOf(today).tours.find((t) => t.slug === 'hunza-skardu-grand')!.departures.map((d) => d.start);

  it('drops departures before the given day (Asia/Karachi) and keeps the rest', () => {
    expect(dates('2027-06-09')).toEqual(['2027-06-09', '2027-06-23']);
    expect(dates('2027-06-10')).toEqual(['2027-06-23']);
  });

  it('leaves a tour with no upcoming departures in the list, with none to show', () => {
    expect(dates('2027-12-31')).toEqual([]);
  });

  it('throws a ContentError when content is invalid', () => {
    const dir = contentFixture({
      'destinations/hunza.json': { ...hunza, region: 'Sindh' },
      'destinations/skardu.json': skardu,
      'tours/hunza-skardu-grand.json': grand,
    });
    expect(() => catalogAsOf('2027-01-01', dir)).toThrow(/destinations\/hunza\.json › region/);
  });
});
