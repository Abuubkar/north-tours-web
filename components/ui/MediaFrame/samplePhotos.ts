import type { Image, Photo } from '@/lib/content/images';

/* Sample images for stories, which can't read content files. The photo's variants are in public/. */

export const samplePhoto: Photo = {
  src: '/images/hunza/rakaposhi-autumn.jpg',
  alt: 'Snow-covered Rakaposhi above the Hunza valley at sunset, with golden autumn poplars below',
  width: 2560,
  height: 1707,
  focus: { x: 47, y: 22 },
  credit: {
    source: 'wikimedia',
    author: 'Muhammad Ashar',
    licence: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_at_Rackaposhi_Peak.jpg',
  },
};

export const samplePlaceholder: Extract<Image, { placeholder: string }> = {
  placeholder: 'Lead guide, outdoors in Karimabad',
  alt: 'Karim Baig, lead guide',
};
