import type { ContentImage } from '@/lib/content/images';

export type DestinationChoiceCardProps = {
  /** The destination's name, or "Not sure, suggest something"; the card's accessible name. */
  label: string;
  /** The destination's photo. Without one ("Not sure") the card shows the light placeholder stripes. */
  image?: ContentImage;
  pressed: boolean;
  /** Draws the error border while no destination is chosen after Next. */
  invalid?: boolean;
  /** The error message's id, so the focused card reads it. */
  describedBy?: string;
  /** The first card's id, so a failed Next can focus it. */
  id?: string;
  onToggle: () => void;
};
