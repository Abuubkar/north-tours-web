import type { ContactCopy } from '@/lib/content/pages';
import type { ContactValue } from '@/lib/utils/contact';

export type WaysToReachUsProps = {
  /** The hidden heading and each channel's words (their tokens filled). */
  copy: ContactCopy['ways'];
  /** The values from settings, each with its link once real; "Chat now" has the general message. */
  channels: {
    whatsapp: ContactValue & { chatHref: string };
    phone: ContactValue & { hours: string };
    email: ContactValue;
  };
};
