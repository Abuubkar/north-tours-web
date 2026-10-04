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

/** The Homepage sections the nav marks while they're in view (scroll-spy). Tours and Guides link to other pages. */
export const SPIED_SECTIONS = ['how', 'destinations', 'reviews'] as const satisfies readonly NavItemId[];

export type SpiedSection = (typeof SPIED_SECTIONS)[number];

/** A section counts as in view once its top is above this fraction of the viewport's height. */
const SPY_LINE = 0.4;

/**
 * The Homepage section in view, from each section's top (px from the top of the viewport): the
 * last one whose top is above 40% of the viewport. Null above the first, so nothing is marked
 * over the hero and departures.
 */
export function sectionInView<T extends string>(sections: readonly { id: T; top: number }[], viewportHeight: number): T | null {
  const line = viewportHeight * SPY_LINE;
  return sections.filter(({ top }) => top < line).at(-1)?.id ?? null;
}

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
