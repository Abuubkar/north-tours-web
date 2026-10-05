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
  const needed = generatedFiles({ photo, share: true, portrait: true });

  it('needs each width up to the photo’s, in AVIF, WebP and JPEG, plus a hero’s share crop and portrait crop', () => {
    expect(needed).toEqual([
      '/images/test/valley-480.avif',
      '/images/test/valley-480.webp',
      '/images/test/valley-480.jpg',
      '/images/test/valley-800.avif',
      '/images/test/valley-800.webp',
      '/images/test/valley-800.jpg',
      '/images/test/valley-share.jpg',
      // 900×600 holds a 400×600 portrait crop: one width, never enlarged.
      '/images/test/valley-portrait-400.avif',
      '/images/test/valley-portrait-400.webp',
      '/images/test/valley-portrait-400.jpg',
    ]);
  });

  it('needs no portrait crop for a photo that isn’t a hero', () => {
    expect(generatedFiles({ photo, share: false, portrait: false }).some((file) => file.includes('-portrait-'))).toBe(false);
  });

  it('fails when a hero’s portrait crop is missing', () => {
    const problems = checkPhotoFiles(content(), publicDir(needed.filter((file) => !file.endsWith('-portrait-400.avif'))));
    expect(problems).toEqual([expect.objectContaining({ field: 'hero.image.src', message: expect.stringContaining('valley-portrait-400.avif') })]);
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

  it('gives the About header’s photo a share crop: it’s the page’s share image', () => {
    const about = contentPhotos().find((use) => /pages\/about\.json$/.test(use.file) && use.field === 'header.image');
    expect(about?.share).toBe(true);
  });

  it('lists each tour’s highlight and stay photos, without share or portrait crops', () => {
    for (const kind of ['highlights.', 'stays.']) {
      const uses = contentPhotos().filter((use) => use.field.startsWith(kind));
      expect(uses.length).toBeGreaterThan(0);
      for (const use of uses) {
        expect(use.share).toBe(false);
        expect(use.portrait).toBe(false);
      }
    }
  });
});

describe('the hero photos (portrait crops, ADR-0033)', () => {
  const heroes = contentPhotos().filter((use) => use.portrait);
  const isHero = (file: RegExp, field: string) => heroes.some((use) => file.test(use.file) && use.field === field);

  it('are the Homepage hero, About’s cover and every tour and destination photo, found in content', () => {
    expect(isHero(/pages\/home\.json$/, 'hero.image')).toBe(true);
    expect(isHero(/pages\/about\.json$/, 'header.image')).toBe(true);
    const pagePhotos = contentPhotos().filter((use) => /(tours|destinations)\/[a-z-]+\.json$/.test(use.file) && use.field === 'image');
    expect(pagePhotos.length).toBeGreaterThan(0);
    for (const use of pagePhotos) expect(use.portrait).toBe(true);
  });

  it('leave out the planner’s band, about square on a phone, though it’s a share image', () => {
    const band = contentPhotos().find((use) => /pages\/planner\.json$/.test(use.file) && use.field === 'header.image');
    expect(band).toMatchObject({ share: true, portrait: false });
  });

  it('are only photos shown full-bleed: nothing else gets a portrait crop', () => {
    expect(heroes.every((use) => ['hero.image', 'header.image', 'image'].includes(use.field))).toBe(true);
  });
});

describe('checkContent', () => {
  it('passes on the live content, generated images included', () => {
    expect(checkContent()).toEqual([]);
  });
});
