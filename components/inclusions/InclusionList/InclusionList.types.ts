import type { Tour } from '@/lib/content/tours';

type Group = { heading: string; rows: Tour['included'] };

export type InclusionListProps = {
  included: Group;
  notIncluded: Group;
};
