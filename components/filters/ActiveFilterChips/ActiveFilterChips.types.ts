import type { OptionLabels } from '@/lib/utils/resultsText';

export type ActiveFilterChipsProps = {
  /** Each option's words, for its chip: "Hunza", "Family", "June 2027". */
  labels: OptionLabels;
  /** "Clear all". */
  clearLabel: string;
};
