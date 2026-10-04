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

  it('needs an overview headline, and 2 to 5 lines on who the trip suits and doesn’t', () => {
    expect(fields(load((t) => delete (t.overview as Partial<Tour['overview']>).headline))).toEqual(['overview.headline']);
    expect(fields(load((t) => t.overview.suitedTo.splice(1)))).toEqual(['overview.suitedTo']);
    expect(fields(load((t) => t.overview.notSuitedTo.push('a', 'b')))).toEqual(['overview.notSuitedTo']);
    expect(fields(load((t) => Object.assign(t.overview, { paragraphs: [] })))).toEqual(['overview.paragraphs']);
  });

  it('needs 3 to 6 highlights, each image with alt text', () => {
    expect(fields(load((t) => t.highlights.splice(2)))).toEqual(['highlights']);
    expect(fields(load((t) => Object.assign(t, { highlights: Array.from({ length: 7 }, () => t.highlights[0]) })))).toEqual(['highlights']);
    expect(fields(load((t) => Object.assign(t, { highlights: Array.from({ length: 6 }, () => t.highlights[0]) })))).toEqual([]);
    expect(fields(load((t) => Object.assign(t.highlights[0].image, { alt: '' })))).toEqual(['highlights.0.image.alt']);
  });

  describe('stays', () => {
    // The Grand's stays: nights 1, 2, 3–5, 6–7 and 8 of 8.
    it('accepts stays covering every night once', () => {
      expect(fields(load())).toEqual([]);
    });

    it('rejects a gap', () => {
      const result = load((t) => Object.assign(t.stays[1].nights, { from: 3, to: 3 }));
      expect(fields(result)).toContain('stays.1.nights.from');
      expect(result.problems.find((p) => p.field === 'stays.1.nights.from')!.message).toBe('Night 2 has no stay');
    });

    it('rejects an overlap', () => {
      const result = load((t) => Object.assign(t.stays[2].nights, { from: 2 }));
      expect(result.problems).toEqual([expect.objectContaining({ field: 'stays.2.nights.from', message: 'Night 2 is already covered' })]);
    });

    it('rejects nights beyond the tour’s, or nights left without a stay', () => {
      expect(fields(load((t) => Object.assign(t.stays[4].nights, { to: 9 })))).toEqual(['stays.4.nights.to']);
      expect(fields(load((t) => t.stays.pop()))).toEqual(['stays']);
    });

    it('needs alt text on a stay’s photo', () => {
      expect(fields(load((t) => Object.assign(t.stays[0].image, { alt: '' })))).toEqual(['stays.0.image.alt']);
    });
  });

  describe('itinerary', () => {
    it('needs exactly one day per day of the tour', () => {
      expect(fields(load((t) => t.itinerary.pop()))).toEqual(['itinerary']);
      expect(fields(load((t) => t.itinerary.push({ ...t.itinerary[0] })))).toEqual(['itinerary']);
    });

    it('rejects a day naming a stop that isn’t on the map', () => {
      const result = load((t) => t.itinerary[2].stops.push('Passu'));
      expect(result.problems).toEqual([expect.objectContaining({ field: 'itinerary.2.stops.3', message: 'No stop named "Passu"' })]);
    });

    it('rejects a stop listed twice, or a latitude out of range', () => {
      expect(fields(load((t) => t.stops.push({ ...t.stops[1] })))).toEqual(['stops.8.name']);
      expect(fields(load((t) => Object.assign(t.stops[1], { lat: 95 })))).toEqual(['stops.1.lat']);
    });

    it('starts the map at the trip’s start', () => {
      expect(fields(load((t) => t.stops.reverse()))).toEqual(['stops.0.name']);
    });
  });

  it('needs 2 to 4 of the tour’s own FAQs', () => {
    expect(fields(load((t) => t.faqs.splice(1)))).toEqual(['faqs']);
    expect(fields(load((t) => Object.assign(t, { faqs: Array.from({ length: 5 }, () => t.faqs[0]) })))).toEqual(['faqs']);
  });

  it('rejects an inclusion icon that isn’t one of the design’s nine', () => {
    expect(fields(load((t) => Object.assign(t.included[0], { icon: 'spa' })))).toEqual(['included.0.icon']);
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

  it('flags a sample tour and its rating only with true (ADR-0022)', () => {
    expect(fields(load((t) => Object.assign(t, { sample: true }, { rating: { ...t.rating, sample: true } })))).toEqual([]);
    expect(fields(load((t) => Object.assign(t, { sample: false })))).toEqual(['sample']);
    expect(fields(load((t) => Object.assign(t.rating, { sample: 'yes' })))).toEqual(['rating.sample']);
  });

  it('flags a sample destination only with true (ADR-0022)', () => {
    expect(fields(load((_, d) => Object.assign(d, { sample: true })))).toEqual([]);
    expect(fields(load((_, d) => Object.assign(d, { sample: false })))).toEqual(['sample']);
  });
});
