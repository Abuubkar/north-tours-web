import { sitePath } from './basePath.ts';

/**
 * The owner's badge (2026-10-25), cut round with transparent corners: before the brand name in
 * the header, and the logo in the Homepage's structured data. 112px, square: twice the largest
 * size the header shows, and the smallest logo Google accepts.
 */
export const brandLogo = { src: sitePath('/brand/logo.png'), size: 112 } as const;
