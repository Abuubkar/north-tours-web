import type { LegalSectionProps } from '@/components/legal/LegalSection/LegalSection.types';

export type LegalBodyProps = {
  /** "Contents" and the phone disclosure's "Contents (9)". */
  contents: { label: string; toggleLabel: string };
  /** The document's sections in order, numbered, their tokens filled. */
  sections: LegalSectionProps[];
  /** The article's last line, with the email's place: "Questions about this policy? Email {email}." */
  closing: string;
  /** The email from settings: a mailto: link once real, plain text while a placeholder. */
  email: string;
};
