import type { TourFilters } from './utils/tourFilters.ts';
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
  /** The Trip Planner with a destination chosen: /plan?dest=hunza (the Planner pre-selects it). */
  planFor: (destination: string) => `/plan?dest=${encodeURIComponent(destination)}`,
  about: '/about',
  help: '/help',
  /** Help's booking policies (Contact's quick links). */
  policies: `/help#${POLICIES_ANCHOR}`,
  /** One answer on the Help page, which opens it: /help#refunds. */
  helpAnswer: (id: string) => `/help${helpAnswerHash(id)}`,
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  credits: '/credits',
  /** One guide's profile on the About page. */
  guide: (slug: string) => `/about${guideHash(slug)}`,

  /* Sections the nav jumps to. */
  how: '/#how',
  destinations: '/#destinations',
  reviews: '/#reviews',
  guides: '/about#guides',
} as const;

/** A page in the route map by name, for copy that links to one: "plan" is /plan, "destinations" /#destinations. */
export type PageName = { [K in keyof typeof routes]: (typeof routes)[K] extends string ? K : never }[keyof typeof routes];

/** Every name whose route is a fixed path, not a function of a slug or filters. */
export const PAGE_NAMES = Object.keys(routes).filter((name): name is PageName => typeof routes[name as keyof typeof routes] === 'string');
