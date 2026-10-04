import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR } from './files.ts';
import { loadReviews, type Review } from './reviews.ts';
import { contentFixture } from './testing.ts';
import type { Tour } from './tours.ts';

const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
const review = read<Review>('reviews/hunza-2026-05-ayesha.json');
const grand = read<Tour>('tours/hunza-skardu-grand.json');

function loadReview(change: (r: Review) => void) {
  const copy = structuredClone(review);
  change(copy);
  return loadReviews(
    contentFixture({
      'reviews/hunza-2026-05-ayesha.json': copy,
      'tours/hunza-skardu-grand.json': grand,
    }),
  );
}

/** Fields with problems; also checks every problem names the file it came from. */
function fields(result: { problems: { file: string; field?: string }[] }) {
  for (const problem of result.problems) expect(problem.file).toMatch(/reviews\/[a-z0-9-]+\.json$/);
  return result.problems.map((p) => p.field);
}

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

  it('flags a sample review only with true (ADR-0022)', () => {
    expect(fields(loadReview((r) => Object.assign(r, { sample: true })))).toEqual([]);
    expect(fields(loadReview((r) => Object.assign(r, { sample: false })))).toEqual(['sample']);
  });
});
