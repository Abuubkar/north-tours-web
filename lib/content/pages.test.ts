import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  creditsCopyFile,
  homeCopyFile,
  loadCreditsCopy,
  loadHomeCopy,
  loadTourCopy,
  loadToursCopy,
  tourCopyFile,
  toursCopyFile,
  type HomeCopy,
  type TourCopy,
  type ToursCopy,
} from './pages.ts';
import { contentFixture } from './testing.ts';

const home: HomeCopy = JSON.parse(readFileSync(homeCopyFile(), 'utf8'));

function withChange(change: (copy: HomeCopy) => void) {
  const copy = structuredClone(home);
  change(copy);
  return loadHomeCopy(contentFixture({ 'pages/home.json': copy }));
}

const fields = (result: ReturnType<typeof loadHomeCopy>) => result.problems.map((p) => p.field);

describe('home page copy', () => {
  it('accepts the live file', () => {
    expect(loadHomeCopy().problems).toEqual([]);
  });

  it('rejects a missing or empty field, naming the file', () => {
    const result = withChange((c) => delete (c.hero as Partial<HomeCopy['hero']>).lead);
    expect(fields(result)).toEqual(['hero.lead']);
    expect(result.problems[0].file).toMatch(/pages\/home\.json$/);
    expect(fields(withChange((c) => Object.assign(c.statement, { headline: ' ' })))).toEqual(['statement.headline']);
  });

  it('rejects a token the field does not take', () => {
    const result = withChange((c) => Object.assign(c.hero, { lead: 'Trips with a {advancePercent}% advance' }));
    expect(fields(result)).toEqual(['hero.lead']);
    expect(result.problems[0].message).toBe('Unknown token {advancePercent}. Takes no tokens');
  });

  it('needs a real photo for the hero, not a placeholder', () => {
    const result = withChange((c) => Object.assign(c.hero, { image: { placeholder: 'Hunza at dawn', alt: 'Hunza' } }));
    expect(fields(result)).toContain('hero.image.src');
  });
});

describe('booking steps', () => {
  it('needs exactly four steps', () => {
    expect(fields(withChange((c) => c.how.steps.pop()))).toEqual(['how.steps']);
    expect(fields(withChange((c) => c.how.steps.push({ ...c.how.steps[0] })))).toEqual(['how.steps']);
  });

  it('takes the settings tokens, and no others', () => {
    expect(withChange((c) => Object.assign(c.how.steps[0], { text: 'From {pickupPoint}, {advancePercent}%' })).problems).toEqual([]);
    const result = withChange((c) => Object.assign(c.how.steps[2], { text: 'Pay by {paymentMethod}.' }));
    expect(fields(result)).toEqual(['how.steps.2.text']);
    expect(result.problems[0].message).toBe(
      'Unknown token {paymentMethod}. Use only {advancePercent}, {paymentMethods}, {pickupPoint}, {fullRefundDays}, {childFromAge}',
    );
  });
});

describe('photo focus', () => {
  it('accepts a focus point in percent', () => {
    expect(withChange((c) => Object.assign(c.hero.image, { focus: { x: 0, y: 100 } })).problems).toEqual([]);
  });

  it.each([
    [{ x: -1, y: 50 }, 'hero.image.focus.x'],
    [{ x: 50, y: 101 }, 'hero.image.focus.y'],
  ])('rejects %o', (focus, field) => {
    expect(fields(withChange((c) => Object.assign(c.hero.image, { focus })))).toEqual([field]);
  });

  it('rejects a photo narrower than the smallest variant', () => {
    expect(fields(withChange((c) => Object.assign(c.hero.image, { width: 400 })))).toEqual(['hero.image.width']);
  });
});

describe('credits page copy', () => {
  it('accepts the live file', () => {
    expect(loadCreditsCopy().problems).toEqual([]);
  });

  it('rejects a missing headline', () => {
    const { headline, ...rest } = JSON.parse(readFileSync(creditsCopyFile(), 'utf8'));
    expect(headline).toBeTruthy();
    expect(loadCreditsCopy(contentFixture({ 'pages/credits.json': rest })).problems.map((p) => p.field)).toEqual(['headline']);
  });
});

describe('tour page copy', () => {
  const tour: TourCopy = JSON.parse(readFileSync(tourCopyFile(), 'utf8'));
  const withTourChange = (change: (copy: TourCopy) => void) => {
    const copy = structuredClone(tour);
    change(copy);
    return loadTourCopy(contentFixture({ 'pages/tour.json': copy }));
  };

  it('accepts the live file', () => {
    expect(loadTourCopy().problems).toEqual([]);
  });

  it('rejects a missing field, naming the file', () => {
    const result = withTourChange((c) => delete (c.facts as Partial<TourCopy['facts']>).nextDeparture);
    expect(result.problems.map((p) => p.field)).toEqual(['facts.nextDeparture']);
    expect(result.problems[0].file).toMatch(/pages\/tour\.json$/);
  });

  it('rejects a token the field does not take', () => {
    const result = withTourChange((c) => Object.assign(c, { title: '{tour}, {days} from Lahore' }));
    expect(result.problems.map((p) => p.field)).toEqual(['title']);
    expect(result.problems[0].message).toBe('Unknown token {days}. Use only {tour}, {duration}');
  });
});

describe('tours page copy', () => {
  const tours: ToursCopy = JSON.parse(readFileSync(toursCopyFile(), 'utf8'));
  const withToursChange = (change: (copy: ToursCopy) => void) => {
    const copy = structuredClone(tours);
    change(copy);
    return loadToursCopy(contentFixture({ 'pages/tours.json': copy }));
  };

  it('accepts the live file', () => {
    expect(loadToursCopy().problems).toEqual([]);
  });

  it('rejects a missing field, naming the file', () => {
    const result = withToursChange((c) => delete (c.header as Partial<ToursCopy['header']>).lead);
    expect(result.problems.map((p) => p.field)).toEqual(['header.lead']);
    expect(result.problems[0].file).toMatch(/pages\/tours\.json$/);
  });

  it('rejects a token the field does not take', () => {
    const result = withToursChange((c) => Object.assign(c.results, { sortedBy: 'Sorted by {order}' }));
    expect(result.problems.map((p) => p.field)).toEqual(['results.sortedBy']);
    expect(result.problems[0].message).toBe('Unknown token {order}. Use only {sort}');
  });
});
