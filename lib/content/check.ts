import { loadCatalog } from './catalog.ts';
import { loadFaqs } from './faqs.ts';
import { CONTENT_DIR, type ContentProblem } from './files.ts';
import { loadGuides } from './guides.ts';
import { checkPhotoFiles, PUBLIC_DIR } from './imageFiles.ts';
import { loadCreditsCopy, loadDestinationCopy, loadHomeCopy, loadTourCopy, loadToursCopy } from './pages.ts';
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
    ...loadRouteMap(dir).problems,
    ...loadFaqs(dir).problems,
    ...checkPhotoFiles(dir, publicDir),
  ];
}
