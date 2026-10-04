import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR } from './files.ts';
import { loadGuides, type Guide } from './guides.ts';
import { contentFixture } from './testing.ts';

const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
const guide = read<Guide>('guides/karim-baig.json');

function loadGuide(change: (g: Guide) => void) {
  const copy = structuredClone(guide);
  change(copy);
  return loadGuides(contentFixture({ 'guides/karim-baig.json': copy }));
}

/** Fields with problems; also checks every problem names the file it came from. */
function fields(result: { problems: { file: string; field?: string }[] }) {
  for (const problem of result.problems) expect(problem.file).toMatch(/guides\/[a-z0-9-]+\.json$/);
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

describe('guide portraits', () => {
  it('rejects a stock photo of a person (ADR-0009)', () => {
    const result = loadGuide((g) => {
      g.portrait = {
        src: '/images/guides/stock.jpg',
        alt: 'A smiling guide',
        width: 800,
        height: 1000,
        credit: { source: 'unsplash', author: 'Someone', licence: 'Unsplash License', sourceUrl: 'https://unsplash.com/photos/x' },
      } as unknown as Guide['portrait'];
    });
    expect(fields(result)).toEqual(['portrait']);
  });

  it('accepts an owner-supplied photo', () => {
    const result = loadGuide((g) => {
      g.portrait = { src: '/images/guides/karim-baig.jpg', alt: 'Karim Baig, lead guide', width: 800, height: 1000, credit: { source: 'owner' } };
    });
    expect(result.problems).toEqual([]);
  });
});

describe('guide profiles', () => {
  it('needs a home valley and the places they lead', () => {
    expect(fields(loadGuide((g) => delete (g as Partial<Guide>).home))).toEqual(['home']);
    expect(fields(loadGuide((g) => delete (g as Partial<Guide>).leads))).toEqual(['leads']);
    expect(fields(loadGuide((g) => Object.assign(g, { leads: [] })))).toEqual(['leads']);
  });

  it('takes one to six places or routes', () => {
    expect(loadGuide((g) => Object.assign(g, { leads: ['A', 'B', 'C', 'D', 'E', 'F'] })).problems).toEqual([]);
    expect(fields(loadGuide((g) => Object.assign(g, { leads: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] })))).toEqual(['leads']);
  });

  it('takes an optional licence as written', () => {
    expect(loadGuide((g) => Object.assign(g, { licence: 'Guide licence GB-1234' })).problems).toEqual([]);
    expect(fields(loadGuide((g) => Object.assign(g, { licence: ' ' })))).toEqual(['licence']);
  });

  it('rejects a joining year after this year', () => {
    const result = loadGuide((g) => Object.assign(g, { joined: new Date().getFullYear() + 1 }));
    expect(fields(result)).toEqual(['joined']);
  });

  it('rejects a joining year before the company started (trust.operatingSince)', () => {
    const settings = JSON.parse(readFileSync(path.join(CONTENT_DIR, 'settings.json'), 'utf8'));
    const since = settings.trust.operatingSince;
    const load = (joined: number) =>
      loadGuides(contentFixture({ 'settings.json': settings, 'guides/karim-baig.json': { ...guide, joined } }));
    expect(load(since).problems).toEqual([]);
    const result = load(since - 1);
    expect(fields(result)).toEqual(['joined']);
    expect(result.problems[0].message).toBe(`Can’t be before the company started (${since})`);
  });

  it('checks the live guides against the live settings', () => {
    expect(loadGuides().problems).toEqual([]);
  });
});
