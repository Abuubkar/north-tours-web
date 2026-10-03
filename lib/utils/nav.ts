import { routes } from '../routes.ts';

export type NavItemId = 'tours' | 'how' | 'destinations' | 'guides' | 'reviews';

type NavItem = { id: NavItemId; label: string; href: string };

/** The main nav, shared by the header and the mobile menu. */
export const mainNav: readonly NavItem[] = [
  { id: 'tours', label: 'Tours', href: routes.tours },
  { id: 'how', label: 'How it works', href: routes.how },
  { id: 'destinations', label: 'Destinations', href: routes.destinations },
  { id: 'guides', label: 'Guides', href: routes.guides },
  { id: 'reviews', label: 'Reviews', href: routes.reviews },
];

/**
 * The nav item for the page at `pathname`, shown gold with aria-current="page", or null.
 * Tours covers every tour page, Destinations every destination page, and Guides the About page.
 * The Homepage has none; it highlights the section in view instead (Homepage PRD).
 */
export function activeNavItem(pathname: string): NavItemId | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  // A route built with an empty slug is the prefix every page of that kind shares: "/tours/".
  const tourPrefix = routes.tour('');
  const destinationPrefix = routes.destination('');
  if (path === routes.tours || path.startsWith(tourPrefix)) return 'tours';
  if (path.startsWith(destinationPrefix)) return 'destinations';
  if (path === routes.about) return 'guides';
  return null;
}
