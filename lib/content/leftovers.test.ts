import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findLeftovers, formatLeftovers, launchCheck, LEFTOVER_KINDS, type Leftover } from './leftovers.ts';
import { contentFixture } from './testing.ts';

/** Settings with every value real and the maps vetted: nothing left. */
const realSettings = {
  brand: { name: 'North Tours' },
  site: { url: 'https://example.pk' },
  contact: { phone: '+92 42 3578 1234', officeAddress: '12 Mall Road, Lahore, Punjab' },
  booking: { advancePercent: 30 },
  maps: { surveyOfPakistanVetted: true },
};

const photo = { src: '/images/hunza/attabad.jpg', alt: 'Attabad Lake', width: 2400, height: 1600, credit: { source: 'owner' } };

/** A content folder that's ready for launch, with `files` added or replacing its files. */
function leftovers(files: Record<string, unknown> = {}) {
  return findLeftovers(
    contentFixture({
      'settings.json': realSettings,
      'tours/hunza-express.json': { slug: 'hunza-express', title: 'Hunza Express', rating: { score: 4.7, count: 41 }, image: photo },
      'pages/home.json': { hero: { headline: 'Trips north from Lahore', image: photo } },
      ...files,
    }),
  );
}

/** Each leftover's kind, file in the fixture and field: "placeholder settings.json › contact.phone". */
const where = (found: Leftover[]) =>
  found.map(({ kind, file, field }) => `${kind} ${file.replace(/^.*content-[^/]+\//, '')}${field ? ` › ${field}` : ''}`);

describe('launch leftovers', () => {
  it('lists nothing for content that’s ready for launch', () => {
    expect(leftovers()).toEqual([]);
  });

  it('lists a placeholder brand name and site URL as their own kinds', () => {
    const found = leftovers({ 'settings.json': { ...realSettings, brand: { name: '[BRAND NAME]' }, site: { url: '[Site URL]' } } });
    expect(found).toEqual([
      expect.objectContaining({ kind: 'brand', field: 'brand.name', label: '[BRAND NAME]' }),
      expect.objectContaining({ kind: 'siteUrl', field: 'site.url', label: '[Site URL]' }),
    ]);
    expect(found[0].file).toMatch(/settings\.json$/);
  });

  it('lists a whole and a partial placeholder with their file and field', () => {
    const settings = { ...realSettings, contact: { phone: '[+92 42 XXXX XXXX]', officeAddress: '[Office address], Lahore, Punjab' } };
    const found = leftovers({ 'settings.json': settings });
    expect(where(found)).toEqual(['placeholder settings.json › contact.phone', 'placeholder settings.json › contact.officeAddress']);
    expect(found[1].label).toBe('[Office address], Lahore, Punjab');
  });

  it('lists a placeholder anywhere in content, not only in settings', () => {
    const found = leftovers({ 'pages/about.json': { memberships: [{ name: '[Tour operators’ association]' }] } });
    expect(where(found)).toEqual(['placeholder pages/about.json › memberships.0.name']);
  });

  it('lists sample content in page copy, in a nested object and on a tour’s rating, named where it can be', () => {
    const found = leftovers({
      'pages/help.json': { policies: { items: [{ title: 'Refunds', sample: true }] } },
      'tours/hunza-express.json': { slug: 'hunza-express', title: 'Hunza Express', rating: { score: 4.7, count: 41, sample: true }, image: photo, sample: true },
    });
    expect(where(found)).toEqual([
      'sample pages/help.json › policies.items.0',
      'sample tours/hunza-express.json',
      'sample tours/hunza-express.json › rating',
    ]);
    expect(found.map((f) => f.label)).toEqual(['Refunds', 'Hunza Express', undefined]);
  });

  it('lists a placeholder portrait by its shot, and not a real photo', () => {
    const found = leftovers({ 'guides/karim-baig.json': { name: 'Karim Baig', portrait: { placeholder: 'lead guide in Karimabad', alt: 'Karim Baig' } } });
    expect(where(found)).toEqual(['photo guides/karim-baig.json › portrait']);
    expect(found[0].label).toBe('lead guide in Karimabad');
  });

  it('lists the maps until the Survey of Pakistan has vetted them', () => {
    const found = leftovers({ 'settings.json': { ...realSettings, maps: { surveyOfPakistanVetted: false } } });
    expect(where(found)).toEqual(['mapVetting settings.json › maps.surveyOfPakistanVetted']);
  });

  it('doesn’t list text without brackets, sample: false or an input’s placeholder text', () => {
    const found = leftovers({
      'pages/planner.json': { name: { label: 'Name', placeholder: 'Your name' }, note: 'Pay [in cash] later', other: { sample: false } },
    });
    expect(where(found)).toEqual(['placeholder pages/planner.json › note']);
  });

  it('lists the kinds in order, whatever order the files come in', () => {
    const found = leftovers({
      'a.json': { portrait: { placeholder: 'the founder', alt: 'Founder' }, story: { sample: true }, phone: '[phone]' },
      'settings.json': { ...realSettings, brand: { name: '[BRAND NAME]' }, site: { url: '[Site URL]' }, maps: { surveyOfPakistanVetted: false } },
    });
    expect(found.map((f) => f.kind)).toEqual([...LEFTOVER_KINDS]);
  });

  it('checks content first: invalid content fails with its problems and nothing is walked', () => {
    const dir = contentFixture({ 'settings.json': { ...realSettings, brand: { name: '[BRAND NAME]' } } });
    const result = launchCheck(dir, mkdtempSync(path.join(tmpdir(), 'public-')));
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.problems).toContainEqual(expect.objectContaining({ file: expect.stringMatching(/settings\.json$/) }));
    expect(result.leftovers).toEqual([]);
  });

  it('lists every kind of leftover in the live content, which is valid', () => {
    const { problems, leftovers: live } = launchCheck();
    expect(problems).toEqual([]);
    expect(new Set(live.map((leftover) => leftover.kind))).toEqual(new Set(LEFTOVER_KINDS));
  });
});

describe('launch leftovers, as printed', () => {
  it('prints each kind’s heading with its count, one line per item, then the total', () => {
    const text = formatLeftovers([
      { kind: 'brand', file: 'content/settings.json', field: 'brand.name', label: '[BRAND NAME]' },
      { kind: 'sample', file: 'content/tours/hunza-express.json', label: 'Hunza Express' },
      { kind: 'sample', file: 'content/tours/hunza-express.json', field: 'rating' },
    ]);
    expect(text).toBe(
      [
        'Brand name: write the real name (1)\n  content/settings.json › brand.name: [BRAND NAME]',
        'Sample content: remove "sample": true once the item is real or reviewed (2)\n  content/tours/hunza-express.json: Hunza Express\n  content/tours/hunza-express.json › rating',
        '3 items left to replace before launch.',
      ].join('\n\n'),
    );
  });

  it('says so when nothing is left', () => {
    expect(formatLeftovers([])).toBe('Nothing left to replace.');
  });
});
