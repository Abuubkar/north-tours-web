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
  const sectionInView = useScrollSpy(onHomepage ? SPIED_SECTIONS : NO_SECTIONS);
  const active = onHomepage ? sectionInView : activeNavItem(pathname);
  const current = onHomepage ? 'location' : 'page';
  const classes = variantClass[variant];

  return (
    <nav aria-label="Main">
      <ul className={classes.list}>
        {mainNav.map(({ id, label, href }) => (
          <li key={id}>
            <a href={href} className={classes.link} aria-current={id === active ? current : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
