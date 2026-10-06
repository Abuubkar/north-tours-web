// The edit server for `pnpm content:edit` (ADR-0034): serves the edit-mode overlay to the dev site, lists
// content's strings by content id, and saves an edit into its content file. Local only: it listens
// on 127.0.0.1 and takes requests from a localhost page alone.
import { readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import { contentIndex, saveEdit } from '../../lib/content/editContent.ts';
import { CONTENT_DIR } from '../../lib/content/files.ts';

const ROOT = process.cwd();
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
/** An edit is a few words; anything bigger isn't one. */
const MAX_BODY = 64 * 1024;
/** The browser modules the server may send: the overlay and the matching it shares with the tests. */
const BROWSER_MODULES = new Set(['scripts/edit/overlay.ts', 'lib/utils/contentMatch.ts']);
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
  for await (const chunk of request) {
    text += chunk;
    if (text.length > MAX_BODY) throw new Error('An edit can’t be that long.');
  }
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
