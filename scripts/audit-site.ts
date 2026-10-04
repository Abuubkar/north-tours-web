// `pnpm audit:site` (PRD #94, ADR-0021): builds the site, serves the static export locally and
// checks every built page: Lighthouse (LCP, CLS, TBT), axe at 390 and 1440, and the page checks.
// Prints one Markdown table and fails on any miss. Run on demand; never in `pnpm test` or the
// pre-commit hook.
import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
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
const server = await serveExport(OUT);
const urlFor = (page: string) => `${server.origin}${page}`;

const failures: string[] = [];
const unknown = await fetch(urlFor('/no-such-page-audit'));
if (unknown.status !== 404) failures.push(`An unknown path got status ${unknown.status}, not 404`);

const browser = await chromium.launch();
const lighthouse = await startLighthouse();
const audits: PageAudit[] = [];
try {
  for (const page of pages) {
    log(`audit:site: ${page}`);
    const inspected = [];
    for (const width of WIDTHS) inspected.push(await inspectPage(browser, urlFor(page), width));
    const runs = [await lighthouse.measure(urlFor(page))];
    if (overLimit(runs[0])) {
      while (runs.length < RUNS_OVER_LIMIT) runs.push(await lighthouse.measure(urlFor(page)));
    }
    audits.push({
      page,
      vitals: medianVitals(runs),
      runs: runs.length,
      facts: inspected.map((i) => i.facts),
      violations: inspected.flatMap((i) => i.violations),
    });
  }
} finally {
  await lighthouse.close();
  await browser.close();
  await server.close();
}

const verdicts = judgeSite(audits, buildFiles);
console.log(auditReport(verdicts));
if (failures.length > 0) console.log(`\nSite checks failed:\n${failures.map((f) => `- ${f}`).join('\n')}`);

const failed = failures.length > 0 || verdicts.some((verdict) => verdict.failures.length > 0);
log(failed ? 'audit:site: failed' : 'audit:site: every page passes');
process.exit(failed ? 1 : 0);
