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
};
