import type { ReactNode } from 'react';

type SheetBase = {
  open: boolean;
  /** Called when the sheet closes by Escape, the backdrop, or the close button. */
  onClose: () => void;
  /** Shown in the header and used as the dialog's accessible name. */
  title: string;
  children: ReactNode;
};

/** On phones: booking, filters, sort. */
type BottomSheet = SheetBase & {
  variant?: 'bottom';
  /** A grab handle at the top. */
  handle?: boolean;
};

/** A side panel, e.g. a guide profile. */
type Drawer = SheetBase & { variant: 'drawer'; handle?: never };

export type SheetProps = BottomSheet | Drawer;
