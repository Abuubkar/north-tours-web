import { describe, expect, it } from 'vitest';
import type { Guide } from '../content/guides.ts';
import { guideProfile, guideShareMessage, profileCounter, profileRows, steppedIndex } from './guideProfile.ts';

const words = {
  rows: { home: 'Home valley', joined: 'With us', languages: 'Languages', leads: 'Leads', licence: 'Licence' },
  since: 'Since {year}',
};

const karim: Guide = {
  slug: 'karim-baig',
  name: 'Karim Baig',
  role: 'Lead guide',
  base: 'Hunza',
  languages: ['Burushaski', 'Urdu', 'English'],
  bio: 'Grew up in Karimabad.',
  home: 'Karimabad, Hunza',
  leads: ['Hunza', 'Nagar', 'Gilgit'],
  joined: 2016,
  portrait: { placeholder: 'lead guide, outdoors', alt: 'Karim Baig, lead guide' },
  consent: true,
};

const share = 'Meet {name}, our {role}: {url}';

describe('profileRows', () => {
  it('gives every row: home valley, the year joined, languages and leads joined with commas', () => {
    expect(profileRows(karim, words)).toEqual([
      { label: 'Home valley', value: 'Karimabad, Hunza' },
      { label: 'With us', value: 'Since 2016' },
      { label: 'Languages', value: 'Burushaski, Urdu, English' },
      { label: 'Leads', value: 'Hunza, Nagar, Gilgit' },
    ]);
  });

  it('adds the licence only when the owner has supplied one', () => {
    const rows = profileRows({ ...karim, licence: 'Guide licence GB-0412' }, words);
    expect(rows).toHaveLength(5);
    expect(rows.at(-1)).toEqual({ label: 'Licence', value: 'Guide licence GB-0412' });
  });
});

describe('guideShareMessage', () => {
  it('names the guide, their role in lower case and the profile’s address', () => {
    expect(guideShareMessage(share, karim, 'https://example.pk')).toBe(
      'Meet Karim Baig, our lead guide: https://example.pk/about#guide-karim-baig',
    );
    expect(guideShareMessage(share, karim, 'https://example.pk/')).toBe(
      'Meet Karim Baig, our lead guide: https://example.pk/about#guide-karim-baig',
    );
  });

  it('keeps a placeholder site address as written', () => {
    expect(guideShareMessage(share, { ...karim, role: 'Tour host' }, '[Site URL]')).toBe(
      'Meet Karim Baig, our tour host: [Site URL]/about#guide-karim-baig',
    );
  });
});

describe('guideProfile', () => {
  it('shapes the card and profile: rows, its address, and a share link with no number', () => {
    const profile = guideProfile(karim, words, share, '[Site URL]');
    expect(profile.path).toBe('/about#guide-karim-baig');
    expect(profile.rows).toHaveLength(4);
    expect(profile.shareHref).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(decodeURIComponent(profile.shareHref.split('text=')[1])).toBe('Meet Karim Baig, our lead guide: [Site URL]/about#guide-karim-baig');
    expect(profile).not.toHaveProperty('consent');
  });
});

describe('steppedIndex', () => {
  it('moves to the next and previous guide', () => {
    expect(steppedIndex(1, 1, 6)).toBe(2);
    expect(steppedIndex(2, -1, 6)).toBe(1);
  });

  it('wraps at both ends', () => {
    expect(steppedIndex(5, 1, 6)).toBe(0);
    expect(steppedIndex(0, -1, 6)).toBe(5);
  });
});

describe('profileCounter', () => {
  it('counts from one', () => {
    expect(profileCounter('{index} of {total}', 0, 6)).toBe('1 of 6');
    expect(profileCounter('{index} of {total}', 5, 6)).toBe('6 of 6');
  });
});
