import type { CategoryLink } from '@/lib/utils/helpAnswers';

export type CategoryNavProps = {
  /** Both navs' name: "Help categories". */
  label: string;
  /** Each category's link: to its heading, with its count, named "Booking & payment, 4 answers". */
  links: CategoryLink[];
};
