// The edit server for `pnpm content:edit` (ADR-0034): serves the edit-mode overlay to the dev site, lists
// content's strings by content id, and saves an edit into its content file. Local only: it listens
// on 127.0.0.1 and takes requests from a localhost page alone.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import { checkContent } from '../../lib/content/check.ts';
import { CONTENT_DIR, formatProblems, type ContentProblem } from '../../lib/content/files.ts';
import { COLLECTIONS, contentId, parseContentId, RESERVED_FILES } from '../../lib/utils/contentIds.ts';
import type { ContentEntry } from '../../lib/utils/contentMatch.ts';
import { jsonStringAt, jsonStrings, replaceJsonString } from '../../lib/utils/jsonStrings.ts';

const ROOT = process.cwd();
/** The browser modules the server may send: the overlay and the matching it shares with the tests. */
const BROWSER_MODULES = new Set(['scripts/edit/overlay.ts', 'lib/utils/contentMatch.ts']);
/** Keys whose strings are never shown as text: paths, slugs, ids and links. */
const NOT_TEXT = new Set(['src', 'slug', 'id', 'href', 'url']);
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

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
      .filter(({ path: keys }) => !NOT_TEXT.has(String(keys.at(-1))))
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

/** A browser module, types stripped, its relative `.ts` imports pointed back at this server. */
function browserModule(file: string): string {
  const code = stripTypeScriptTypes(readFileSync(path.join(ROOT, file), 'utf8'));
  return code.replace(/from '(\.{1,2}\/[^']+\.ts)'/g, (_, specifier: string) => {
    const target = path.relative(ROOT, path.resolve(path.dirname(path.join(ROOT, file)), specifier));
    return `from '/module/${target}'`;
  });
}

function send(response: ServerResponse, status: number, type: string, body: string) {
  response.writeHead(status, { 'content-type': `${type}; charset=utf-8`, 'cache-control': 'no-store' });
  response.end(body);
}

const sendJson = (response: ServerResponse, status: number, body: unknown) => send(response, status, 'application/json', JSON.stringify(body));

async function readBody(request: IncomingMessage): Promise<unknown> {
  let text = '';
  for await (const chunk of request) text += chunk;
  return JSON.parse(text);
}

/** Starts the edit server on 127.0.0.1 and resolves with its origin, e.g. "http://127.0.0.1:4310". */
export function startEditServer(port: number, dir = CONTENT_DIR): Promise<{ origin: string; close: () => void }> {
  const server = createServer(async (request, response) => {
    const origin = request.headers.origin;
    if (origin && !LOCAL_ORIGIN.test(origin)) return send(response, 403, 'text/plain', 'Edit mode only serves local pages.');
    if (origin) {
      response.setHeader('access-control-allow-origin', origin);
      response.setHeader('access-control-allow-headers', 'content-type');
      response.setHeader('vary', 'origin');
    }
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    try {
      if (request.method === 'OPTIONS') return send(response, 204, 'text/plain', '');
      if (request.method === 'GET' && url.pathname === '/overlay.js') return send(response, 200, 'text/javascript', browserModule('scripts/edit/overlay.ts'));
      if (request.method === 'GET' && url.pathname.startsWith('/module/')) {
        const file = url.pathname.slice('/module/'.length);
        if (!BROWSER_MODULES.has(file)) return send(response, 404, 'text/plain', 'Not found');
        return send(response, 200, 'text/javascript', browserModule(file));
      }
      if (request.method === 'GET' && url.pathname === '/content') return sendJson(response, 200, contentIndex(dir));
      if (request.method === 'POST' && url.pathname === '/save') {
        if (!origin) return send(response, 403, 'text/plain', 'Edit mode only takes edits from a local page.');
        const { id, expected, value } = (await readBody(request)) as Record<string, unknown>;
        if (typeof id !== 'string' || typeof expected !== 'string' || typeof value !== 'string') {
          return sendJson(response, 400, { message: 'An edit needs an id, the text it replaces, and the new text.' });
        }
        const result = saveEdit(id, expected, value, dir);
        if (result.status === 200 && result.body.changed) console.log(`edit mode: saved ${id} (content/${result.body.file})`);
        return sendJson(response, result.status, result.body);
      }
      send(response, 404, 'text/plain', 'Not found');
    } catch (error) {
      sendJson(response, 500, { message: (error as Error).message });
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${port}`, close: () => server.close() }));
  });
}
