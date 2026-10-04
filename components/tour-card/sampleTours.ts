import { samplePhoto, samplePlaceholder } from '@/components/ui/MediaFrame/samplePhotos';
import type { Departure, Tour } from '@/lib/content/tours';

/* Sample tours for stories, which can't read content files. */

export const sampleTour: Tour = {
  slug: 'hunza-skardu-grand',
  title: 'Hunza & Skardu Grand',
  summary: 'Nine days by road from Lahore up the Karakoram Highway: three nights in Hunza, then Skardu, its lakes and the Deosai plains.',
  route: ['Lahore', 'Hunza', 'Skardu'],
  destinations: ['hunza', 'skardu'],
  tripTypes: ['family'],
  days: 9,
  nights: 8,
  prices: { twin: 145000, triple: 135000, quad: 127000 },
  difficulty: 'Easy walking, long road days',
  transport: 'Coaster, with jeeps for Deosai',
  bestSeason: { from: 'Apr', to: 'Oct' },
  rating: { score: 4.9, count: 128 },
  image: samplePhoto,
  departures: [],
  overview: {
    headline: 'Nine days up the Karakoram Highway to Hunza and Skardu',
    paragraphs: [
      'We drive up from Lahore on the motorway and the Karakoram Highway. Then we spend three nights in Hunza under Rakaposhi, and cross to Skardu for its lakes and the high Deosai plains.',
      'This is a road trip at heart. Your driver and guide set the pace, plan around the weather and know where to stop for chai.',
    ],
    suitedTo: [
      'First-time visitors who want Hunza and Skardu in one trip',
      'Couples and friends who would rather not drive the Karakoram Highway themselves',
    ],
    notSuitedTo: [
      'Travellers who dislike long road journeys',
      'Anyone after a real trek (see the Fairy Meadows Trek)',
    ],
  },
  highlights: [
    { title: 'Rakaposhi viewpoint', text: 'A huge mountain face, seen from your tea stop', image: samplePhoto },
    { title: 'Attabad Lake', text: 'A turquoise lake formed by the 2010 landslide', image: { ...samplePlaceholder, placeholder: 'Attabad Lake from the boat jetty', alt: 'Attabad Lake' } },
    { title: 'Baltit Fort', text: 'The centuries-old fort above Karimabad', image: { ...samplePlaceholder, placeholder: 'Baltit Fort above Karimabad', alt: 'Baltit Fort' } },
  ],
  included: [
    { icon: 'hotel', title: 'Hotels', text: '8 nights in 3-star hotels, twin sharing' },
    { icon: 'meals', title: 'Breakfast and dinner', text: 'Day 1 dinner to Day 9 breakfast' },
    { icon: 'transport', title: 'Transport', text: 'Air-conditioned coaster from Lahore and back' },
    { icon: 'guide', title: 'Guide', text: 'Tour guide throughout the trip' },
    { icon: 'jeep', title: 'Jeeps', text: 'Jeeps to Deosai and Shangrila' },
  ],
  notIncluded: [
    { icon: 'lunch', title: 'Lunch', text: 'We stop at good places; you pay as you go' },
    { icon: 'personal', title: 'Personal expenses', text: 'Snacks, shopping, laundry, tips' },
    { icon: 'tickets', title: 'Entry tickets', text: 'Baltit and Altit forts, Attabad boating' },
    { icon: 'flights', title: 'Flights', text: 'An optional flight home from Skardu to Islamabad' },
  ],
  stays: [
    { nights: { from: 1, to: 2 }, place: 'Chilas', title: 'Hotel in Chilas', description: 'Simple, clean rooms by the Indus', image: { ...samplePlaceholder, placeholder: 'The Indus valley near Chilas', alt: 'The Indus near Chilas' } },
    { nights: { from: 3, to: 5 }, place: 'Hunza', title: 'Hotel in Karimabad', description: '3-star · valley view', image: samplePhoto },
    { nights: { from: 6, to: 8 }, place: 'Skardu', title: 'Hotel in Skardu', description: '3-star · garden', image: { ...samplePlaceholder, placeholder: 'Skardu town by the Indus', alt: 'Skardu by the Indus' } },
  ],
};

export const openDeparture: Departure = { start: '2027-05-26', end: '2027-06-03', seatsTotal: 16, seatsLeft: 9 };
export const urgentDeparture: Departure = { start: '2027-05-12', end: '2027-05-20', seatsTotal: 16, seatsLeft: 3 };
export const soldOutDeparture: Departure = { start: '2027-06-09', end: '2027-06-17', seatsTotal: 16, seatsLeft: 0 };

/** A departure from `start` to `end` with `seatsLeft` of 16 seats, for stories. */
export function departureOn(start: string, end: string, seatsLeft: number): Departure {
  return { start, end, seatsTotal: 16, seatsLeft };
}

/** A tour named `title` with the given departures (start dates and seats left). */
export function tourWith(title: string, departures: [start: string, seatsLeft: number][]): Tour {
  const slug = title.toLowerCase().replace(/[^a-z]+/g, '-');
  return {
    ...sampleTour,
    slug,
    title,
    days: 1,
    nights: 0,
    departures: departures.map(([start, seatsLeft]) => ({ start, end: start, seatsTotal: 16, seatsLeft })),
  };
}
