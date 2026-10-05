'use client';

import { useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Sheet } from '@/components/ui/Sheet/Sheet';
import { NavLinks } from '../NavLinks/NavLinks';
import type { MobileMenuProps } from './MobileMenu.types';
import styles from './MobileMenu.module.css';

/**
 * Below 1200px: the bordered "Menu" button and the side drawer it opens. Only the button hides from 1200px,
 * so a menu left open while the window widens stays usable. The Sheet handles Escape, the
 * backdrop, the close button, Android's back gesture and focus return to the menu button.
 */
export function MobileMenu({ whatsappHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Tapping any link in the menu closes it, "Plan on WhatsApp" included.
  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest('a')) setOpen(false);
  }

  return (
    <>
      <div className={styles.menuSlot}>
        <button type="button" className={styles.menuButton} onClick={() => setOpen(true)}>
          Menu
        </button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu" variant="drawer">
        <div className={styles.content} onClick={closeOnLink}>
          <NavLinks variant="menu" />
          <Button href={whatsappHref} size={56} icon="whatsapp">
            Plan on WhatsApp
          </Button>
        </div>
      </Sheet>
    </>
  );
}
