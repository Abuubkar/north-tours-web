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
  places: {
    headline: 'What to see in {destination}',
    kinds: { heritage: 'Heritage', viewpoint: 'Viewpoint', lake: 'Lake', adventure: 'Adventure', meadow: 'Meadow' },
    mapCaption: 'Schematic · positions approximate',
  },
  gettingThere: {
    headline: 'Getting there from Lahore by road',
    byRoad: 'By road',
    byAir: 'By air',
    arrive: 'Arrive',
    leg: '{time} by road to {stop}',
  },
  goodToKnow: { headline: 'Good to know before you go' },
  tours: {
    headline: 'Tours that visit {destination}',
    seeAll: 'See all {destination} trips',
    seeAllNote: 'Opens the Tours page, filtered to {destination}',
  },
  banner: {
    headline: '{destination}, on your own dates',
    lead: 'We plan private tours for families and teams, from 2 days to 2 weeks.',
    planLabel: 'Plan a private trip',
    askLabel: 'Ask on WhatsApp',
  },
};
