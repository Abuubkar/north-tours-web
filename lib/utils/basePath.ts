/*
 * The base path (ADR-0032): the sub-path the site is built for. Empty by default, so local
 * builds, Storybook and tests serve from "/"; the GitHub Pages preview builds with
 * `BASE_PATH=/north-tours-web`. next.config passes it to Next and into every bundle, so server
 * and browser agree.
 */
export const BASE_PATH = process.env.BASE_PATH ?? '';

/** A path's last segment names a file when it has an extension: "/sitemap.xml", "/images/a-800.jpg". */
const FILE = /\.[a-z0-9]+$/i;

/**
 * A path on the site as a link, image or file URL. Routes and image URLs all go through it, so
 * nothing else writes a root-relative "/". With no base path it's the path as given. Under one,
 * it's prefixed, and a page's path ends in "/": a base-path build exports each page as a folder
 * with its own index.html (ADR-0032).
 * - "/tours?dest=hunza" → "/north-tours-web/tours/?dest=hunza"
 * - "/help#refunds" → "/north-tours-web/help/#refunds"
 * - "/images/hunza/attabad-800.jpg" → "/north-tours-web/images/hunza/attabad-800.jpg"
 */
export function sitePath(path: string, base: string = BASE_PATH): string {
  if (!base) return path;
  const split = path.search(/[?#]/);
  const pathname = split === -1 ? path : path.slice(0, split);
  const rest = split === -1 ? '' : path.slice(split);
  const folder = pathname.endsWith('/') || FILE.test(pathname) ? pathname : `${pathname}/`;
  return `${base}${folder}${rest}`;
}
