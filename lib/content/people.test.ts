import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR } from './files.ts';
import { loadGuides, type Guide } from './guides.ts';
import { loadReviews, type Review } from './reviews.ts';
import { contentFixture } from './testing.ts';
import type { Tour } from './tours.ts';

const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
const guide = read<Guide>('guides/karim-baig.json');
const review = read<Review>('reviews/grand-2026-05-ayesha.json');
const grand = read<Tour>('tours/hunza-skardu-grand.json');

function loadGuide(change: (g: Guide) => void) {
  const copy = structuredClone(guide);
  change(copy);
  return loadGuides(contentFixture({ 'guides/karim-baig.json': copy }));
}

function loadReview(change: (r: Review) => void) {
  const copy = structuredClone(review);
  change(copy);
  return loadReviews(
    contentFixture({
      'reviews/grand-2026-05-ayesha.json': copy,
      'tours/hunza-skardu-grand.json': grand,
    }),
  );
}

/** Fields with problems; also checks every problem names the file it came from. */
function fields(result: { problems: { file: string; field?: string }[] }) {
  for (const problem of result.problems) expect(problem.file).toMatch(/(guides|reviews)\/[a-z0-9-]+\.json$/);
  return result.problems.map((p) => p.field);
}

describe('guides', () => {
  it('accepts the live guides', () => {
    expect(loadGuides().problems).toEqual([]);
  });

  it('rejects a guide without consent, with a clear message', () => {
    const result = loadGuide((g) => Object.assign(g, { consent: false }));
    expect(fields(result)).toEqual(['consent']);
    expect(result.problems[0].message).toMatch(/agreed to be shown/);
    expect(fields(loadGuide((g) => delete (g as Partial<Guide>).consent))).toEqual(['consent']);
  });

  it('rejects an unknown role and a portrait without alt text', () => {
    expect(fields(loadGuide((g) => Object.assign(g, { role: 'Porter' })))).toEqual(['role']);
    expect(fields(loadGuide((g) => Object.assign(g.portrait, { alt: '' })))).toEqual(['portrait.alt']);
  });
});

describe('reviews', () => {
  it('accepts the live reviews', () => {
    expect(loadReviews().problems).toEqual([]);
  });

  it('rejects a review without consent', () => {
    expect(fields(loadReview((r) => Object.assign(r, { consent: false })))).toEqual(['consent']);
  });

  it('rejects a review for a tour that does not exist', () => {
    const result = loadReview((r) => Object.assign(r, { tour: 'chitral-explorer' }));
    expect(fields(result)).toEqual(['tour']);
    expect(result.problems[0].message).toContain('chitral-explorer');
  });

  it.each(['2026-5', '2026-13', 'May 2026'])('rejects the month %s', (month) => {
    expect(fields(loadReview((r) => Object.assign(r, { month })))).toEqual(['month']);
  });

  it.each([0, 6, 4.5])('rejects a rating of %s', (rating) => {
    expect(fields(loadReview((r) => Object.assign(r, { rating })))).toEqual(['rating']);
  });

  it('rejects a slug that does not match the file name', () => {
    expect(fields(loadReview((r) => Object.assign(r, { slug: 'another-review' })))).toEqual(['slug']);
  });
});
