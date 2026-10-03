import type { ReactNode } from 'react';

export type SheetProps = {
  open: boolean;
  /** Called when the sheet closes by Escape, the backdrop, or the close button. */
  onClose: () => void;
  /** Shown in the header and used as the dialog's accessible name. */
  title: string;
  /** bottom: sheets on phones (booking, filters, sort). drawer: side panel (guide profile). */
  variant?: 'bottom' | 'drawer';
  /** A grab handle at the top of a bottom sheet. */
  handle?: boolean;
  children: ReactNode;
};
