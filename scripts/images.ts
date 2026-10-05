// `pnpm images`: writes every photo's variants, the hero share crops (ADR-0015) and the heroes'
// portrait crops for phones (ADR-0033). Up-to-date files are skipped, so a second run changes nothing.
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp, { type Sharp } from 'sharp';
import { displayPath } from '../lib/content/files.ts';
import { contentPhotos, PUBLIC_DIR, sourceFile, type PhotoUse } from '../lib/content/imageFiles.ts';
import {
  coverCrop,
  IMAGE_FORMATS,
  portraitCrop,
  portraitFile,
  portraitWidths,
  SHARE_IMAGE,
  shareFile,
  variantFile,
  variantWidths,
  type ImageFormat,
} from '../lib/utils/images.ts';

/** Quality per format, chosen for photos on mid-range phones over mobile data. */
const encode = {
  avif: (image: Sharp) => image.avif({ quality: 50, effort: 4 }),
  webp: (image: Sharp) => image.webp({ quality: 64, effort: 5 }),
  jpg: (image: Sharp) => image.jpeg({ quality: 76, mozjpeg: true }),
} satisfies Record<ImageFormat, (image: Sharp) => Sharp>;

/**
 * The portrait crops' encoding (ADR-0033): AVIF, which nearly every phone loads, at a lower
 * quality, so the phone's hero file is no heavier than the landscape one it replaces while it
 * carries more than twice the detail. WebP and JPEG, only for browsers without AVIF, keep theirs.
 */
const encodePortrait = {
  ...encode,
  avif: (image: Sharp) => image.avif({ quality: 34, effort: 4 }),
} satisfies Record<ImageFormat, (image: Sharp) => Sharp>;

const mtime = (file: string) => {
  try {
    return statSync(file).mtimeMs;
  } catch {
    return -1;
  }
};

function write(file: string, data: Buffer) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, data);
}

/** Writes the variants older than the source; returns how many were written. */
async function writeVariants({ photo }: PhotoUse, source: string): Promise<number> {
  let written = 0;
  for (const width of variantWidths(photo.width)) {
    for (const format of IMAGE_FORMATS) {
      const out = path.join(PUBLIC_DIR, variantFile(photo.src, width, format));
      if (mtime(out) >= mtime(source)) continue;
      write(out, await encode[format](sharp(source).resize({ width })).toBuffer());
      written++;
    }
  }
  return written;
}

/** Writes the 1200×630 share crop at the photo's focus, if it changed (the focus can change alone). */
async function writeShareCrop({ photo }: PhotoUse, source: string): Promise<number> {
  const { resize, extract } = coverCrop(photo, SHARE_IMAGE, photo.focus);
  const data = await encode.jpg(sharp(source).resize(resize).extract(extract)).toBuffer();
  const out = path.join(PUBLIC_DIR, shareFile(photo.src));
  if (mtime(out) >= 0 && readFileSync(out).equals(data)) return 0;
  write(out, data);
  return 1;
}

/** Writes the hero's portrait crops at the photo's focus (ADR-0033), each one that changed (the focus can change alone). */
async function writePortraits({ photo }: PhotoUse, source: string): Promise<number> {
  const region = portraitCrop(photo);
  let written = 0;
  for (const width of portraitWidths(photo)) {
    for (const format of IMAGE_FORMATS) {
      const data = await encodePortrait[format](sharp(source).extract(region).resize({ width })).toBuffer();
      const out = path.join(PUBLIC_DIR, portraitFile(photo.src, width, format));
      if (mtime(out) >= 0 && readFileSync(out).equals(data)) continue;
      write(out, data);
      written++;
    }
  }
  return written;
}

async function main() {
  // One entry per source photo; a photo used as a page's share image anywhere gets a share crop, and as a hero portrait crops.
  const bySrc = new Map<string, PhotoUse>();
  for (const use of contentPhotos()) {
    const seen = bySrc.get(use.photo.src);
    bySrc.set(use.photo.src, seen ? { ...seen, share: seen.share || use.share, portrait: seen.portrait || use.portrait } : use);
  }

  const problems: string[] = [];
  let written = 0;
  for (const use of bySrc.values()) {
    const source = sourceFile(use.photo);
    const where = `${use.file} › ${use.field}`;
    if (mtime(source) < 0) {
      problems.push(`${where}: no source photo at ${displayPath(source)}`);
      continue;
    }
    const { width, height } = await sharp(source).metadata();
    if (width !== use.photo.width || height !== use.photo.height) {
      problems.push(`${where}: the photo is ${width}×${height}; content says ${use.photo.width}×${use.photo.height}`);
      continue;
    }
    written += await writeVariants(use, source);
    if (use.share) written += await writeShareCrop(use, source);
    if (use.portrait) written += await writePortraits(use, source);
  }

  console.log(`Images: ${bySrc.size} photos, ${written} files written.`);
  if (problems.length > 0) {
    console.error(`Problems (${problems.length}):\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
}

await main();
