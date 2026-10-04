import type { RefundTableRow } from '@/lib/utils/refundTable';

/** A policy as the page shows it, its tokens filled from settings. */
export type PolicyCardData = {
  id: string;
  title: string;
  summary: string;
  /** The refund table's rows, for the policy that shows it. */
  refundRows?: RefundTableRow[];
  /** The full policy, shown when opened. */
  paragraphs: string[];
};

export type PolicyCardProps = PolicyCardData & {
  /** The refund table's caption and column headers. */
  table: { caption: string; days: string; refund: string };
  /** "Read the full policy", and "Hide the full policy" while it's open. */
  readMore: string;
  hide: string;
};
