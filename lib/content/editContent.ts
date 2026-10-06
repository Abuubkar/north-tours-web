// Reading and saving content by content id, for edit mode (ADR-0034). The edit server
// (scripts/edit/server.ts) calls these; they hold the rules: what's editable, and how a save is
// checked and undone.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { COLLECTIONS, contentId, parseContentId, RESERVED_FILES } from '../utils/contentIds.ts';
import type { ContentEntry } from '../utils/contentMatch.ts';
import { jsonStringAt, jsonStrings, replaceJsonString } from '../utils/jsonStrings.ts';
import { checkContent } from './check.ts';
import { CONTENT_DIR, formatProblems, type ContentProblem } from './files.ts';

/** Keys whose strings aren't page text: paths, slugs, ids, links, and alt text (out of scope for edit mode). */
const NOT_TEXT = new Set(['src', 'slug', 'id', 'href', 'url', 'alt']);

const isText = (keys: (string | number)[]) => !NOT_TEXT.has(String(keys.at(-1)));

/** Every content file content ids cover, relative to the content folder. */
function contentFiles(dir: string): string[] {
  const jsonIn = (folder: string) =>
    existsSync(path.join(dir, folder))
      ? readdirSync(path.join(dir, folder))
          .filter((file) => file.endsWith('.json'))
          .map((file) => `${folder}/${file}`)
      : [];
  return [...jsonIn('pages'), ...Object.values(COLLECTIONS).flatMap(jsonIn), ...Object.values(RESERVED_FILES).filter((file) => existsSync(path.join(dir, file)))];
}

/** Every string shown as text in content, by content id. */
export function contentIndex(dir = CONTENT_DIR): ContentEntry[] {
  return contentFiles(dir).flatMap((file) =>
    jsonStrings(readFileSync(path.join(dir, file), 'utf8'))
      .filter(({ path: keys }) => isText(keys))
      .flatMap(({ path: keys, value }) => {
        const id = contentId(file, keys);
        return id ? [{ id, value }] : [];
      }),
  );
}

export type SaveResult = { status: 200 | 400 | 404 | 409 | 422; body: Record<string, unknown> };

/**
 * Saves `value` as the string `id` names, if it still reads `expected` (so a page loaded before
 * another edit can't overwrite it). Only the value's characters change in the file. If the edit
 * makes content invalid (the same check as `pnpm content:check`), the file is put back.
 */
export function saveEdit(id: string, expected: string, value: string, dir = CONTENT_DIR): SaveResult {
  const location = parseContentId(id);
  const file = location && path.join(dir, location.file);
  if (!location || !file || !file.startsWith(dir + path.sep) || !existsSync(file)) {
    return { status: 404, body: { message: `No content file for “${id}”.` } };
  }
  if (!isText(location.path)) return { status: 400, body: { message: `“${id}” isn’t text edit mode can change.` } };
  const before = readFileSync(file, 'utf8');
  const current = jsonStringAt(before, location.path);
  if (!current) return { status: 404, body: { message: `No text at “${id}”.` } };
  if (current.value !== expected) {
    return { status: 409, body: { message: 'This text was changed since the page loaded. Reload the page and try again.', current: current.value } };
  }
  if (value === expected) return { status: 200, body: { id, file: location.file, changed: false } };
  const shown = (problem: ContentProblem) => formatProblems([problem]);
  const already = new Set(checkContent(dir).map(shown));
  writeFileSync(file, replaceJsonString(before, location.path, value));
  const problems = checkContent(dir)
    .map(shown)
    .filter((line) => !already.has(line));
  if (problems.length > 0) {
    writeFileSync(file, before);
    return { status: 422, body: { message: 'Not saved: the edit makes content invalid.', problems: problems.map((line) => line.trim()) } };
  }
  return { status: 200, body: { id, file: location.file, changed: true } };
}
