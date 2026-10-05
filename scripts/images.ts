// `pnpm images`: writes every photo's variants and the hero share crops (ADR-0015).
// Up-to-date files are skipped, so a second run changes nothing.
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp, { type Sharp } from 'sharp';
import { displayPath } from '../lib/content/files.ts';
import { contentPhotos, PUBLIC_DIR, sourceFile, type PhotoUse } from '../lib/content/imageFiles.ts';
import { coverCrop, IMAGE_FORMATS, SHARE_IMAGE, shareFile, variantFile, variantWidths, type ImageFormat } from '../lib/utils/images.ts';

/** Quality per format, chosen for photos on mid-range phones over mobile data. */
const encode = {
  avif: (image: Sharp) => image.avif({ quality: 50, effort: 4 }),
  webp: (image: Sharp) => image.webp({ quality: 64, effort: 5 }),
  jpg: (image: Sharp) => image.jpeg({ quality: 76, mozjpeg: true }),
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

async function main() {
  // One entry per source photo; a photo used as a page hero anywhere gets a share crop.
  const bySrc = new Map<string, PhotoUse>();
  for (const use of contentPhotos()) {
    const seen = bySrc.get(use.photo.src);
    bySrc.set(use.photo.src, seen ? { ...seen, share: seen.share || use.share } : use);
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
  }

  console.log(`Images: ${bySrc.size} photos, ${written} files written.`);
  if (problems.length > 0) {
    console.error(`Problems (${problems.length}):\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
}

await main();
