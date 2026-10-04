import type { PlaceListProps } from '@/components/places-map/PlaceList/PlaceList.types';

export type PlacesToSeeProps = PlaceListProps & {
  /** "What to see in Hunza". */
  headline: string;
};
