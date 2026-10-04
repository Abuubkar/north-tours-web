import type { DestinationCopy } from '@/lib/content/pages';

/* The destination page's copy for stories, which can't read content files (content/pages/destination.json). */
export const sampleDestinationCopy: DestinationCopy = {
  title: '{destination} tours from Lahore',
  hero: { backLabel: 'All destinations' },
  facts: { bestSeason: 'Best season', altitude: 'Altitude', fromLahore: 'From Lahore', tours: 'Tours' },
};
