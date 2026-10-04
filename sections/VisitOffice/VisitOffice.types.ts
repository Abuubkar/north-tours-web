import type { Settings } from '@/lib/content/settings';

export type VisitOfficeProps = {
  /** The block's words and photo, the office's address, hours and numbers, and the general WhatsApp message. */
  settings: Pick<Settings, 'visitOffice' | 'contact'> & { whatsapp: Pick<Settings['whatsapp'], 'generalMessage'> };
};
