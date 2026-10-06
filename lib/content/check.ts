import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { RESERVED_FILES, reservedPageNames } from '../utils/contentIds.ts';
import { loadCatalog } from './catalog.ts';
import { loadFaqs } from './faqs.ts';
import { CONTENT_DIR, type ContentProblem } from './files.ts';
import { loadGuides } from './guides.ts';
import { checkPhotoFiles, PUBLIC_DIR } from './imageFiles.ts';
import { loadAboutCopy, loadContactCopy, loadCreditsCopy, loadDestinationCopy, loadDestinationsCopy, loadHelpCopy, loadHomeCopy, loadLegalCopy, loadNotFoundCopy, loadPlannerCopy, loadTourCopy, loadToursCopy } from './pages.ts';
import { loadReviews } from './reviews.ts';
import { loadRouteMap } from './routeMap.ts';
import { loadSettings } from './settings.ts';

/** Validates all content and returns every problem found (empty when everything is valid). */
export function checkContent(dir = CONTENT_DIR, publicDir = PUBLIC_DIR): ContentProblem[] {
  const catalog = loadCatalog(dir);
  return [
    ...loadSettings(dir).problems,
    ...catalog.problems,
    ...loadGuides(dir).problems,
    ...loadReviews(dir, catalog.tourFiles).problems,
    ...loadHomeCopy(dir).problems,
    ...loadCreditsCopy(dir).problems,
    ...loadTourCopy(dir).problems,
    ...loadToursCopy(dir).problems,
    ...loadDestinationCopy(dir).problems,
    ...loadDestinationsCopy(dir).problems,
    ...loadPlannerCopy(dir).problems,
    ...loadAboutCopy(dir).problems,
    ...loadLegalCopy(dir).problems,
    ...loadHelpCopy(dir).problems,
    ...loadContactCopy(dir).problems,
    ...loadNotFoundCopy(dir).problems,
    ...loadRouteMap(dir).problems,
    ...loadFaqs(dir).problems,
    ...checkPhotoFiles(dir, publicDir),
    ...checkPageNames(dir),
  ];
}

/** A page file may not take a name content ids reserve for another file (ADR-0034): "settings.…" must mean settings.json. */
function checkPageNames(dir: string): ContentProblem[] {
  const pages = path.join(dir, 'pages');
  if (!existsSync(pages)) return [];
  const names = readdirSync(pages)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -'.json'.length));
  return reservedPageNames(names).map((name) => ({
    file: `content/pages/${name}.json`,
    message: `"${name}" is reserved for content/${RESERVED_FILES[name as keyof typeof RESERVED_FILES]} in content ids (ADR-0034); rename the page file`,
  }));
}
