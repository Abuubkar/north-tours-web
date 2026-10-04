export type PriceBlockProps = {
  /** Per person, in whole rupees. */
  amount: number;
  /**
   * card: tour cards (24px). fact: hero facts, departure rows and the sticky bar (the 18px
   * design size, on the step-title role). panel: the booking panel (30px).
   */
  size?: 'card' | 'fact' | 'panel';
  /** The "from" line above the amount. Leave it out where a label already says so. */
  from?: boolean;
  /** The line under the amount, e.g. "per person, twin sharing". */
  note?: string;
};
