import type { ReviewWithTour } from '@/sections/ReviewsSection/ReviewsSection.types';

/* Sample reviews for stories, which can't read content files. */
export const sampleReviews: ReviewWithTour[] = [
  {
    review: {
      slug: 'hunza-2026-05-ayesha',
      tour: 'hunza-skardu-grand',
      name: 'Ayesha Malik & family',
      place: 'Lahore',
      month: '2026-05',
      rating: 5,
      quote: 'Three nights in Hunza was the right call. Nothing felt rushed, and the kids still talk about the boat on Attabad.',
      consent: true,
    },
    tourTitle: 'Hunza & Skardu Grand',
  },
  {
    review: {
      slug: 'fairy-2026-06-zain',
      tour: 'fairy-meadows-trek',
      name: 'Zain Ahmed',
      place: 'Lahore',
      month: '2026-06',
      rating: 4,
      quote: 'We booked the whole trip on WhatsApp in one evening. The jeep to Fairy Meadows was waiting exactly when they said.',
      consent: true,
    },
    tourTitle: 'Fairy Meadows Trek',
  },
  {
    review: {
      slug: 'naran-2026-08-bilal',
      tour: 'naran-kaghan-getaway',
      name: 'Bilal Hussain, corporate team',
      place: 'Karachi',
      month: '2026-08',
      rating: 5,
      quote: 'Fourteen of us from the office. Rooms, meals, the stop at Babusar, all handled.',
      consent: true,
    },
    tourTitle: 'Naran-Kaghan Getaway',
  },
];
