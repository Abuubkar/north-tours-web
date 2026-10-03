import type { RouteMap } from '@/lib/content/routeMap';

export type RouteMapProps = {
  map: Pick<RouteMap, 'description' | 'caption' | 'startLabel' | 'legend' | 'stops' | 'roads'>;
};
