'use client';

import { useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { Sheet } from '@/components/ui/Sheet/Sheet';
import { NavLinks } from '../NavLinks/NavLinks';
import type { MobileMenuProps } from './MobileMenu.types';
import styles from './MobileMenu.module.css';

/**
 * Below 820px: the menu button and the side drawer it opens. Only the button hides from 820px,
 * so a menu left open while the window widens stays usable. The Sheet handles Escape, the
 * backdrop, the close button, Android's back gesture and focus return to the menu button.
 */
export function MobileMenu({ whatsappHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Tapping any link in the menu closes it.
  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest('a')) setOpen(false);
  }

  return (
    <>
      <div className={styles.menuButton}>
        <IconButton icon="menu" label="Menu" onClick={() => setOpen(true)} />
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu" variant="drawer">
        <div className={styles.content} onClick={closeOnLink}>
          <nav aria-label="Main">
            <NavLinks variant="menu" />
          </nav>
          <Button href={whatsappHref} size={56} icon="whatsapp">
            Plan on WhatsApp
          </Button>
        </div>
      </Sheet>
    </>
  );
}
