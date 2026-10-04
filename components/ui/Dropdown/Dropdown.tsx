'use client';

import { useId, useImperativeHandle, useRef, useState, type CSSProperties, type ToggleEvent } from 'react';
import { useAnchorFallback } from '@/hooks/useAnchorFallback';
import { Chip } from '../Chip/Chip';
import type { DropdownProps } from './Dropdown.types';
import styles from './Dropdown.module.css';

/**
 * A chip that opens a native popover panel. The browser handles opening, Escape and closing on
 * an outside click; CSS anchor positioning places the panel under the chip (with a small
 * script where that isn't supported). The caller can close it through `ref` (e.g. once a sort is
 * picked); focus inside it then returns to the chip.
 */
export function Dropdown({ label, count, active, children, ref }: DropdownProps) {
  const id = `dropdown-${useId().replace(/[^\w-]/g, '')}`;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useAnchorFallback(panelRef, anchorRef, open);
  useImperativeHandle(ref, () => ({ close: () => panelRef.current?.hidePopover() }), []);

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
        // beforetoggle, so a script-placed panel is positioned before it first paints.
        onBeforeToggle={(event: ToggleEvent<HTMLDivElement>) => setOpen(event.newState === 'open')}
      >
        {children}
      </div>
    </span>
  );
}
