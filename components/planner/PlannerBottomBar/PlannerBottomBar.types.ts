export type PlannerBottomBarProps = {
  /** "Back", from step 2; none on step 1. */
  backLabel?: string;
  /** The short Next below 820px ("Next"), and the full one from 820px ("Next: Who’s coming", "Review"). */
  nextShort: string;
  nextLabel: string;
  /** On review: "Send on WhatsApp", the trip request link, in place of Next. */
  send?: { label: string; href: string };
  onBack: () => void;
  onNext: () => void;
  onSend: () => void;
};
