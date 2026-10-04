import type { OptionLabels } from '@/lib/utils/resultsText';

export type ActiveFilterChipsProps = {
  /** Each option's words, for its chip: "Hunza", "Family", "June 2027". */
  labels: OptionLabels;
  /** "Clear all". */
  clearLabel: string;
};

/** Where focus goes after a chip is removed: another chip (by position), the results, or nowhere yet. */
export type FocusTarget = number | 'results' | null;
