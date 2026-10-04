import type { Place } from '@/lib/content/destinations';
import type { Photo } from '@/lib/content/images';

/* Sample places for stories, which can't read content files (content/destinations). Their photos' variants are in public/. */

const photo = (src: string, alt: string, width: number, height: number): Photo => ({
  src,
  alt,
  width,
  height,
  credit: { source: 'wikimedia', author: 'Sample', licence: 'CC BY-SA 4.0', sourceUrl: 'https://commons.wikimedia.org/' },
});

/** Hunza's seven places, as designed. */
export const hunzaPlaces: Place[] = [
  {
    id: 'baltit-fort',
    name: 'Baltit Fort',
    kind: 'heritage',
    text: 'The centuries-old fort above Karimabad, restored and open to visitors.',
    lat: 36.3275,
    lon: 74.6696,
    image: photo('/images/hunza/baltit-fort.jpg', 'Whitewashed walls and carved red wooden balconies of Baltit Fort rise above a stone terrace under a deep blue sky.', 1600, 992),
  },
  {
    id: 'altit-fort',
    name: 'Altit Fort',
    kind: 'heritage',
    text: 'Older still, on a cliff above the river, with a royal garden below.',
    lat: 36.3168,
    lon: 74.6825,
    image: photo('/images/hunza/altit-fort.jpg', 'The stone tower of Altit Fort rises from a granite outcrop against a deep blue sky, beside poplar-covered mountain slopes.', 1600, 1068),
  },
  {
    id: 'eagles-nest',
    name: 'Eagle’s Nest',
    kind: 'viewpoint',
    text: 'Sunset over Rakaposhi, Ultar and Lady Finger from the ridge at Duikar.',
    lat: 36.3394,
    lon: 74.7005,
    image: photo('/images/hunza/eagles-nest-view.jpg', 'The green Hunza valley seen from the ridge at Eagle’s Nest, with poplars in front and snowy peaks along the skyline', 1280, 823),
  },
  {
    id: 'attabad-lake',
    name: 'Attabad Lake',
    kind: 'lake',
    text: 'Turquoise lake formed by the 2010 landslide; boats leave from the jetty.',
    lat: 36.326,
    lon: 74.85,
    image: photo('/images/hunza/attabad-gojal.jpg', 'Turquoise water of Attabad Lake filling the gorge below grey scree slopes and a blue sky', 1280, 925),
  },
  {
    id: 'passu-cones',
    name: 'Passu Cones',
    kind: 'viewpoint',
    text: 'Jagged spires above the highway in upper Hunza.',
    lat: 36.479,
    lon: 74.865,
    image: photo('/images/hunza/passu-cones.jpg', 'The jagged spires of the Passu Cones catch evening light under heavy clouds, with poplars on a dark hillside below.', 1600, 1068),
  },
  {
    id: 'hussaini-bridge',
    name: 'Hussaini Bridge',
    kind: 'adventure',
    text: 'A swaying suspension bridge over the Hunza River. Not for everyone.',
    lat: 36.421,
    lon: 74.883,
    image: photo('/images/hunza/hussaini-bridge.jpg', 'The empty Hussaini suspension bridge stretches over the grey Hunza River toward a sheer rock cliff and jagged peaks.', 1600, 1068),
  },
  {
    id: 'rakaposhi-viewpoint',
    name: 'Rakaposhi viewpoint',
    kind: 'viewpoint',
    text: 'A roadside tea stop facing one of the world’s great mountain faces.',
    lat: 36.213,
    lon: 74.433,
    image: photo('/images/hunza/rakaposhi-autumn.jpg', 'Snow-covered Rakaposhi above the Hunza valley at sunset, with golden autumn poplars below', 2560, 1707),
  },
];

/** Until photos are chosen, each place's photo is a placeholder naming the shot. */
export const placeholderPlaces: Place[] = hunzaPlaces.slice(0, 3).map((place) => ({
  ...place,
  image: { placeholder: `${place.name}, in good light`, alt: place.name },
}));
