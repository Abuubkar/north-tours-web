import type { AboutPage } from '@/lib/content/aboutPage';

export type CredentialsProps = {
  /** Shaped by the page: the licence with its number and note, the registration, and the memberships' names. */
  credentials: AboutPage['credentials'];
};
