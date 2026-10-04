import type { Destination, Place } from '@/lib/content/destinations';
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

/** Hunza's names for context: Karimabad on the map, Gilgit and Khunjerab beyond it. */
export const hunzaMapLabels: NonNullable<Destination['mapLabels']> = [
  { name: 'Karimabad', lat: 36.3247, lon: 74.6634 },
  { name: 'Gilgit', lat: 35.9208, lon: 74.3089 },
  { name: 'Khunjerab', lat: 36.85, lon: 75.42 },
];

/** Fairy Meadows' four places: close together, so the map draws a smaller area. */
export const fairyMeadowsPlaces: Place[] = [
  {
    id: 'raikot-jeep-track',
    name: 'Raikot jeep track',
    kind: 'adventure',
    text: 'The narrow track from Raikot Bridge to Tato, an hour by jeep along the gorge.',
    lat: 35.44,
    lon: 74.56,
    image: photo('/images/fairy-meadows/raikot-road.jpg', 'A narrow jeep track built on dry-stone walls clings to a barren mountainside on the route between Raikot and Fairy Meadows.', 1600, 867),
  },
  {
    id: 'fairy-meadows',
    name: 'Fairy Meadows',
    kind: 'meadow',
    text: 'The grassy clearing in the pines, facing the north face of Nanga Parbat.',
    lat: 35.388,
    lon: 74.58,
    image: photo('/images/fairy-meadows/fairy-meadows.jpg', 'Wooden huts dot the green meadow and pine forest of Fairy Meadows, with a stream in front and cloud-wrapped Nanga Parbat behind.', 1600, 1067),
  },
  {
    id: 'raikot-glacier',
    name: 'Raikot Glacier',
    kind: 'viewpoint',
    text: 'The great glacier below Nanga Parbat, seen from the trail beyond the meadow.',
    lat: 35.378,
    lon: 74.62,
    image: photo('/images/fairy-meadows/raikot-glacier.jpg', 'The grey Raikot Glacier running down between pine forests, with snowy peaks behind', 1280, 853),
  },
  {
    id: 'beyal-camp',
    name: 'Beyal Camp',
    kind: 'meadow',
    text: 'A cluster of huts an hour’s walk on, the start of the base camp trail.',
    lat: 35.36,
    lon: 74.61,
    image: photo('/images/fairy-meadows/beyal-camp.jpg', 'Wooden huts of Beyal Camp stand beside a rushing stream, with snowy peaks and green slopes under a blue sky.', 1600, 1068),
  },
];

export const fairyMeadowsMapLabels: NonNullable<Destination['mapLabels']> = [
  { name: 'Raikot Bridge', lat: 35.495, lon: 74.593 },
  { name: 'Nanga Parbat', lat: 35.2375, lon: 74.5891 },
];

/** Until photos are chosen, each place's photo is a placeholder naming the shot. */
export const placeholderPlaces: Place[] = hunzaPlaces.slice(0, 3).map((place) => ({
  ...place,
  image: { placeholder: `${place.name}, in good light`, alt: place.name },
}));
