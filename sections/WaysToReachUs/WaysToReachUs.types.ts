import type { ContactCopy } from '@/lib/content/pages';

type Channel = { value: string; href: string | undefined };

export type WaysToReachUsProps = {
  /** The hidden heading and each channel's words (their tokens filled). */
  copy: ContactCopy['ways'];
  /** The values from settings, each with its link once real; "Chat now" has the general message. */
  channels: {
    whatsapp: Channel & { chatHref: string };
    phone: Channel & { hours: string };
    email: Channel;
  };
};
