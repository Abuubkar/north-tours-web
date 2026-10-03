import { loadCatalog } from './catalog.ts';
import { CONTENT_DIR, type ContentProblem } from './files.ts';
import { loadGuides } from './guides.ts';
import { loadReviews } from './reviews.ts';
import { loadSettings } from './settings.ts';

/** Validates all content and returns every problem found (empty when everything is valid). */
export function checkContent(dir = CONTENT_DIR): ContentProblem[] {
  return [
    ...loadSettings(dir).problems,
    ...loadCatalog(dir).problems,
    ...loadGuides(dir).problems,
    ...loadReviews(dir).problems,
  ];
}
