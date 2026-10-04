import type { AboutCopy } from '@/lib/content/pages';

export type CredentialsProps = {
  /** The licence's value with the licence number filled in. */
  copy: AboutCopy['credentials'];
  /** From settings: the trust strip's note under the licence ("Department of Tourist Services, Punjab"). */
  licenceNote: string;
  /** From settings, the placeholder as written until it's supplied. */
  companyRegistration: string;
};
