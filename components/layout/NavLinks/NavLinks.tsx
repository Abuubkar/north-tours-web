'use client';

import { usePathname } from 'next/navigation';
import { activeNavItem, mainNav } from '@/lib/utils/nav';
import styles from './NavLinks.module.css';

/** The main nav links. The current page's item is gold and marked aria-current="page". */
export function NavLinks() {
  const active = activeNavItem(usePathname());

  return (
    <ul className={styles.list}>
      {mainNav.map(({ id, label, href }) => (
        <li key={id}>
          <a href={href} className={styles.link} aria-current={id === active ? 'page' : undefined}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
