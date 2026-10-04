import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkContent } from './check.ts';
import { checkPhotoFiles, contentPhotos, generatedFiles } from './imageFiles.ts';
import { homeCopyFile, type HomeCopy } from './pages.ts';
import { contentFixture } from './testing.ts';

const home: HomeCopy = JSON.parse(readFileSync(homeCopyFile(), 'utf8'));
const photo = { ...home.hero.image, src: '/images/test/valley.jpg', width: 900, height: 600 };

/** Content holding only the home copy, with its hero photo's source file. */
function content() {
  return contentFixture({ 'pages/home.json': { ...home, hero: { ...home.hero, image: photo } }, 'images/test/valley.jpg': 'jpg' });
}

/** A public folder holding the given generated files. */
function publicDir(files: string[]) {
  const dir = mkdtempSync(path.join(tmpdir(), 'public-'));
  for (const file of files) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), '');
  }
  return dir;
}

describe('photo files', () => {
  const needed = generatedFiles({ photo, share: true });

  it('needs each width up to the photo’s, in AVIF, WebP and JPEG, plus a hero’s share crop', () => {
    expect(needed).toEqual([
      '/images/test/valley-480.avif',
      '/images/test/valley-480.webp',
      '/images/test/valley-480.jpg',
      '/images/test/valley-800.avif',
      '/images/test/valley-800.webp',
      '/images/test/valley-800.jpg',
      '/images/test/valley-share.jpg',
    ]);
  });

  it('passes when every file is there', () => {
    expect(checkPhotoFiles(content(), publicDir(needed))).toEqual([]);
  });

  it('fails when a variant is missing, naming the file and field', () => {
    const problems = checkPhotoFiles(content(), publicDir(needed.slice(1)));
    expect(problems).toEqual([
      expect.objectContaining({ field: 'hero.image.src', message: expect.stringContaining('run pnpm images') }),
    ]);
    expect(problems[0].file).toMatch(/pages\/home\.json$/);
  });

  it('fails when the source photo is missing', () => {
    const dir = contentFixture({ 'pages/home.json': { ...home, hero: { ...home.hero, image: photo } } });
    expect(checkPhotoFiles(dir, publicDir(needed))[0].message).toMatch(/^No source photo at /);
  });

  it('lists the photos in the live content', () => {
    expect(contentPhotos().map((use) => use.field)).toContain('hero.image');
  });

  it('gives each tour’s photo a share crop: it’s the tour page’s share image', () => {
    const tourPhotos = contentPhotos().filter((use) => /tours\/[a-z-]+\.json$/.test(use.file) && use.field === 'image');
    expect(tourPhotos.length).toBeGreaterThan(0);
    for (const use of tourPhotos) expect(use.share).toBe(true);
  });

  it('lists each tour’s highlight and stay photos, without share crops', () => {
    for (const kind of ['highlights.', 'stays.']) {
      const uses = contentPhotos().filter((use) => use.field.startsWith(kind));
      expect(uses.length).toBeGreaterThan(0);
      for (const use of uses) expect(use.share).toBe(false);
    }
  });
});

describe('checkContent', () => {
  it('passes on the live content, generated images included', () => {
    expect(checkContent()).toEqual([]);
  });
});
