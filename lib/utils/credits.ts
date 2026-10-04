import type { ContentImage, Photo } from '../content/images.ts';

/** A third-party photo to credit: what it shows, who took it, its licence and where it came from. */
export type PhotoCredit = Pick<Photo, 'src' | 'alt'> & Exclude<Photo['credit'], { source: 'owner' }>;

/**
 * Every third-party photo among `images`, once each, in the order given. Placeholders and the
 * owner's own photos aren't credited (ADR-0009).
 */
export function photoCredits(images: readonly ContentImage[]): PhotoCredit[] {
  const credits = new Map<string, PhotoCredit>();
  for (const image of images) {
    if (!('src' in image) || image.credit.source === 'owner' || credits.has(image.src)) continue;
    credits.set(image.src, { src: image.src, alt: image.alt, ...image.credit });
  }
  return [...credits.values()];
}

/** Where each source is, as named in the credits. */
export const SOURCE_NAMES: Record<PhotoCredit['source'], string> = {
  wikimedia: 'Wikimedia Commons',
  unsplash: 'Unsplash',
};

/**
 * The deed for a Creative Commons licence named like "CC BY-SA 4.0", or undefined for any
 * other licence (e.g. the Unsplash License, credited by name only).
 */
export function licenceUrl(licence: string): string | undefined {
  const match = /^CC (BY(?:-SA|-NC|-ND|-NC-SA|-NC-ND)?) (\d\.\d)$/.exec(licence);
  if (match) return `https://creativecommons.org/licenses/${match[1].toLowerCase()}/${match[2]}/`;
  if (licence === 'CC0 1.0') return 'https://creativecommons.org/publicdomain/zero/1.0/';
  return undefined;
}
