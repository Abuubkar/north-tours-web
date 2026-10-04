import type { SocialLink } from '@/lib/utils/contact';

export type QuickLink = { label: string; href: string };

export type QuickLinksProps = {
  /** "Quick links": the section's label, its <h2>, and the nav's name. */
  label: string;
  /** Where to carry on: the planner, the tours, Help and the booking policies. */
  links: QuickLink[];
  /** "Follow the trips", over the social links. */
  follow: string;
  /** Instagram, Facebook and YouTube: links once real, plain text while placeholders (href undefined). */
  social: SocialLink[];
};
