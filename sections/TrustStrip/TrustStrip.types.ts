import type { Settings } from '@/lib/content/settings';

export type TrustStripProps = {
  settings: Pick<Settings, 'legal' | 'payments' | 'trust'>;
};
