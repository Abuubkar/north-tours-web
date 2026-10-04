'use client';

import { useId, type MouseEvent } from 'react';
import { useModalDialog } from '@/hooks/useModalDialog';
import { IconButton } from '../IconButton/IconButton';
import type { SheetProps } from './Sheet.types';
import styles from './Sheet.module.css';

/**
 * A modal <dialog> opened with showModal(): the browser makes the page behind inert,
 * closes it on Escape and returns focus to whatever opened it.
 */
export function Sheet({ open, onClose, title, variant = 'bottom', handle = false, children, footer }: SheetProps) {
  const { ref, close } = useModalDialog(open);
  const titleId = useId();

  // Clicks on the dialog element itself land on the backdrop; the panel content is a child.
  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) close();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`${styles.sheet} ${styles[variant]}`}
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className={styles.panel}>
        {handle && <span className={styles.handle} aria-hidden="true" />}
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon="close" label="Close" onClick={close} />
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
}
