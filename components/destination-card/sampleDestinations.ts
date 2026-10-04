import { samplePhoto, samplePlaceholder } from '@/components/ui/MediaFrame/samplePhotos';
import type { Destination } from '@/lib/content/destinations';
import type { DestinationCardProps } from './DestinationCard/DestinationCard.types';

/* Sample destinations for stories, which can't read content files. */
export const sampleDestinations: DestinationCardProps['destination'][] = [
  { slug: 'hunza', name: 'Hunza', bestSeason: { from: 'Apr', to: 'Oct' }, image: samplePhoto },
  { slug: 'skardu', name: 'Skardu', bestSeason: { from: 'May', to: 'Oct' }, image: samplePhoto },
  { slug: 'naran-kaghan', name: 'Naran-Kaghan', bestSeason: { from: 'Jun', to: 'Sep' }, image: samplePhoto },
  { slug: 'swat', name: 'Swat', bestSeason: { from: 'Apr', to: 'Oct' }, image: samplePhoto },
  { slug: 'fairy-meadows', name: 'Fairy Meadows', bestSeason: { from: 'Jun', to: 'Sep' }, image: samplePhoto },
  {
    slug: 'murree',
    name: 'Murree',
    bestSeason: { from: 'May', to: 'Oct' },
    image: { ...samplePlaceholder, placeholder: 'Pine ridges of the Galiyat in mist', alt: 'Pine ridges in mist' },
  },
];

/* One destination in full, as its page reads it (content/destinations/hunza.json, shortened). */
export const sampleDestination: Destination = {
  slug: 'hunza',
  name: 'Hunza',
  region: 'Gilgit-Baltistan',
  description: 'A long, green valley under some of the highest mountains on earth.',
  lead: 'Forts, orchards and the Karakoram, three days up the highway from Lahore',
  bestSeason: { from: 'Apr', to: 'Oct' },
  altitude: 2438,
  fromLahore: '3 days by road',
  image: samplePhoto,
  overview: {
    headline: 'A green valley under the highest peaks',
    paragraphs: [
      'Hunza is a long, green valley under some of the highest mountains on earth. Terraced fields and apricot orchards climb towards Rakaposhi and Ultar.',
      'People come for the views and stay for the pace: short walks between orchards, chai facing the glaciers, and the turquoise of Attabad Lake.',
    ],
  },
  months: ['avoid', 'avoid', 'good', 'best', 'best', 'best', 'best', 'best', 'best', 'best', 'good', 'avoid'],
  seasons: [
    { season: 'spring', text: 'Apricot and cherry blossom from early April. Days 15–22°C.' },
    { season: 'summer', text: 'Warm days, 25–30°C, and the busiest months. Book four to six weeks ahead.' },
    { season: 'autumn', text: 'The poplars turn gold in late October. Days 10–20°C, cold nights.' },
    { season: 'winter', text: 'Snow on the Karakoram Highway, and many hotels close.' },
  ],
};

/* Murree, the sparse destination: good months inside its best season. */
export const sampleMurree: Destination = {
  ...sampleDestination,
  slug: 'murree',
  name: 'Murree',
  region: 'Punjab',
  bestSeason: { from: 'May', to: 'Oct' },
  overview: { headline: 'Cool air, a long weekend away', paragraphs: ['Pine ridges an hour above Islamabad, the closest escape from the summer heat.'] },
  months: ['avoid', 'good', 'good', 'good', 'best', 'best', 'good', 'good', 'best', 'best', 'good', 'good'],
  seasons: [
    { season: 'spring', text: 'Fresh green ridges, 15–22°C. Quieter on weekdays.' },
    { season: 'summer', text: 'An escape from the plains heat, 20–28°C. Monsoon rain in July and August.' },
    { season: 'autumn', text: 'Clear views to the hills, 12–22°C.' },
    { season: 'winter', text: 'Snow from December to February. Roads can close and traffic is heavy.' },
  ],
};
