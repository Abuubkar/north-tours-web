import { routes } from '../routes.ts';
import { sitePath } from './basePath.ts';

export type NavItemId = 'home' | 'tours' | 'destinations' | 'plan' | 'about' | 'contact';

type NavItem = {
  id: NavItemId;
  label: string;
  /** A page in the route map, never a section of one (ADR-0026). */
  href: string;
  /** The pages under the item that mark it too: "/tours/" for every tour page. */
  below?: string;
};

/** The main nav (ADR-0026, ADR-0027), shared by the header, the mobile menu and the footer's large links. */
export const mainNav: readonly NavItem[] = [
  { id: 'home', label: 'Home', href: routes.home },
  // A route built with an empty slug is the prefix every page of that kind shares: "/tours/".
  { id: 'tours', label: 'Tours', href: routes.tours, below: routes.tour('') },
  { id: 'destinations', label: 'Destinations', href: routes.destinations, below: routes.destination('') },
  { id: 'plan', label: 'Private trips', href: routes.plan },
  { id: 'about', label: 'About', href: routes.about },
  { id: 'contact', label: 'Contact', href: routes.contact },
];

/** A path without its trailing slashes, except the root "/". */
const trimmed = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/**
 * The nav item for the page at `pathname`, shown gold with aria-current="page", or null. Home
 * marks the Homepage only; Tours also covers every tour page, and Destinations every destination
 * page. Help, the legal pages and Photo credits have none. `pathname` is Next's, without the base
 * path; the nav's links have it (ADR-0032), so it's added before comparing.
 */
export function activeNavItem(pathname: string): NavItemId | null {
  const path = trimmed(sitePath(pathname));
  return mainNav.find(({ href, below }) => path === trimmed(href) || (below !== undefined && path.startsWith(below)))?.id ?? null;
}
