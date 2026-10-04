import type { CompanyStat } from '@/lib/utils/companyStats';

export type InNumbersProps = {
  /** Read out, not shown: "The company in numbers". */
  headline: string;
  stats: CompanyStat[];
};
