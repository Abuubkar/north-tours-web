import type { Ref } from 'react';
import type { HomeCopy } from '@/lib/content/pages';
import type { AltitudePlace } from '@/lib/utils/altitudeStrip';

export type AltitudeStripProps = {
  /** From `altitudePlaces(getDestinations())`; with none, there's no strip. */
  places: AltitudePlace[];
  /** The Homepage copy's `altitudes`: the strip's name and the pause button's name. */
  copy: HomeCopy['altitudes'];
};

export type AltitudeListProps = {
  places: AltitudePlace[];
  /** The loop's second drawing: hidden from screen readers and out of the tab order. */
  duplicate?: boolean;
  /** The first drawing, measured for the loop's width. */
  ref?: Ref<HTMLUListElement>;
};
