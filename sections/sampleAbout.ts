import type { AboutCopy } from '@/lib/content/pages';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';

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
        line: '22 seats · air-conditioned · group departures',
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
        line: '6 seats · for Deosai, Fairy Meadows and mountain tracks',
        image: {
          src: '/images/vehicles/4x4-jeep.jpg',
          alt: 'A red Toyota Land Cruiser 4x4 with a white roof',
          width: 1600,
          height: 1079,
          focus: { x: 55, y: 55 },
          credit: {
            source: 'wikimedia',
            author: 'Mr.choppers',
            licence: 'CC BY-SA 3.0',
            sourceUrl: 'https://commons.wikimedia.org/wiki/File:1982_Toyota_Land_Cruiser_FJ40_in_Freeborn_Red,_front_right.jpg',
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
};
