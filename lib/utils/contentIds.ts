/*
 * Content ids (ADR-0034): one short name for every string in content, used by edit mode.
 * - Page copy: the first word is the file in content/pages: "home.hero.lead" → pages/home.json, hero.lead.
 * - Collection items: a colon after the kind: "tour:hunza-express.title" → tours/hunza-express.json, title.
 * - The other files have reserved names: "settings.contact.phone" → settings.json, contact.phone.
 * List items are numeric segments: "home.steps.items.2.title".
 */

/** A path inside a JSON file: object keys, and numbers for list items. */
export type JsonPath = (string | number)[];

/** Where a content id points: a file relative to the content folder, and the path inside it. */
export type ContentLocation = { file: string; path: JsonPath };

/** Each collection's id prefix and its folder in content. */
export const COLLECTIONS = { tour: 'tours', destination: 'destinations', guide: 'guides', review: 'reviews' } as const;

/** Content files that aren't pages, by the name their ids start with; no page file may take these names. */
export const RESERVED_FILES = { settings: 'settings.json', faqs: 'faqs.json', 'route-map': 'route-map.json' } as const;

const PAGES_DIR = 'pages';
const NUMBER = /^\d+$/;
/** A file's name in an id: lower-case words and hyphens, so an id can never reach another folder. */
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const pathFrom = (segments: string[]): JsonPath => segments.map((segment) => (NUMBER.test(segment) ? Number(segment) : segment));

/** The file and path an id points to, or null if it isn't a well-formed id. Says nothing of whether the file exists. */
export function parseContentId(id: string): ContentLocation | null {
  const [head, ...rest] = id.split('.');
  if (!head || rest.length === 0 || rest.some((segment) => segment === '')) return null;
  const colon = head.indexOf(':');
  if (colon >= 0) {
    const kind = head.slice(0, colon);
    const slug = head.slice(colon + 1);
    if (!Object.hasOwn(COLLECTIONS, kind) || !NAME.test(slug)) return null;
    return { file: `${COLLECTIONS[kind as keyof typeof COLLECTIONS]}/${slug}.json`, path: pathFrom(rest) };
  }
  if (!NAME.test(head)) return null;
  const file = Object.hasOwn(RESERVED_FILES, head) ? RESERVED_FILES[head as keyof typeof RESERVED_FILES] : `${PAGES_DIR}/${head}.json`;
  return { file, path: pathFrom(rest) };
}

/** The id of a string at `path` in `file` (relative to the content folder), or null for a file ids don't cover. */
export function contentId(file: string, path: JsonPath): string | null {
  if (path.length === 0) return null;
  const keys = path.join('.');
  const reserved = Object.entries(RESERVED_FILES).find(([, name]) => name === file);
  if (reserved) return `${reserved[0]}.${keys}`;
  const [folder, name, ...deeper] = file.split('/');
  if (!name || deeper.length > 0 || !name.endsWith('.json')) return null;
  const base = name.slice(0, -'.json'.length);
  if (folder === PAGES_DIR) return `${base}.${keys}`;
  const kind = Object.entries(COLLECTIONS).find(([, dir]) => dir === folder);
  return kind ? `${kind[0]}:${base}.${keys}` : null;
}

/** Page file names (without .json) that would read as another file's id: none may be used. */
export function reservedPageNames(pageNames: string[]): string[] {
  return pageNames.filter((name) => Object.hasOwn(RESERVED_FILES, name));
}
