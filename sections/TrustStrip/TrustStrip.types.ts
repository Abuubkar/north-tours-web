import type { Settings } from '@/lib/content/settings';

export type TrustStripProps = {
  settings: Pick<Settings, 'legal' | 'payments' | 'trust'>;
  /** The year the page is built; "Operating" counts years up to it. */
  year: number;
};
