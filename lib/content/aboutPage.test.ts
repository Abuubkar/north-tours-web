import { describe, expect, it } from 'vitest';
import { getAboutPage } from './aboutPage.ts';
import { getGuides } from './guides.ts';
import { getSettings } from './settings.ts';

describe('about page', () => {
  it('fills the story headline’s {foundedYear} from the trust settings', () => {
    const { copy } = getAboutPage();
    expect(copy.story.headline).toBe(`Running trips north since ${getSettings().trust.operatingSince}`);
    expect(copy.story.headline).not.toContain('{');
  });

  it('shapes a profile for every guide, in the loader’s order, with no licence row in the sample content', () => {
    const { profiles } = getAboutPage();
    expect(profiles.map((p) => p.slug)).toEqual(getGuides().map((g) => g.slug));
    for (const profile of profiles) expect(profile.rows.map((r) => r.label)).toEqual(['Home valley', 'With us', 'Languages', 'Leads']);
  });

  it('fills the licence from settings, the placeholder as written', () => {
    const { copy } = getAboutPage();
    expect(copy.credentials.licence.value).toBe(`DTS licence No. ${getSettings().legal.dtsLicence}`);
  });

  it('counts the guides in content and takes years and trips from the trust settings', () => {
    const { stats } = getAboutPage();
    expect(stats[1].value).toBe(getSettings().trust.tripsCompleted);
    expect(stats[3].value).toBe(String(getGuides().length));
  });

  it('shares the header’s photo', () => {
    const { copy, sharePhoto } = getAboutPage();
    expect(sharePhoto).toBe(copy.header.image);
  });
});
