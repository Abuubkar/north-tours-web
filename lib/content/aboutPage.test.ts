import { describe, expect, it } from 'vitest';
import { getAboutPage } from './aboutPage.ts';
import { getSettings } from './settings.ts';

describe('about page', () => {
  it('fills the story headline’s {foundedYear} from the trust settings', () => {
    const { copy } = getAboutPage();
    expect(copy.story.headline).toBe(`Running trips north since ${getSettings().trust.operatingSince}`);
    expect(copy.story.headline).not.toContain('{');
  });

  it('shares the header’s photo', () => {
    const { copy, sharePhoto } = getAboutPage();
    expect(sharePhoto).toBe(copy.header.image);
  });
});
