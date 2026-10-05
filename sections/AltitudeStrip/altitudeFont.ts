import { Geist_Mono } from 'next/font/google';

/**
 * Geist Mono for the altitude strip (2f, ADR-0030), loaded only where the strip is (the Homepage).
 * `optional`: if it isn't there for the first paint the strip keeps the system monospace for that
 * visit, so its text never re-flows (CLS stays 0).
 */
export const altitudeFont = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'optional' });
