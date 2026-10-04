import type { DestinationCopy } from '@/lib/content/pages';

/* The destination page's copy for stories, which can't read content files (content/pages/destination.json). */
export const sampleDestinationCopy: DestinationCopy = {
  title: '{destination} tours from Lahore',
  hero: { backLabel: 'All destinations' },
  facts: { bestSeason: 'Best season', altitude: 'Altitude', fromLahore: 'From Lahore', tours: 'Tours' },
  calendar: {
    headline: 'The best months to visit',
    legend: { best: 'Best', good: 'Good', avoid: 'Avoid · closed or not recommended' },
    levels: { best: 'Best', good: 'Good', avoid: 'Avoid' },
    seasons: {
      spring: { name: 'Spring', months: 'Mar – May' },
      summer: { name: 'Summer', months: 'Jun – Aug' },
      autumn: { name: 'Autumn', months: 'Sep – Nov' },
      winter: { name: 'Winter', months: 'Dec – Feb' },
    },
  },
};
