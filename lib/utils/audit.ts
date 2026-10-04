/*
 * `pnpm audit:site` (PRD #94, ADR-0021): the pure parts. The script builds and serves the site,
 * measures every page and passes the numbers here; these decide what fails and print the table.
 */

/** The quality bar (CLAUDE.md §10): LCP and CLS fail over these; TBT, the lab stand-in for INP, only warns. */
export const LIMITS = { lcp: 2500, cls: 0.1, tbt: 200 } as const;

/** Lighthouse's numbers for one page: LCP and TBT in milliseconds, CLS unitless. */
export type Vitals = { lcp: number; cls: number; tbt: number };

/** What the browser found on a page at one width. */
export type PageFacts = {
  width: number;
  h1s: number;
  /** Empty when the page has none. */
  title: string;
  description: string;
  ogImage: string;
  twitterImage: string;
};

export type AxeViolation = { width: number; rule: string; targets: string[] };

/** Everything measured on one page. `runs` is how many Lighthouse runs `vitals` is the median of. */
export type PageAudit = { page: string; vitals: Vitals; runs: number; facts: PageFacts[]; violations: AxeViolation[] };

export type PageVerdict = { audit: PageAudit; failures: string[]; warnings: string[] };

/** The page a built file serves, or null for Next's internal files: "tours/hunza-express.html" → "/tours/hunza-express". */
function pageFor(file: string): string | null {
  if (!file.endsWith('.html') || file.split('/').some((part) => part.startsWith('_'))) return null;
  const route = file.replace(/\.html$/, '').replace(/(^|\/)index$/, '');
  return `/${route}`;
}

/** Every page in the build, from its files (relative to the export folder): each route, tour, destination and the 404. */
export function builtPages(files: string[]): string[] {
  return [...new Set(files.map((file) => pageFor(file.replaceAll('\\', '/'))).filter((page) => page !== null))].sort();
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** The median of each number across runs, so one noisy run doesn't fail a page. */
export function medianVitals(runs: Vitals[]): Vitals {
  return {
    lcp: median(runs.map((run) => run.lcp)),
    cls: median(runs.map((run) => run.cls)),
    tbt: median(runs.map((run) => run.tbt)),
  };
}

/** True when a page is over a failing limit, so it's run twice more and judged on the median. */
export function overLimit({ lcp, cls }: Vitals): boolean {
  return lcp > LIMITS.lcp || cls > LIMITS.cls;
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(2)} s`;
const shift = (cls: number) => cls.toFixed(3);

/** The path a share image's URL points to, root-relative or absolute. */
const pathOf = (url: string) => new URL(url, 'http://localhost').pathname;

/** The page checks at one width: one `<h1>`, a title, a description and share images in the build. */
function factFailures(facts: PageFacts, buildFiles: ReadonlySet<string>): string[] {
  const at = `${facts.width}px`;
  const failures: string[] = [];
  if (facts.h1s !== 1) failures.push(`${at}: ${facts.h1s === 0 ? 'no <h1>' : `${facts.h1s} <h1>s`}`);
  if (!facts.title) failures.push(`${at}: no <title>`);
  if (!facts.description) failures.push(`${at}: no meta description`);
  for (const [tag, url] of [['og:image', facts.ogImage], ['twitter:image', facts.twitterImage]] as const) {
    if (!url) failures.push(`${at}: no ${tag}`);
    else if (!buildFiles.has(pathOf(url))) failures.push(`${at}: ${tag} ${url} isn’t in the build`);
  }
  return failures;
}

/**
 * Judges every page: LCP over 2.5 s or CLS over 0.1, any axe violation, and any page check
 * failing (exactly one `<h1>`, a `<title>` no other page shares, a meta description, `og:image`
 * and `twitter:image` pointing to a file in the build) fail it. TBT over 200 ms is a warning.
 * `buildFiles` holds the build's files as root-relative paths ("/images/hunza/attabad-share.jpg").
 */
export function judgeSite(audits: PageAudit[], buildFiles: ReadonlySet<string>): PageVerdict[] {
  const pagesByTitle = new Map<string, string[]>();
  for (const { page, facts } of audits) {
    for (const title of new Set(facts.map((f) => f.title).filter(Boolean))) {
      pagesByTitle.set(title, [...(pagesByTitle.get(title) ?? []), page]);
    }
  }

  return audits.map((audit) => {
    const { vitals, facts, violations, page } = audit;
    const failures: string[] = [];
    if (vitals.lcp > LIMITS.lcp) failures.push(`LCP ${seconds(vitals.lcp)} is over ${seconds(LIMITS.lcp)}`);
    if (vitals.cls > LIMITS.cls) failures.push(`CLS ${shift(vitals.cls)} is over ${LIMITS.cls}`);
    for (const { width, rule, targets } of violations) failures.push(`${width}px: axe ${rule} on ${targets.join(', ')}`);
    failures.push(...new Set(facts.flatMap((f) => factFailures(f, buildFiles))));
    for (const title of new Set(facts.map((f) => f.title).filter(Boolean))) {
      const others = (pagesByTitle.get(title) ?? []).filter((other) => other !== page);
      if (others.length > 0) failures.push(`<title> “${title}” is shared with ${others.join(', ')}`);
    }
    const warnings = vitals.tbt > LIMITS.tbt ? [`TBT ${Math.round(vitals.tbt)} ms is over ${LIMITS.tbt} ms (the lab stand-in for INP)`] : [];
    return { audit, failures, warnings };
  });
}

/** How many page checks (not vitals or axe) failed. */
const checkFailures = (verdict: PageVerdict) =>
  verdict.failures.filter((f) => !/^(LCP|CLS) /.test(f) && !/^\d+px: axe /.test(f)).length;

/** One Markdown table row per page, then each failure and warning in detail. */
export function auditReport(verdicts: PageVerdict[]): string {
  const rows = verdicts.map((verdict) => {
    const { page, vitals, runs, violations } = verdict.audit;
    const median = runs > 1 ? ` (median of ${runs})` : '';
    const checks = checkFailures(verdict);
    const result = verdict.failures.length > 0 ? 'fail' : verdict.warnings.length > 0 ? 'pass, TBT warning' : 'pass';
    return `| ${page} | ${seconds(vitals.lcp)}${median} | ${shift(vitals.cls)} | ${Math.round(vitals.tbt)} ms | ${violations.length} | ${checks === 0 ? 'pass' : `${checks} failed`} | ${result} |`;
  });
  const table = ['| Page | LCP | CLS | TBT | Axe violations | Page checks | Result |', '|---|---|---|---|---|---|---|', ...rows].join('\n');
  const list = (title: string, pick: (v: PageVerdict) => string[]) => {
    const lines = verdicts.flatMap((v) => pick(v).map((line) => `- ${v.audit.page}: ${line}`));
    return lines.length > 0 ? [`${title} (${lines.length})\n${lines.join('\n')}`] : [];
  };
  return [table, ...list('Failures', (v) => v.failures), ...list('Warnings', (v) => v.warnings)].join('\n\n');
}
