import type { Guide } from '@/lib/content/guides';

type CardGuide = Pick<Guide, 'slug' | 'name' | 'role' | 'base' | 'portrait'>;

/** Homepage: a link to the guide's profile on the About page. */
type LinkCard = { variant?: 'link'; guide: CardGuide };

/** About: a button that opens the guide's profile, carrying the guide's anchor as its id. */
type ButtonCard = {
  variant: 'button';
  guide: CardGuide;
  /** "View profile", under the role. */
  viewLabel: string;
  /** While its profile is shown, the card takes the raised surface. */
  selected: boolean;
  onOpen: () => void;
};

export type GuideCardProps = LinkCard | ButtonCard;
