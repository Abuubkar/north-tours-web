import type { TourFilters } from './utils/tourFilters.ts';
import { sitePath } from './utils/basePath.ts';
import { toursSearch } from './utils/toursSearch.ts';

/** A guide's card on the About page carries this id, so `/about#guide-karim-baig` lands on it. */
export const guideAnchor = (slug: string) => `guide-${slug}`;

/** The hash of a guide's profile: "#guide-karim-baig". */
export const guideHash = (slug: string) => `#${guideAnchor(slug)}`;

/** A Help category's heading carries this prefix and its id: `/help#cat-safety`. */
export const HELP_CATEGORY_PREFIX = 'cat-';

export const helpCategoryAnchor = (id: string) => `${HELP_CATEGORY_PREFIX}${id}`;

/** The hash of one Help answer, its id: "#refunds". */
export const helpAnswerHash = (id: string) => `#${id}`;

/** Help's booking policies carry this id: `/help#policies`. */
export const POLICIES_ANCHOR = 'policies';

/** The Help page's other anchors, which an answer can't take: every page's <main> and the policies. */
export const HELP_PAGE_ANCHORS: readonly string[] = ['main', POLICIES_ANCHOR];

/** The Contact page's "On a trip right now?" panel carries this id: `/contact#on-trip`. */
export const ON_TRIP_ANCHOR = 'on-trip';

/**
 * Every URL on the site. Links use these, never hard-coded paths. Each goes through `sitePath`,
 * so it's under the base path when the build has one (ADR-0032).
 */
export const routes = {
  home: sitePath('/'),
  tours: sitePath('/tours'),
  /** The Tours page filtered, e.g. "See all Hunza trips": /tours?dest=hunza (lib/utils/toursSearch). */
  toursWith: (filters: Partial<TourFilters>) => sitePath(`/tours${toursSearch(filters)}`),
  tour: (slug: string) => sitePath(`/tours/${slug}`),
  /** Every destination on one page (PRD #118). */
  destinations: sitePath('/destinations'),
  destination: (slug: string) => sitePath(`/destinations/${slug}`),
  plan: sitePath('/plan'),
  /** The Trip Planner with a destination chosen: /plan?dest=hunza (the Planner pre-selects it). */
  planFor: (destination: string) => sitePath(`/plan?dest=${encodeURIComponent(destination)}`),
  about: sitePath('/about'),
  help: sitePath('/help'),
  /** Help's booking policies (Contact's quick links). */
  policies: sitePath(`/help#${POLICIES_ANCHOR}`),
  /** One answer on the Help page, which opens it: /help#refunds. */
  helpAnswer: (id: string) => sitePath(`/help${helpAnswerHash(id)}`),
  contact: sitePath('/contact'),
  privacy: sitePath('/privacy'),
  terms: sitePath('/terms'),
  credits: sitePath('/credits'),
  /** One guide's profile on the About page. */
  guide: (slug: string) => sitePath(`/about${guideHash(slug)}`),
  /** About's guides, for the Homepage's "Meet the team". */
  guides: sitePath('/about#guides'),
} as const;

/** A page in the route map by name, for copy that links to one: "plan" is /plan, "policies" /help#policies. */
export type PageName = { [K in keyof typeof routes]: (typeof routes)[K] extends string ? K : never }[keyof typeof routes];

/** Every name whose route is a fixed path, not a function of a slug or filters. */
export const PAGE_NAMES = Object.keys(routes).filter((name): name is PageName => typeof routes[name as keyof typeof routes] === 'string');
