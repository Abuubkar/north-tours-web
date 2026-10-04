import type { RefundTableRow } from '@/lib/utils/refundTable';

export type RefundTableProps = {
  /** Its caption (read out, not shown) and its column headers: "Days before departure", "Refund of advance". */
  words: { caption: string; days: string; refund: string };
  /** From the settings refund schedule, nearest the full refund first. */
  rows: RefundTableRow[];
};
