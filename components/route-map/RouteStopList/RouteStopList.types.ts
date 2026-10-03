import type { RouteMap } from '@/lib/content/routeMap';

export type RouteStopListProps = {
  list: RouteMap['list'];
  /** To mark the destinations among the listed stops. */
  stops: RouteMap['stops'];
};
