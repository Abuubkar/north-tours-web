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

  stops: [
    {
      name: 'Lahore',
      lat: 31.55,
      lon: 74.34,
      label: 'right',
    },
    {
      name: 'Islamabad',
      lat: 33.69,
      lon: 73.05,
      label: 'left',
    },
    {
      name: 'Chilas',
      lat: 35.42,
      lon: 74.1,
      label: 'below',
    },
    {
      name: 'Gilgit',
      lat: 35.92,
      lon: 74.31,
      label: 'left',
    },
    {
      name: 'Hunza',
      lat: 36.32,
      lon: 74.66,
      label: 'left',
    },
    {
      name: 'Attabad',
      lat: 36.33,
      lon: 74.86,
      label: 'right',
    },
    {
      name: 'Skardu',
      lat: 35.3,
      lon: 75.63,
      label: 'right',
    },
    {
      name: 'Deosai',
      lat: 35.03,
      lon: 75.42,
      label: 'right',
    },
  ],
  itinerary: [
    {
      title: 'Lahore → Islamabad',
      text: 'Leave Lahore early and head north on the M-2 through the Salt Range. The evening in Islamabad is free.',
      stops: [
        'Lahore',
        'Islamabad',
      ],
      overnight: 'Islamabad',
      meals: 'Dinner',
      drive: '4–5 hrs',
    },
    {
      title: 'Islamabad → Chilas',
      text: 'Onto the Karakoram Highway past Abbottabad and Besham, then along the Indus into the mountains. A long day, with plenty of stops for tea.',
      stops: [
        'Islamabad',
        'Chilas',
      ],
      overnight: 'Chilas',
      meals: 'Breakfast, dinner',
      drive: '11–12 hrs',
    },
    {
      title: 'Chilas → Hunza',
      text: 'Stop at the Nanga Parbat viewpoint and the place where the Himalaya, Karakoram and Hindu Kush meet. Then on through Gilgit to Rakaposhi viewpoint and Karimabad.',
      stops: [
        'Chilas',
        'Gilgit',
        'Hunza',
      ],
      overnight: 'Karimabad, Hunza',
      meals: 'Breakfast, dinner',
      drive: '6–7 hrs',
    },
    {
      title: 'Hunza',
      text: 'Baltit and Altit forts in the morning and Karimabad bazaar after lunch, then sunset from Eagle’s Nest above the valley.',
      stops: [
        'Hunza',
      ],
      overnight: 'Karimabad, Hunza',
      meals: 'Breakfast, dinner',
      drive: '1–2 hrs',
    },
    {
      title: 'Upper Hunza',
      text: 'A boat on Attabad Lake, then the Passu Cones and the Hussaini suspension bridge for those who want to try it.',
      stops: [
        'Attabad',
      ],
      overnight: 'Karimabad, Hunza',
      meals: 'Breakfast, dinner',
      drive: '4–5 hrs',
    },
    {
      title: 'Hunza → Skardu',
      text: 'Back through Gilgit, then east on the Skardu Road, high above the Indus gorge.',
      stops: [
        'Hunza',
        'Gilgit',
        'Skardu',
      ],
      overnight: 'Skardu',
      meals: 'Breakfast, dinner',
      drive: '7–8 hrs',
    },
    {
      title: 'Deosai & Shangrila',
      text: 'Jeeps up to the Deosai plains and Sheosar Lake, then Shangrila and Upper Kachura on the way back down.',
      stops: [
        'Deosai',
      ],
      overnight: 'Skardu',
      meals: 'Breakfast, dinner',
      drive: '6–7 hrs incl. jeep',
    },
    {
      title: 'Skardu → Chilas or Naran',
      text: 'Back down the Skardu Road and the Karakoram Highway to Chilas, or over Babusar Top to Naran when the pass is open (usually June to September).',
      stops: [
        'Skardu',
        'Chilas',
      ],
      overnight: 'Chilas or Naran',
      meals: 'Breakfast, dinner',
      drive: '9–10 hrs',
    },
    {
      title: 'Chilas or Naran → Lahore',
      text: 'The final stretch to the motorway, arriving in Lahore in the late evening.',
      stops: [
        'Chilas',
        'Islamabad',
        'Lahore',
      ],
      overnight: 'Home',
      meals: 'Breakfast',
      drive: '12–14 hrs',
    },
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
