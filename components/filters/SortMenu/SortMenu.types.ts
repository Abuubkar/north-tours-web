import type { Ref } from 'react';
import type { DropdownHandle } from '@/components/ui/Dropdown/Dropdown.types';
import type { ToursCopy } from '@/lib/content/pages';

export type SortMenuProps = {
  /** "Sort:", before the current sort on the trigger. */
  label: string;
  /** Each sort's words. */
  sorts: ToursCopy['sorts'];
  /** Lets the bar close the menu when it hides. */
  ref?: Ref<DropdownHandle>;
};
