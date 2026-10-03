import { loadDestinations } from './destinations.ts';
import { CONTENT_DIR, type ContentProblem } from './files.ts';
import { checkTourLinks } from './links.ts';
import { loadSettings } from './settings.ts';
import { loadTours } from './tours.ts';

/** Loads tours and destinations together and checks the links between them. */
export function loadTravelContent(dir = CONTENT_DIR) {
  const destinations = loadDestinations(dir);
  const tours = loadTours(dir);
  const links = checkTourLinks(tours.items, destinations.slugs, dir);
  return {
    tours: tours.items,
    destinations: destinations.items,
    problems: [...destinations.problems, ...tours.problems, ...links],
  };
}

/** Validates all content and returns every problem found (empty when everything is valid). */
export function checkContent(dir = CONTENT_DIR): ContentProblem[] {
  return [...loadSettings(dir).problems, ...loadTravelContent(dir).problems];
}
