import type { RouteMap } from '@/lib/content/routeMap';

export type RouteMapProps = {
  map: Pick<RouteMap, 'description' | 'caption' | 'startLabel' | 'legend' | 'stops' | 'roads'>;
  /** Decoration beside other words (Contact's on-trip panel): hidden from screen readers, with no legend. */
  decorative?: boolean;
};
