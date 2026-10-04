import type { Ref } from 'react';
import type { DropdownHandle } from '@/components/ui/Dropdown/Dropdown.types';
import type { ToursCopy } from '@/lib/content/pages';
import type { OptionLabels } from '@/lib/utils/resultsText';
import type { FilterGroupId } from '@/lib/utils/tourFilters';

export type FilterGroupProps = {
  group: FilterGroupId;
  /** On the trigger, e.g. "Destination". */
  label: string;
  /** Each option's words. */
  labels: OptionLabels;
  /** "{count} trip(s)", for each option's accessible name: "Hunza, 3 trips". */
  countWords: ToursCopy['results']['count'];
  /** Lets the bar close the dropdown when it hides. */
  ref?: Ref<DropdownHandle>;
};
