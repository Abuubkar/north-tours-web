import type { TourFilters } from './utils/tourFilters.ts';
import { toursSearch } from './utils/toursSearch.ts';

/**
 * Every URL on the site. Links use these, never hard-coded paths. Most pages are built by
 * their own PRDs; links point to them already.
 */
export const routes = {
  home: '/',
  tours: '/tours',
  /** The Tours page filtered, e.g. "See all Hunza trips": /tours?dest=hunza (lib/utils/toursSearch). */
  toursWith: (filters: Partial<TourFilters>) => `/tours${toursSearch(filters)}`,
  tour: (slug: string) => `/tours/${slug}`,
  destination: (slug: string) => `/destinations/${slug}`,
  plan: '/plan',
  about: '/about',
  help: '/help',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  credits: '/credits',
  /** One guide's profile on the About page. */
  guide: (slug: string) => `/about#guide-${slug}`,

  /* Sections the nav jumps to. */
  how: '/#how',
  destinations: '/#destinations',
  reviews: '/#reviews',
  guides: '/about#guides',
} as const;
