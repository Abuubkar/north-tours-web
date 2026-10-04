import type { Settings } from '@/lib/content/settings';

export type TrustStripProps = {
  /**
   * full: the four-fact strip (Homepage, Tours, Help, Contact). mini: three facts inside Tour
   * Detail's final call to action (licence, pickup point, payments).
   */
  variant?: 'full' | 'mini';
  settings: Pick<Settings, 'legal' | 'payments' | 'trust' | 'booking'>;
  /** The year the page is built; "Operating" counts years up to it. */
  year: number;
};
