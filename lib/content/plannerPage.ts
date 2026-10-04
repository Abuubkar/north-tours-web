import { todayInKarachi } from '../utils/departures.ts';
import { summaryWords } from '../utils/plannerSummary.ts';
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
  const replyTime = { replyTime: settings.booking.replyTime };
  const destinations = getDestinations().map(({ slug, name, image }) => ({ slug, name, image }));
  const builtOn = todayInKarachi(new Date());
  return {
    copy: {
      ...copy,
      header: { ...copy.header, lead: fillTokens(copy.header.lead, replyTime) },
      success: { ...copy.success, line: fillTokens(copy.success.line, replyTime) },
    },
    settings,
    /** The build's date (Asia/Karachi): the months and the earliest date until the browser has its own. */
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
    /** The destination cards, in the loader's order. */
    destinations,
    /** What the planner's state needs: the choices, the words for its summary, and the WhatsApp messages. */
    config: {
      destinations: destinations.map((d) => d.slug),
      builtOn,
      messages: copy.errors,
      words: summaryWords(copy, destinations),
      templates: settings.whatsapp.planner,
      whatsappNumber: settings.contact.whatsapp,
    },
  };
}

export type PlannerPage = ReturnType<typeof getPlannerPage>;
