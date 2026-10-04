import type { RouteMapProps } from '@/components/route-map/RouteMap/RouteMap.types';
import type { ContactCopy } from '@/lib/content/pages';
import type { ContactValue } from '@/lib/utils/contact';

export type OnTripPanelProps = {
  /** "On a trip right now?" (the section's <h2>), the line under it, the two rows and "Call travel support". */
  copy: ContactCopy['onTrip'];
  /** The travel support number, shown as written; "Call travel support" only once it's real (an href). */
  support: ContactValue;
  /** The road north (content/route-map.json), drawn beside the words as decoration. */
  map: RouteMapProps['map'];
};
