'use client';

import { useId, useRef, useState, type CSSProperties, type ToggleEvent } from 'react';
import { useAnchorFallback } from '@/hooks/useAnchorFallback';
import { Chip } from '../Chip/Chip';
import type { DropdownProps } from './Dropdown.types';
import styles from './Dropdown.module.css';

/**
 * A chip that opens a native popover panel. The browser handles opening, Escape and closing on
 * an outside click; CSS anchor positioning places the panel under the chip (with a small
 * script where that isn't supported).
 */
export function Dropdown({ label, count, active = false, children }: DropdownProps) {
  const id = `dropdown-${useId().replace(/[^\w-]/g, '')}`;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useAnchorFallback(panelRef, anchorRef, open);

  const anchor = { '--anchor': `--${id}` } as CSSProperties;

  return (
    <span ref={anchorRef} className={styles.anchor} style={anchor}>
      <Chip variant="trigger" expanded={open} active={active} count={count} popoverTarget={id}>
        {label}
      </Chip>
      <div
        ref={panelRef}
        id={id}
        popover="auto"
        className={styles.panel}
        style={anchor}
        onToggle={(event: ToggleEvent<HTMLDivElement>) => setOpen(event.newState === 'open')}
      >
        {children}
      </div>
    </span>
  );
}
