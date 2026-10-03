import type { HomeCopy } from '@/lib/content/pages';

export type HomeHeroProps = {
  copy: HomeCopy['hero'];
  /** wa.me link with the general message from settings. */
  whatsappHref: string;
};
