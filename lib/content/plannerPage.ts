import { todayInKarachi } from '../utils/departures.ts';
import { fillTokens } from '../utils/tokens.ts';
import { getDestinations } from './catalog.ts';
import { getHomeCopy, getPlannerCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/**
 * Everything the Trip Planner shows, read through the loaders and shaped for it, so the route
 * only composes. The planner is client code, so each destination is picked down to its card and
 * the copy's settings tokens are filled here.
 */
export function getPlannerPage() {
  const settings = getSettings();
  const copy = getPlannerCopy();
  return {
    copy: {
      ...copy,
      header: { ...copy.header, lead: fillTokens(copy.header.lead, { replyTime: settings.booking.replyTime }) },
    },
    settings,
    /** The build's date (Asia/Karachi): the months and the earliest date until the browser has its own. */
    builtOn: todayInKarachi(new Date()),
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
    /** The destination cards, in the loader's order. */
    destinations: getDestinations().map(({ slug, name, image }) => ({ slug, name, image })),
  };
}

export type PlannerPage = ReturnType<typeof getPlannerPage>;
