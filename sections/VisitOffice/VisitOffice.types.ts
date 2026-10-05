import type { Settings } from '@/lib/content/settings';
import type { OfficeMapData } from '@/lib/utils/contact';

export type VisitOfficeProps = {
  /**
   * four-row (About): Office, Open, Phone and WhatsApp, "Get directions" and "WhatsApp first".
   * two-row (Contact, where the numbers are above it): Office and Open, and "Get directions" only.
   */
  form?: 'four-row' | 'two-row';
  /** The block's words, the office's address, hours and numbers, and the general WhatsApp message. */
  settings: Pick<Settings, 'visitOffice' | 'contact'> & { whatsapp: Pick<Settings['whatsapp'], 'generalMessage'> };
  /** The office on a map beside the rows (ADR-0029); none while the address is a placeholder. */
  map?: OfficeMapData;
};
