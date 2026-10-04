'use client';

import { usePathname } from 'next/navigation';
import { activeNavItem, mainNav } from '@/lib/utils/nav';
import type { NavLinksProps } from './NavLinks.types';
import styles from './NavLinks.module.css';

const variants = {
  header: { name: 'Main', list: styles.headerList, link: styles.headerLink },
  menu: { name: 'Main', list: styles.stackedList, link: styles.menuLink },
  footer: { name: 'Footer', list: styles.stackedList, link: styles.footerLink },
};

/**
 * The main nav's page links (ADR-0026), in the header, the mobile menu or the footer. The item
 * for the page shown is gold and marked aria-current="page", from the URL alone.
 */
export function NavLinks({ variant }: NavLinksProps) {
  const active = activeNavItem(usePathname());
  const { name, list, link } = variants[variant];

  return (
    <nav aria-label={name}>
      <ul className={list}>
        {mainNav.map(({ id, label, href }) => (
          <li key={id}>
            <a href={href} className={link} aria-current={id === active ? 'page' : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
