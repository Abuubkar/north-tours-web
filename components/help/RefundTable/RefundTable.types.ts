import type { RefundTableRow } from '@/lib/utils/refundTable';

export type RefundTableProps = {
  /** Read out, not shown: what the table is. */
  caption: string;
  /** The column headers: "Days before departure" and "Refund of advance". */
  daysHeader: string;
  refundHeader: string;
  /** From the settings refund schedule, nearest the full refund first. */
  rows: RefundTableRow[];
};
