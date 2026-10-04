import type { TourCopy } from '@/lib/content/pages';

/* The tour page's copy for stories, which can't read content files (content/pages/tour.json). */

export const sampleTourCopy: TourCopy = {
  title: '{tour}, {duration} from Lahore',
  hero: { backLabel: 'All tours' },
  facts: {
    duration: 'Duration',
    rating: 'Rating',
    from: 'from',
    fromNote: 'per person, twin sharing',
    nextDeparture: 'Next departure',
  },
  quickFacts: {
    difficulty: 'Difficulty',
    groupSize: 'Group size',
    groupSizeValue: 'Up to {count} travellers',
    departsFrom: 'Departs from',
    bestSeason: 'Best season',
    transport: 'Transport',
  },
};
