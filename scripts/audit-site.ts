// `pnpm audit:site` (PRD #94, ADR-0021): builds the site, serves the static export locally and
// checks every built page: Lighthouse (LCP, CLS, TBT), axe at 390 and 1440, and the page checks.
// Prints one Markdown table and fails on any miss. Run on demand; never in `pnpm test` or the
// pre-commit hook.
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { auditReport, builtPages, judgeSite, medianVitals, overLimit, type PageAudit } from '../lib/utils/audit.ts';
import { inspectPage, WIDTHS } from './audit/inspect.ts';
import { startLighthouse } from './audit/lighthouse.ts';
import { serveExport } from './audit/serve.ts';

/** Runs for a page over a limit: it's measured this many times and judged on the median. */
const RUNS_OVER_LIMIT = 3;

const OUT = path.join(process.cwd(), 'out');

const log = (line: string) => process.stderr.write(`${line}\n`);

log('audit:site: building');
execSync('pnpm build', { stdio: ['ignore', 'ignore', 'inherit'] });

const files = readdirSync(OUT, { recursive: true, encoding: 'utf8' }).map((file) => file.replaceAll(path.sep, '/'));
const buildFiles = new Set(files.map((file) => `/${file}`));
const pages = builtPages(files);

const siteFailures: string[] = [];
const audits: PageAudit[] = [];
const server = await serveExport(OUT);
const urlFor = (page: string) => `${server.origin}${page}`;
// The story tests' Chromium (ADR-0012), in the same full browser Lighthouse uses.
const browser = await chromium.launch({ channel: 'chromium' }).catch(async (error) => {
  await server.close();
  throw error;
});
const lighthouse = await startLighthouse().catch(async (error) => {
  await Promise.allSettled([browser.close(), server.close()]);
  throw error;
});
try {
  const unknown = await fetch(urlFor('/no-such-page-audit'));
  const notFound = readFileSync(path.join(OUT, '404.html'), 'utf8');
  if (unknown.status !== 404 || (await unknown.text()) !== notFound) {
    siteFailures.push(`An unknown path got status ${unknown.status}${unknown.status === 404 ? ' but not the 404 page' : ', not 404'}`);
  }

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
  await Promise.allSettled([lighthouse.close(), browser.close(), server.close()]);
}

const verdicts = judgeSite(audits, buildFiles);
console.log(auditReport(verdicts));
if (siteFailures.length > 0) console.log(`\nSite checks failed:\n${siteFailures.map((f) => `- ${f}`).join('\n')}`);

const failed = siteFailures.length > 0 || verdicts.some((verdict) => verdict.failures.length > 0);
log(failed ? 'audit:site: failed' : 'audit:site: every page passes');
process.exit(failed ? 1 : 0);
