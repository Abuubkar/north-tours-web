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
};
