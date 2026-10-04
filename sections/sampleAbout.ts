import type { AboutCopy } from '@/lib/content/pages';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import type { ReviewWithTour } from './ReviewsSection/ReviewsSection.types';

/* Sample About copy for the section stories, which can't read content files. */
export const sampleAbout: AboutCopy = {
  title: 'About us, our guides and drivers',
  description: 'A small Lahore company with guides and drivers from Hunza, Skardu and Swat.',
  header: {
    headline: 'A Lahore company, with guides and drivers from the valleys we visit',
    lead: 'A small team in Lahore that plans every trip, and guides and drivers from the valleys we take you to.',
    image: samplePhoto,
  },
  story: {
    headline: 'Running trips north since {foundedYear}',
    paragraphs: [
      'We started with one hired coaster and a family from our own street in Lahore who wanted to see Hunza without worrying about the road.',
      'Within a few seasons, guides and drivers from Hunza, Skardu and Swat joined us.',
      'We still do the same things on every trip: we message each family the night before, and we never drive the mountain roads after dark.',
    ],
    founder: {
      name: 'Tariq Mehmood',
      role: 'Founder',
      portrait: { placeholder: 'Founder, at the office or on the road', alt: 'Tariq Mehmood, founder' },
    },
    sample: true,
  },
  principles: {
    headline: 'How we run every trip',
    items: [
      { title: 'Unhurried pace', text: 'We plan around the weather, the roads and your family.', sample: true },
      { title: 'Local guides', text: 'Our guides grew up in the valleys they show you.', sample: true },
      { title: 'Clear prices', text: 'What’s included is written down before you pay.', sample: true },
      { title: 'Safety first', text: 'Rested drivers, vehicles checked before every departure, and a first-aid kit on every trip.', sample: true },
    ],
  },
  guides: {
    headline: 'The full team of guides and drivers',
    intro: 'Tap anyone to see where they’re from, the languages they speak and the routes they lead.',
    viewProfile: 'View profile',
    profile: {
      rows: { home: 'Home valley', joined: 'With us', languages: 'Languages', leads: 'Leads', licence: 'Licence' },
      since: 'Since {year}',
      counter: '{index} of {total}',
      announcement: '{name}, {counter}',
      previous: 'Previous profile',
      next: 'Next profile',
      share: 'Share this profile on WhatsApp',
    },
  },
  vehicles: {
    headline: 'Our vehicles, and how we keep you safe',
    items: [
      {
        name: 'Toyota Coaster',
        summary: '22 seats · air-conditioned · group departures',
        image: {
          src: '/images/vehicles/toyota-coaster.jpg',
          alt: 'A white Toyota Coaster minibus, seen from the front',
          width: 1600,
          height: 1200,
          credit: {
            source: 'wikimedia',
            author: 'Captainmorlypogi1959',
            licence: 'CC BY-SA 4.0',
            sourceUrl: 'https://commons.wikimedia.org/wiki/File:Toyota_Coaster_2020.jpg',
          },
        },
        sample: true,
      },
      {
        name: '4x4 jeep',
        summary: '6 seats · for Deosai, Fairy Meadows and mountain tracks',
        image: {
          src: '/images/vehicles/fairy-meadows-jeep.jpg',
          alt: 'A green jeep on the narrow Fairy Meadows track, cut into a sheer cliff',
          width: 1200,
          height: 900,
          credit: {
            source: 'wikimedia',
            author: 'Shahbaz Aslam',
            licence: 'CC BY-SA 4.0',
            sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jeeps_track_of_fairy_meadows.jpg',
          },
        },
        sample: true,
      },
    ],
    fleetAge: { label: 'Average age of our fleet:', value: '4 years', sample: true },
    safety: {
      title: 'How we keep you safe',
      items: [
        'Every vehicle is checked before each departure',
        'Driver rest rules: set hours at the wheel, and no night driving on mountain roads',
        'A first-aid kit in every vehicle, and a first-aid trained guide on every trip',
        'When a landslide closes the road, we wait or take the safe way round, never a risky shortcut',
        'Where there’s no signal, check-in times agreed with our Lahore office before you set off',
      ],
      sample: true,
    },
  },
  numbers: {
    headline: 'The company in numbers',
    labels: { years: 'years running trips', trips: 'trips completed', travellers: 'travellers', guides: 'guides and drivers' },
    travellers: { value: '9,000+', sample: true },
  },
  credentials: {
    label: 'Credentials',
    licence: { label: 'Tour operator licence', value: 'DTS licence No. {dtsLicence}' },
    company: { label: 'Company' },
    memberships: { label: 'Memberships', items: [{ name: '[Tour operators’ association]', sample: true }] },
  },
  reviews: {
    headline: 'What travellers say about our guides and drivers',
    chosen: ['hunza-2026-05-faisal', 'hunza-2026-06-maryam', 'swat-2026-07-nadia'],
  },
  cta: { headline: 'Start planning your trip north', exploreLabel: 'Explore tours', planLabel: 'Plan a private trip' },
};

/** About's three chosen reviews, as the page shapes them (the content files' words). */
export const sampleAboutReviews: ReviewWithTour[] = [
  {
    review: {
      slug: 'hunza-2026-05-faisal',
      tour: 'hunza-skardu-grand',
      name: 'Faisal Ahmed & family',
      place: 'Lahore',
      month: '2026-05',
      rating: 5,
      quote: 'Our driver knew which bends worried my mother and slowed down before she had to ask. Nine days, and nothing for us to sort out.',
      consent: true,
    },
    tourTitle: 'Hunza & Skardu Grand',
  },
  {
    review: {
      slug: 'hunza-2026-06-maryam',
      tour: 'hunza-skardu-grand',
      name: 'Maryam Shah',
      place: 'Lahore',
      month: '2026-06',
      rating: 5,
      quote: 'Our guide in Skardu knew every lake by name and timed Deosai so we had it almost to ourselves.',
      consent: true,
    },
    tourTitle: 'Hunza & Skardu Grand',
  },
  {
    review: {
      slug: 'swat-2026-07-nadia',
      tour: 'swat-family-escape',
      name: 'Nadia Hussain',
      place: 'Islamabad',
      month: '2026-07',
      rating: 5,
      quote: 'The tour host messaged us before sunrise on the day we left, and kept checking in the whole way. My parents felt looked after.',
      consent: true,
    },
    tourTitle: 'Swat Family Escape',
  },
];
