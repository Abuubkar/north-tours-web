import { sampleRouteMap } from '@/components/route-map/sampleRouteMap';
import type { OnTripPanelProps } from './OnTripPanel/OnTripPanel.types';

/* The on-trip panel's sample props for stories, which can't read content files (content/pages/contact.json). */

export const sampleOnTrip: OnTripPanelProps = {
  copy: {
    heading: 'On a trip right now?',
    line: 'Call your guide, or our travel support line.',
    guide: { label: 'Your guide', note: 'Number in your trip confirmation' },
    support: 'Travel support · 24/7',
    callLabel: 'Call travel support',
  },
  support: { value: '[24/7 number]', href: undefined },
  map: sampleRouteMap,
};
