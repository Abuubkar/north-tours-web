/**
 * Every URL on the site. Links use these, never hard-coded paths. Most pages are built by
 * their own PRDs; links point to them already.
 */
export const routes = {
  home: '/',
  tours: '/tours',
  tour: (slug: string) => `/tours/${slug}`,
  destination: (slug: string) => `/destinations/${slug}`,
  plan: '/plan',
  about: '/about',
  help: '/help',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',

  /* Sections the nav jumps to. */
  how: '/#how',
  destinations: '/#destinations',
  reviews: '/#reviews',
  guides: '/about#guides',
} as const;
