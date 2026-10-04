import type { Guide } from '../content/guides.ts';
import { routes } from '../routes.ts';
import { fillTokens } from './tokens.ts';
import { whatsappShareLink } from './whatsapp.ts';

/** From this width the profile opens in the side drawer; below it, the bottom sheet. */
export const PROFILE_DRAWER_QUERY = '(width >= 820px)';

/*
 * A guide's profile on the About page (PRD #78): its rows, the share link, and moving through
 * the team in grid order. The page shapes each profile at build time; the profile sheet steps
 * through them in the browser.
 */

/** The profile's words: each row's label, and "Since {year}". */
export type ProfileWords = {
  rows: { home: string; joined: string; languages: string; leads: string; licence: string };
  /** "With us": "Since {year}". */
  since: string;
};

export type ProfileRow = { label: string; value: string };

/**
 * The label and value rows under a guide's bio: Home valley, With us ("Since 2016"), Languages and
 * Leads joined with commas, then Licence only when the owner has supplied one.
 */
export function profileRows(
  guide: Pick<Guide, 'home' | 'joined' | 'languages' | 'leads' | 'licence'>,
  words: ProfileWords,
): ProfileRow[] {
  const { rows } = words;
  return [
    { label: rows.home, value: guide.home },
    { label: rows.joined, value: fillTokens(words.since, { year: String(guide.joined) }) },
    { label: rows.languages, value: guide.languages.join(', ') },
    { label: rows.leads, value: guide.leads.join(', ') },
    ...(guide.licence ? [{ label: rows.licence, value: guide.licence }] : []),
  ];
}

/**
 * "Meet Karim Baig, our lead guide: https://example.pk/about#guide-karim-baig", from the settings
 * template. The address is the site's plus the guide's anchor; while the site's is a
 * `[placeholder]`, it shows as written.
 */
export function guideShareMessage(template: string, guide: Pick<Guide, 'slug' | 'name' | 'role'>, siteUrl: string): string {
  const url = `${siteUrl.replace(/\/+$/, '')}${routes.guide(guide.slug)}`;
  return fillTokens(template, { name: guide.name, role: guide.role.toLowerCase(), url });
}

/** Everything a guide's card and profile show, shaped at build time. */
export type GuideProfile = Pick<Guide, 'slug' | 'name' | 'role' | 'base' | 'portrait' | 'bio'> & {
  rows: ProfileRow[];
  /** "Share this profile on WhatsApp": wa.me with the message and no number. */
  shareHref: string;
  /** The profile's own address, "/about#guide-karim-baig". */
  path: string;
};

export function guideProfile(guide: Guide, words: ProfileWords, shareTemplate: string, siteUrl: string): GuideProfile {
  const { slug, name, role, base, portrait, bio } = guide;
  return {
    slug,
    name,
    role,
    base,
    portrait,
    bio,
    rows: profileRows(guide, words),
    shareHref: whatsappShareLink(guideShareMessage(shareTemplate, guide, siteUrl)),
    path: routes.guide(slug),
  };
}

/** The guide one step along from `index` in grid order (+1 next, −1 previous), wrapping at both ends. */
export function steppedIndex(index: number, step: 1 | -1, total: number): number {
  return (index + step + total) % total;
}

/** "2 of 6": where a guide sits in the team, from a "{index} of {total}" template; `index` counts from 0. */
export function profileCounter(template: string, index: number, total: number): string {
  return fillTokens(template, { index: String(index + 1), total: String(total) });
}
