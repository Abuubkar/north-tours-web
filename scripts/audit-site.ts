// `pnpm audit:site` (PRD #94, ADR-0021): builds the site, serves the static export locally and
// checks every built page: Lighthouse (LCP, CLS, TBT), axe at 390 and 1440, and the page checks.
// Prints one Markdown table and fails on any miss. Run on demand; never in `pnpm test` or the
// pre-commit hook.
//
// `--origin https://abuubkar.github.io/north-tours-web` audits a live site instead (ADR-0032): it
// builds for that address's path, so the page list and the checks match what's deployed, and
// loads every page from there rather than the local server.
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import { auditReport, auditTarget, builtPages, htmlTitle, judgeSite, medianVitals, overLimit, pageUrl, sitemapFailures, sitemapLocs, type AuditTarget, type PageAudit } from '../lib/utils/audit.ts';
import { getSettings } from '../lib/content/settings.ts';
import { inspectPage, WIDTHS } from './audit/inspect.ts';
import { startLighthouse } from './audit/lighthouse.ts';
import { serveExport } from './audit/serve.ts';

/** Runs for a page over a limit: it's measured this many times and judged on the median. */
const RUNS_OVER_LIMIT = 3;

const OUT = path.join(process.cwd(), 'out');

const log = (line: string) => process.stderr.write(`${line}\n`);

const { values: args } = parseArgs({ options: { origin: { type: 'string' } } });
const live = args.origin === undefined ? null : auditTarget(args.origin);
const basePath = live?.basePath ?? '';

log(`audit:site: building${basePath ? ` for ${basePath}` : ''}`);
execSync('pnpm build', { stdio: ['ignore', 'ignore', 'inherit'], env: live ? { ...process.env, BASE_PATH: basePath } : process.env });

const files = readdirSync(OUT, { recursive: true, encoding: 'utf8' }).map((file) => file.replaceAll(path.sep, '/'));
const site = { files: new Set(files.map((file) => `/${file}`)), url: getSettings().site.url, basePath };
const pages = builtPages(files);

const sitemapFile = path.join(OUT, 'sitemap.xml');
const sitemap = sitemapLocs(existsSync(sitemapFile) ? readFileSync(sitemapFile, 'utf8') : null);
const siteFailures = sitemapFailures(sitemap, pages, site);
const audits: PageAudit[] = [];
// A live site needs no local server; the local one serves the export at its root.
const server = live ? null : await serveExport(OUT);
const target: AuditTarget = live ?? { origin: server!.origin, basePath };
const urlFor = (page: string) => pageUrl(page, target);
const browserArgs = server?.browserArgs ?? [];
const closeServer = async () => server?.close();
// The story tests' Chromium (ADR-0012), in the same full browser Lighthouse uses.
const browser = await chromium.launch({ channel: 'chromium', args: browserArgs }).catch(async (error) => {
  await closeServer();
  throw error;
});
const lighthouse = await startLighthouse(browserArgs).catch(async (error) => {
  await Promise.allSettled([browser.close(), closeServer()]);
  throw error;
});
try {
  const probe = await browser.newPage();
  const unknown = (await probe.goto(urlFor('/no-such-page-audit')))!;
  const notFound = readFileSync(path.join(OUT, '404.html'), 'utf8');
  const body = await unknown.text();
  // A live site was built separately (each build has its own id), so only its 404 page's title can match.
  const isNotFound = live ? htmlTitle(body) === htmlTitle(notFound) : body === notFound;
  if (unknown.status() !== 404 || !isNotFound) {
    siteFailures.push(`An unknown path got status ${unknown.status()}${unknown.status() === 404 ? ' but not the 404 page' : ', not 404'}`);
  }
  await probe.close();

  for (const page of pages) {
    log(`audit:site: ${page}`);
    const inspected = [];
    for (const width of WIDTHS) inspected.push(await inspectPage(browser, urlFor(page), width));
    const runs = [];
    try {
      runs.push(await lighthouse.measure(urlFor(page)));
      if (overLimit(runs[0])) {
        while (runs.length < RUNS_OVER_LIMIT) runs.push(await lighthouse.measure(urlFor(page)));
      }
    } catch (error) {
      log(`audit:site: ${(error as Error).message}`);
    }
    audits.push({
      page,
      vitals: runs.length > 0 ? medianVitals(runs) : null,
      runs: runs.length,
      facts: inspected.map((i) => i.facts),
      violations: inspected.flatMap((i) => i.violations),
    });
  }
} finally {
  await Promise.allSettled([lighthouse.close(), browser.close(), closeServer()]);
}

const verdicts = judgeSite(audits, site);
console.log(auditReport(verdicts));
if (siteFailures.length > 0) console.log(`\nSite checks failed:\n${siteFailures.map((f) => `- ${f}`).join('\n')}`);

const failed = siteFailures.length > 0 || verdicts.some((verdict) => verdict.failures.length > 0);
log(failed ? 'audit:site: failed' : 'audit:site: every page passes');
process.exit(failed ? 1 : 0);
