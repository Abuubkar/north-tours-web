'use client';

import { usePathname } from 'next/navigation';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { routes } from '@/lib/routes';
import { activeNavItem, mainNav, SPIED_SECTIONS } from '@/lib/utils/nav';
import type { NavLinksProps } from './NavLinks.types';
import styles from './NavLinks.module.css';

const variantClass = {
  header: { list: styles.headerList, link: styles.headerLink },
  menu: { list: styles.menuList, link: styles.menuLink },
};

const NO_SECTIONS = [] as const;

/**
 * The main nav, named "Main". On the Homepage the item for the section in view is gold and
 * marked aria-current="location" (scroll-spy); on other pages the current page's item is,
 * with aria-current="page".
 */
export function NavLinks({ variant }: NavLinksProps) {
  const pathname = usePathname();
  const onHomepage = pathname === routes.home;
  const spiedSection = useScrollSpy(onHomepage ? SPIED_SECTIONS : NO_SECTIONS);
  // On the Homepage the item marks a place on the page; elsewhere, the page itself.
  const active = onHomepage ? spiedSection : activeNavItem(pathname);
  const ariaCurrent = onHomepage ? 'location' : 'page';
  const classes = variantClass[variant];

  return (
    <nav aria-label="Main">
      <ul className={classes.list}>
        {mainNav.map(({ id, label, href }) => (
          <li key={id}>
            <a href={href} className={classes.link} aria-current={id === active ? ariaCurrent : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
