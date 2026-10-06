import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contentIndex, saveEdit } from './editContent.ts';
import { CONTENT_DIR } from './files.ts';

/** A copy of the real content, so a save is checked against every schema and the real files stay untouched. */
function contentCopy(): string {
  const dir = path.join(mkdtempSync(path.join(tmpdir(), 'edit-')), 'content');
  cpSync(CONTENT_DIR, dir, { recursive: true });
  return dir;
}

const read = (dir: string, file: string) => readFileSync(path.join(dir, file), 'utf8');
const lead = (dir: string) => JSON.parse(read(dir, 'pages/home.json')).hero.lead as string;

describe('edit mode content', () => {
  it('indexes page text, collection items and settings by content id, but no paths, slugs, ids or alt text', () => {
    const ids = new Set(contentIndex().map(({ id }) => id));
    expect(ids.has('home.hero.lead')).toBe(true);
    expect(ids.has('tour:hunza-express.title')).toBe(true);
    expect(ids.has('settings.brand.name')).toBe(true);
    expect([...ids].some((id) => /\.(src|slug|id|href|url|alt)$/.test(id))).toBe(false);
  });

  it('saves one value and changes nothing else in the file', () => {
    const dir = contentCopy();
    const before = read(dir, 'pages/home.json');
    const result = saveEdit('home.hero.lead', lead(dir), 'A new lead line.', dir);
    expect(result).toEqual({ status: 200, body: { id: 'home.hero.lead', file: 'pages/home.json', changed: true } });
    expect(read(dir, 'pages/home.json')).toBe(before.replace(JSON.stringify(JSON.parse(before).hero.lead), '"A new lead line."'));
  });

  it('refuses an edit that makes content invalid, and puts the file back', () => {
    const dir = contentCopy();
    const before = read(dir, 'pages/home.json');
    const result = saveEdit('home.hero.lead', lead(dir), '', dir);
    expect(result.status).toBe(422);
    expect(result.body.problems).toEqual([expect.stringMatching(/pages\/home\.json › hero\.lead: Must not be empty$/)]);
    expect(read(dir, 'pages/home.json')).toBe(before);
  });

  it('refuses an edit to text that changed since the page loaded', () => {
    const dir = contentCopy();
    expect(saveEdit('home.hero.lead', 'An older lead.', 'Mine.', dir).status).toBe(409);
  });

  it('refuses ids with no file or no text, and keys that aren’t page text', () => {
    const dir = contentCopy();
    expect(saveEdit('nowhere.title', 'x', 'y', dir).status).toBe(404);
    expect(saveEdit('home.hero.nothing', 'x', 'y', dir).status).toBe(404);
    expect(saveEdit('tour:hunza-express.slug', 'hunza-express', 'other', dir).status).toBe(400);
    expect(saveEdit('constructor.title', 'x', 'y', dir).status).toBe(404);
  });

  it('leaves the file alone when the text is unchanged', () => {
    const dir = contentCopy();
    expect(saveEdit('home.hero.lead', lead(dir), lead(dir), dir).body.changed).toBe(false);
  });
});
