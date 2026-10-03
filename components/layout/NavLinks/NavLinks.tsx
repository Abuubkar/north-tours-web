'use client';

import { usePathname } from 'next/navigation';
import { activeNavItem, mainNav } from '@/lib/utils/nav';
import type { NavLinksProps } from './NavLinks.types';
import styles from './NavLinks.module.css';

const variantClass = {
  header: { list: styles.headerList, link: styles.headerLink },
  menu: { list: styles.menuList, link: styles.menuLink },
};

/** The main nav, named "Main". The current page's item is gold and marked aria-current="page". */
export function NavLinks({ variant }: NavLinksProps) {
  const active = activeNavItem(usePathname());
  const classes = variantClass[variant];

  return (
    <nav aria-label="Main">
      <ul className={classes.list}>
        {mainNav.map(({ id, label, href }) => (
          <li key={id}>
            <a href={href} className={classes.link} aria-current={id === active ? 'page' : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
