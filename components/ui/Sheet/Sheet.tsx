'use client';

import { useEffect, useId, useRef, type MouseEvent } from 'react';
import { IconButton } from '../IconButton/IconButton';
import type { SheetProps } from './Sheet.types';
import styles from './Sheet.module.css';

/**
 * A modal <dialog> opened with showModal(): the browser makes the page behind inert,
 * closes it on Escape and returns focus to whatever opened it.
 */
export function Sheet({ open, onClose, title, variant = 'bottom', handle = false, children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Clicks on the dialog element itself land on the backdrop; the panel content is a child.
  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`${styles.sheet} ${styles[variant]}`}
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className={styles.panel}>
        {handle && variant === 'bottom' && <span className={styles.handle} aria-hidden="true" />}
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon="close" label="Close" onClick={() => dialogRef.current?.close()} />
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
