import { existsSync } from 'node:fs';
import path from 'node:path';
import { IMAGE_FORMATS, shareSrc, variantSrc, variantWidths } from '../utils/images.ts';
import { loadCatalog } from './catalog.ts';
import { CONTENT_DIR, displayPath, type ContentProblem } from './files.ts';
import { loadGuides } from './guides.ts';
import type { Image, Photo } from './images.ts';
import { homeCopyFile, loadHomeCopy } from './pages.ts';

/** Where the site's static files live; `pnpm images` writes the variants here (ADR-0015). */
export const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** One photo used in content: where it's set, and whether it's a page hero (it gets a share crop). */
export type PhotoUse = { file: string; field: string; photo: Photo; share: boolean };

const isPhoto = (image: Image): image is Photo => 'src' in image;

/** Every photo in content (placeholders aren't files yet), with the file and field it's set in. */
export function contentPhotos(dir = CONTENT_DIR): PhotoUse[] {
  const catalog = loadCatalog(dir);
  const guides = loadGuides(dir);
  const home = loadHomeCopy(dir);
  const uses: { file: string; field: string; image: Image; share?: boolean }[] = [
    ...(home.data ? [{ file: displayPath(homeCopyFile(dir)), field: 'hero.image', image: home.data.hero.image, share: true }] : []),
    ...catalog.tours.map((t) => ({ file: catalog.tourFiles[t.slug], field: 'image', image: t.image })),
    ...catalog.destinations.map((d) => ({ file: catalog.destinationFiles[d.slug], field: 'image', image: d.image })),
    ...guides.items.map((g) => ({ file: guides.files[g.slug], field: 'portrait', image: g.portrait })),
  ];
  return uses.flatMap(({ image, share = false, ...use }) => (isPhoto(image) ? [{ ...use, photo: image, share }] : []));
}

/** The source file of a photo: "/images/hunza/attabad.jpg" is content/images/hunza/attabad.jpg. */
export function sourceFile(photo: Photo, dir = CONTENT_DIR): string {
  return path.join(dir, photo.src);
}

/** Every generated file a photo needs: each width in each format, plus the share crop for heroes. */
export function generatedFiles({ photo, share }: Pick<PhotoUse, 'photo' | 'share'>): string[] {
  const variants = variantWidths(photo.width).flatMap((w) => IMAGE_FORMATS.map((f) => variantSrc(photo.src, w, f)));
  return share ? [...variants, shareSrc(photo.src)] : variants;
}

/** A problem for each photo whose source or generated files are missing (run `pnpm images`). */
export function checkPhotoFiles(dir = CONTENT_DIR, publicDir = PUBLIC_DIR): ContentProblem[] {
  return contentPhotos(dir).flatMap((use) => {
    const { file, field, photo } = use;
    if (!existsSync(sourceFile(photo, dir))) {
      return [{ file, field: `${field}.src`, message: `No source photo at ${displayPath(sourceFile(photo, dir))}` }];
    }
    const missing = generatedFiles(use).filter((src) => !existsSync(path.join(publicDir, src)));
    if (missing.length === 0) return [];
    return [{ file, field: `${field}.src`, message: `Missing ${missing.length} image variants (run pnpm images), e.g. ${missing[0]}` }];
  });
}
