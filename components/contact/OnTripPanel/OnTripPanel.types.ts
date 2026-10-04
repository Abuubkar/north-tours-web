import type { ContactValue } from '@/lib/utils/contact';

export type OnTripPanelProps = {
  /** "On a trip right now?" (the section's <h2>), the line under it and "Call travel support". */
  copy: { heading: string; line: string; callLabel: string };
  /** The travel support number, shown as written; "Call travel support" only once it's real (an href). */
  support: ContactValue;
};
