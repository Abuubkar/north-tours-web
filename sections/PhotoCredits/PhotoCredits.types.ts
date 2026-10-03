import type { CreditsCopy } from '@/lib/content/pages';
import type { PhotoCredit } from '@/lib/utils/credits';

export type PhotoCreditsProps = {
  copy: Pick<CreditsCopy, 'headline' | 'intro'>;
  credits: PhotoCredit[];
};
