import type { AboutCopy } from '@/lib/content/pages';
import type { GuideProfile } from '@/lib/utils/guideProfile';

export type GuideProfileDialogProps = {
  /** The whole team, in grid order. */
  profiles: GuideProfile[];
  /** The shown guide's place in `profiles`, or null when closed. */
  shown: number | null;
  /** True once the visitor has moved to another guide: the new one is announced. */
  stepped: boolean;
  copy: AboutCopy['guides']['profile'];
  /** Previous (−1) or next (+1). */
  onStep: (direction: 1 | -1) => void;
  /** Close, the backdrop or Escape. */
  onClose: () => void;
};
