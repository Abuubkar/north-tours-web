import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

type ButtonAttrs = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

type ToggleChip = ButtonAttrs & {
  variant: 'toggle';
  /** On or off; the caller owns the state. */
  pressed: boolean;
  children: ReactNode;
  count?: number;
};

type TriggerChip = ButtonAttrs & {
  variant: 'trigger';
  /** Whether the dropdown or sheet it opens is open. */
  expanded: boolean;
  /** Filters are applied, e.g. "Destination (2)". */
  active?: boolean;
  children: ReactNode;
  /** How many are applied, shown in brackets: "(2)". */
  count?: number;
  /** The button, e.g. for focus to return to it. */
  ref?: Ref<HTMLButtonElement>;
};

type RemovableChip = Omit<ButtonAttrs, 'onClick'> & {
  variant: 'removable';
  /** The filter's name, also used in the accessible name "Remove filter {label}". */
  children: string;
  onRemove: () => void;
};

type LinkChip = {
  variant: 'link';
  href: string;
  children: ReactNode;
  count?: number;
  /** Its accessible name, when the count needs its words read out: "Safety, 4 answers". */
  label?: string;
};

/** toggle: on/off choice. trigger: opens a dropdown or sheet. removable: an applied filter. link: navigates. */
export type ChipProps = ToggleChip | TriggerChip | RemovableChip | LinkChip;

export type CountProps = {
  value?: number;
  /** A trigger's applied count reads "(2)"; an option's trip count is bare. */
  inParens?: boolean;
};
