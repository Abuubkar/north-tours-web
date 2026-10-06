import { describe, expect, it } from 'vitest';
import { contentId, parseContentId, reservedPageNames } from './contentIds.ts';
import { contentMatcher, normalizeText } from './contentMatch.ts';
import { jsonStringAt, jsonStrings, replaceJsonString } from './jsonStrings.ts';

describe('content ids', () => {
  it('reads page copy as the page file and the keys inside it', () => {
    expect(parseContentId('home.hero.lead')).toEqual({ file: 'pages/home.json', path: ['hero', 'lead'] });
    expect(parseContentId('not-found.title')).toEqual({ file: 'pages/not-found.json', path: ['title'] });
  });

  it('reads list items as numbers', () => {
    expect(parseContentId('home.steps.items.2.title')).toEqual({ file: 'pages/home.json', path: ['steps', 'items', 2, 'title'] });
  });

  it('reads a collection item after the colon, and the reserved files by name', () => {
    expect(parseContentId('tour:hunza-express.days.0.title')).toEqual({ file: 'tours/hunza-express.json', path: ['days', 0, 'title'] });
    expect(parseContentId('review:hunza-2026-05-ayesha.quote')).toEqual({ file: 'reviews/hunza-2026-05-ayesha.json', path: ['quote'] });
    expect(parseContentId('settings.contact.phone')).toEqual({ file: 'settings.json', path: ['contact', 'phone'] });
    expect(parseContentId('route-map.title')).toEqual({ file: 'route-map.json', path: ['title'] });
  });

  it('refuses ids with no key, an empty key or an unknown collection', () => {
    expect(parseContentId('home')).toBeNull();
    expect(parseContentId('home..lead')).toBeNull();
    expect(parseContentId('ship:ark.name')).toBeNull();
    expect(parseContentId('tour:.title')).toBeNull();
  });

  it('refuses a file name that could reach another folder', () => {
    expect(parseContentId('tour:../../secrets.key')).toBeNull();
    expect(parseContentId('a/../../x.key')).toBeNull();
    expect(parseContentId('Home.title')).toBeNull();
  });

  it('writes the same ids back from a file and path', () => {
    for (const id of ['home.hero.lead', 'home.steps.items.2.title', 'tour:hunza-express.title', 'guide:karim-baig.bio', 'settings.contact.phone', 'faqs.items.0.answer']) {
      const location = parseContentId(id)!;
      expect(contentId(location.file, location.path)).toBe(id);
    }
    expect(contentId('images/notes.json', ['a'])).toBeNull();
  });

  it('names page files that would clash with a reserved file', () => {
    expect(reservedPageNames(['home', 'settings', 'faqs', 'tours'])).toEqual(['settings', 'faqs']);
  });
});

describe('json strings', () => {
  const text = '{\n  "title": "Tours",\n  "focus": { "x": 47, "y": 0 },\n  "items": [\n    { "name": "A \\"quoted\\" one" },\n    "Ñandú —"\n  ],\n  "on": true,\n  "none": null\n}\n';

  it('lists every string value with its path, not the keys', () => {
    expect(jsonStrings(text).map(({ path, value }) => [path.join('.'), value])).toEqual([
      ['title', 'Tours'],
      ['items.0.name', 'A "quoted" one'],
      ['items.1', 'Ñandú —'],
    ]);
  });

  it('changes only the one value, keeping the formatting', () => {
    const changed = replaceJsonString(text, ['items', 0, 'name'], 'New “name”\n');
    expect(changed).toBe(text.replace('"A \\"quoted\\" one"', '"New “name”\\n"'));
    expect(JSON.parse(changed).items[0].name).toBe('New “name”\n');
  });

  it('finds a string by path, and refuses a path with no string', () => {
    expect(jsonStringAt(text, ['title'])?.value).toBe('Tours');
    expect(() => replaceJsonString(text, ['focus', 'x'], '1')).toThrow('No string at focus.x');
  });

  it('throws on text that isn’t JSON', () => {
    expect(() => jsonStrings('{"a": }')).toThrow(SyntaxError);
  });
});

describe('content matching', () => {
  const match = contentMatcher([
    { id: 'home.hero.lead', value: 'Guided tours from Lahore.' },
    { id: 'tours.results.count', value: '{count} trips' },
    { id: 'tour.cta.label', value: 'Plan on WhatsApp' },
    { id: 'settings.whatsapp.label', value: 'Plan on WhatsApp' },
    { id: 'tour.name', value: '{name}' },
    { id: 'about.years', value: '{years} years' },
  ]);

  it('matches text exactly, ignoring runs of whitespace', () => {
    expect(match('  Guided tours\n   from Lahore. ')).toEqual({ kind: 'exact', ids: ['home.hero.lead'] });
    expect(normalizeText(' a \n b ')).toBe('a b');
  });

  it('lists every id when the same text is in several places', () => {
    expect(match('Plan on WhatsApp')).toEqual({ kind: 'exact', ids: ['tour.cta.label', 'settings.whatsapp.label'] });
  });

  it('matches a template with its tokens filled in, but not a template that is only a token', () => {
    expect(match('4 trips')).toEqual({ kind: 'template', ids: ['tours.results.count'] });
    expect(match('Anything at all')).toBeNull();
  });

  it('matches a token to a short value only, not to a sentence or a whole card', () => {
    expect(match('12 years')).toEqual({ kind: 'template', ids: ['about.years'] });
    expect(match('Karim has guided treks in Hunza and Shimshal for 12 years')).toBeNull();
    expect(match('Hunza ExpressFrom PKR 68,000 · 6 days · 4 trips')).toBeNull();
  });
});
