import { existsSync } from 'node:fs';
import path from 'node:path';
import { IMAGE_FORMATS, portraitFile, portraitWidths, shareFile, variantFile, variantWidths } from '../utils/images.ts';
import { loadCatalog } from './catalog.ts';
import { CONTENT_DIR, displayPath, type ContentProblem } from './files.ts';
import { loadGuides } from './guides.ts';
import { isPhoto, type ContentImage, type Photo } from './images.ts';
import { aboutCopyFile, homeCopyFile, loadAboutCopy, loadHomeCopy, loadPlannerCopy, loadToursCopy, plannerCopyFile, toursCopyFile } from './pages.ts';

/** Where the site's static files live; `pnpm images` writes the variants here (ADR-0015). */
export const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * One photo used in content: where it's set, whether it's a page's share image (it gets a share
 * crop), and whether it's a full-bleed hero that phones see upright (it gets portrait crops, ADR-0033).
 */
export type PhotoUse = { file: string; field: string; photo: Photo; share: boolean; portrait: boolean };

/** Every photo in content (placeholders aren't files yet), with the file and field it's set in. */
export function contentPhotos(dir = CONTENT_DIR): PhotoUse[] {
  const catalog = loadCatalog(dir);
  const guides = loadGuides(dir);
  const home = loadHomeCopy(dir);
  const tours = loadToursCopy(dir);
  const about = loadAboutCopy(dir);
  const planner = loadPlannerCopy(dir);
  const uses: { file: string; field: string; image: ContentImage; share?: boolean; portrait?: boolean }[] = [
    ...(home.data ? [{ file: displayPath(homeCopyFile(dir)), field: 'hero.image', image: home.data.hero.image, share: true, portrait: true }] : []),
    ...(tours.data ? [{ file: displayPath(toursCopyFile(dir)), field: 'banner.image', image: tours.data.banner.image }] : []),
    // The About header's photo is its full-bleed cover and share image.
    ...(about.data
      ? [{ file: displayPath(aboutCopyFile(dir)), field: 'header.image', image: about.data.header.image, share: true, portrait: true }]
      : []),
    // The planner's photo band is also its share image; the postcard's photo until a destination is chosen; the "Help me choose" card's.
    // The band is about square on a phone (390×360), where a portrait crop would zoom in, so it keeps the landscape photo.
    ...(planner.data
      ? [
          { file: displayPath(plannerCopyFile(dir)), field: 'header.image', image: planner.data.header.image, share: true },
          { file: displayPath(plannerCopyFile(dir)), field: 'aside.image', image: planner.data.aside.image },
          { file: displayPath(plannerCopyFile(dir)), field: 'whereWhen.destinations.unsureImage', image: planner.data.whereWhen.destinations.unsureImage },
        ]
      : []),
    ...(about.data?.vehicles.items ?? []).map((v, i) => ({ file: displayPath(aboutCopyFile(dir)), field: `vehicles.items.${i}.image`, image: v.image })),
    // A tour's photo is its page's hero and share image.
    ...catalog.tours.map((t) => ({ file: catalog.tourFiles[t.slug], field: 'image', image: t.image, share: true, portrait: true })),
    ...catalog.tours.flatMap((t) => t.highlights.map((h, i) => ({ file: catalog.tourFiles[t.slug], field: `highlights.${i}.image`, image: h.image }))),
    ...catalog.tours.flatMap((t) => t.stays.map((s, i) => ({ file: catalog.tourFiles[t.slug], field: `stays.${i}.image`, image: s.image }))),
    // A destination's photo is its page's hero and share image.
    ...catalog.destinations.map((d) => ({ file: catalog.destinationFiles[d.slug], field: 'image', image: d.image, share: true, portrait: true })),
    ...catalog.destinations.flatMap((d) => (d.places ?? []).map((p, i) => ({ file: catalog.destinationFiles[d.slug], field: `places.${i}.image`, image: p.image }))),
    ...guides.items.map((g) => ({ file: guides.files[g.slug], field: 'portrait', image: g.portrait })),
  ];
  return uses.flatMap(({ image, share = false, portrait = false, ...use }) => (isPhoto(image) ? [{ ...use, photo: image, share, portrait }] : []));
}

/** The source file of a photo: "/images/hunza/attabad.jpg" is content/images/hunza/attabad.jpg. */
export function sourceFile(photo: Photo, dir = CONTENT_DIR): string {
  return path.join(dir, photo.src);
}

/** Every generated file a photo needs: each width in each format, plus the share crop and the portrait crops for heroes. */
export function generatedFiles({ photo, share, portrait }: Pick<PhotoUse, 'photo' | 'share' | 'portrait'>): string[] {
  const variants = variantWidths(photo.width).flatMap((w) => IMAGE_FORMATS.map((f) => variantFile(photo.src, w, f)));
  const portraits = portrait ? portraitWidths(photo).flatMap((w) => IMAGE_FORMATS.map((f) => portraitFile(photo.src, w, f))) : [];
  return [...variants, ...(share ? [shareFile(photo.src)] : []), ...portraits];
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
