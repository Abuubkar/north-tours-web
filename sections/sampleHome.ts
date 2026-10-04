import type { HomeCopy } from '@/lib/content/pages';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';

/* Sample Homepage copy for the section stories, which can't read content files. */
export const sampleHome: HomeCopy = {
  title: 'Tours from Lahore to northern Pakistan',
  description: 'Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.',
  hero: {
    lead: 'Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.',
    exploreLabel: 'Explore Tours',
    whatsappLabel: 'Plan on WhatsApp',
    displayWord: 'NORTH',
    image: samplePhoto,
  },
  statement: {
    headline: 'Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway',
    body: 'Our guides grew up in Hunza, Skardu and Swat. Our drivers have spent decades on the Karakoram Highway. They plan around the weather, the roads and your family’s pace, so all you have to do is look out of the window.',
    linkLabel: 'Meet the team',
  },
  departures: {
    headline: 'Upcoming group departures',
    note: 'Prices per person, twin sharing. Every departure leaves from Lahore.',
    allToursLabel: 'All tours',
  },
  how: {
    headline: 'How booking works',
    steps: [
      { title: 'Choose your trip', text: 'Join a group departure, or ask for a private tour built around your own dates.' },
      { title: 'Pick a date', text: 'Every departure shows its seats left, so you always know where you stand.' },
      { title: 'Pay the advance', text: 'Hold your seats with a {advancePercent}% advance, paid by {paymentMethods}.' },
      { title: 'Depart from Lahore', text: 'Meet us at {pickupPoint} before dawn. Your driver and guide take it from there.' },
    ],
  },
  route: { headline: 'The road north, from Lahore to Hunza and Skardu' },
  reviews: { headline: 'Families come back, and next time they bring the cousins' },
};
