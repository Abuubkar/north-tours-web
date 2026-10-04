// A small static server for `pnpm audit:site`, as a static host would serve the export: `/path`
// serves `path.html`, `/` serves `index.html`, anything else `404.html` with status 404. Text is
// gzipped, as any host does, so load times read as they will live.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const COMPRESSED = /^(text\/|application\/(json|xml)|image\/svg)/;

const isFile = (file: string) => existsSync(file) && statSync(file).isFile();

/** The file a request path serves, or null for the 404 page. */
function fileFor(root: string, pathname: string): string | null {
  const wanted = path.normalize(path.join(root, decodeURIComponent(pathname)));
  if (!wanted.startsWith(root)) return null;
  for (const candidate of [wanted, `${wanted.replace(/\/$/, '')}.html`, path.join(wanted, 'index.html')]) {
    if (isFile(candidate)) return candidate;
  }
  return null;
}

/** Serves the export in `root` on a free localhost port. */
export async function serveExport(root: string): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    const file = fileFor(root, pathname);
    const served = file ?? path.join(root, '404.html');
    const type = TYPES[path.extname(served)] ?? 'application/octet-stream';
    let body = readFileSync(served);
    const headers: Record<string, string> = { 'Content-Type': type };
    if (COMPRESSED.test(type) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
    }
    response.writeHead(file ? 200 : 404, { ...headers, 'Content-Length': String(body.length) });
    response.end(request.method === 'HEAD' ? undefined : body);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
