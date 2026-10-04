// A small static server for `pnpm audit:site`, as a static host would serve the export: `/path`
// serves `path.html`, `/` serves `index.html`, anything else `404.html` with status 404. Like any
// host, it serves HTTP/2 over TLS and gzips text, so load times read as they will live: Lighthouse
// models a page loaded over HTTP/1.1 with up to six connections, each with its own slow start,
// which reads LCP up to a second slower than the same page from a real host.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createSecureServer } from 'node:http2';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
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

/** The file a request path serves, or null for the 404 page: `/path` is `path.html`, a folder its `index.html`. */
function fileFor(root: string, pathname: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const wanted = path.join(root, decoded);
  const inside = (file: string) => !path.relative(root, file).startsWith('..');
  const candidates = decoded.endsWith('/') ? [path.join(wanted, 'index.html')] : [wanted, `${wanted}.html`];
  return candidates.find((file) => inside(file) && isFile(file)) ?? null;
}

/** Each file's body, gzipped once for every request that accepts it. */
const gzipped = new Map<string, Buffer>();

/**
 * A throwaway certificate for localhost, made with the system's `openssl` (no dependency). The
 * browsers that load the site are started to accept it.
 */
function localCertificate(): { key: Buffer; cert: Buffer } {
  const dir = mkdtempSync(path.join(tmpdir(), 'audit-tls-'));
  const key = path.join(dir, 'key.pem');
  const cert = path.join(dir, 'cert.pem');
  try {
    const args = ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert, '-days', '1', '-subj', '/CN=localhost'];
    execFileSync('openssl', args, { stdio: 'ignore' });
    return { key: readFileSync(key), cert: readFileSync(cert) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Chromium flag for the throwaway certificate; only ever passed to the audit's own browsers. */
export const ACCEPT_LOCAL_CERTIFICATE = '--ignore-certificate-errors';

/** Serves the export in `root` on a free localhost port, over HTTP/2 with TLS. */
export async function serveExport(root: string): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = createSecureServer({ ...localCertificate(), allowHTTP1: true }, (request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    const file = fileFor(root, pathname);
    const served = file ?? path.join(root, '404.html');
    const type = TYPES[path.extname(served)] ?? 'application/octet-stream';
    let body: Buffer = readFileSync(served);
    const headers: Record<string, string> = { 'content-type': type };
    if (COMPRESSED.test(type) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '')) {
      if (!gzipped.has(served)) gzipped.set(served, gzipSync(body));
      body = gzipped.get(served)!;
      headers['content-encoding'] = 'gzip';
    }
    response.writeHead(file ? 200 : 404, { ...headers, 'content-length': String(body.length) });
    if (request.method === 'HEAD') response.end();
    else response.end(body);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    origin: `https://localhost:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
