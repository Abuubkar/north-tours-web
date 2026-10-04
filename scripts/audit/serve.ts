// A small static server for `pnpm audit:site`, as a static host would serve the export: `/path`
// serves `path.html`, `/` serves `index.html`, anything else `404.html` with status 404. Like any
// host, it serves HTTP/2 over TLS and gzips text, so load times read as they will live: Lighthouse
// models a page loaded over HTTP/1.1 with up to six connections, each with its own slow start,
// which reads LCP up to a second slower than the same page from a real host.
import { execFileSync } from 'node:child_process';
import { createHash, X509Certificate } from 'node:crypto';
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

/** The address the server listens on, and the only name its throwaway certificate covers. */
const HOST = '127.0.0.1';

/** A throwaway certificate for this address, made with the system's `openssl` (no npm dependency). */
function localCertificate(): { key: Buffer; cert: Buffer } {
  const dir = mkdtempSync(path.join(tmpdir(), 'audit-tls-'));
  const key = path.join(dir, 'key.pem');
  const cert = path.join(dir, 'cert.pem');
  const args = ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert, '-days', '1', '-subj', `/CN=${HOST}`, '-addext', `subjectAltName=IP:${HOST}`];
  try {
    execFileSync('openssl', args, { stdio: 'pipe' });
    return { key: readFileSync(key), cert: readFileSync(cert) };
  } catch (error) {
    throw new Error(`pnpm audit:site serves the site over HTTPS and needs openssl to make a local certificate: ${(error as Error).message}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * The Chromium flag that trusts this one certificate, by its public key, and nothing else. Only
 * the audit's own browsers get it.
 */
function trustFlag(cert: Buffer): string {
  const spki = new X509Certificate(cert).publicKey.export({ type: 'spki', format: 'der' });
  return `--ignore-certificate-errors-spki-list=${createHash('sha256').update(spki).digest('base64')}`;
}

/**
 * Serves the export in `root` on a free local port, over HTTP/2 with TLS. `browserArgs` are the
 * Chromium flags a browser needs to load it.
 */
export async function serveExport(root: string): Promise<{ origin: string; browserArgs: string[]; close: () => Promise<void> }> {
  const certificate = localCertificate();
  const server = createSecureServer(certificate, (request, response) => {
    const { pathname } = new URL(request.url ?? '/', `https://${HOST}`);
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
  await new Promise<void>((resolve) => server.listen(0, HOST, resolve));
  const { port } = server.address() as AddressInfo;
  return {
    origin: `https://${HOST}:${port}`,
    browserArgs: [trustFlag(certificate.cert)],
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
