import type { HomeCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';

export type HomeHeroProps = {
  copy: HomeCopy['hero'];
  /** "Plan on WhatsApp" opens a chat with the general message. */
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};
