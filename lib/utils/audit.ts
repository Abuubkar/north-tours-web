/*
 * `pnpm audit:site` (PRD #94, ADR-0021): the pure parts. The script builds and serves the site,
 * measures every page and passes the numbers here; these decide what fails and print the table.
 */

/** The quality bar (CLAUDE.md §10): LCP and CLS fail over these; TBT, the lab stand-in for INP, only warns. */
const LIMITS = { lcp: 2500, cls: 0.1, tbt: 200 } as const;

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

/**
 * Everything measured on one page. `runs` is how many Lighthouse runs `vitals` is the median of;
 * `vitals` is null when Lighthouse couldn't measure the page.
 */
export type PageAudit = { page: string; vitals: Vitals | null; runs: number; facts: PageFacts[]; violations: AxeViolation[] };

/** A page's failures and warnings; `checks` counts the failures that are page checks (not vitals or axe). */
type PageVerdict = { audit: PageAudit; failures: string[]; checks: number; warnings: string[] };

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

/** A page's titles, once each (they're the same at every width unless something is wrong). */
const titlesOf = (facts: PageFacts[]) => new Set(facts.map((f) => f.title).filter(Boolean));

/** LCP over 2.5 s and CLS over 0.1 fail; TBT over 200 ms only warns. */
function vitalsVerdict(vitals: Vitals | null): { failures: string[]; warnings: string[] } {
  if (!vitals) return { failures: ['Lighthouse couldn’t measure the page'], warnings: [] };
  const failures: string[] = [];
  if (vitals.lcp > LIMITS.lcp) failures.push(`LCP ${seconds(vitals.lcp)} is over ${seconds(LIMITS.lcp)}`);
  if (vitals.cls > LIMITS.cls) failures.push(`CLS ${shift(vitals.cls)} is over ${LIMITS.cls}`);
  const warnings = vitals.tbt > LIMITS.tbt ? [`TBT ${Math.round(vitals.tbt)} ms is over ${LIMITS.tbt} ms (the lab stand-in for INP)`] : [];
  return { failures, warnings };
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
    for (const title of titlesOf(facts)) pagesByTitle.set(title, [...(pagesByTitle.get(title) ?? []), page]);
  }

  return audits.map((audit) => {
    const { vitals, facts, violations, page } = audit;
    const checks = [...new Set(facts.flatMap((f) => factFailures(f, buildFiles)))];
    for (const title of titlesOf(facts)) {
      const others = (pagesByTitle.get(title) ?? []).filter((other) => other !== page);
      if (others.length > 0) checks.push(`<title> “${title}” is shared with ${others.join(', ')}`);
    }
    const axe = violations.map(({ width, rule, targets }) => `${width}px: axe ${rule} on ${targets.join(', ')}`);
    const measured = vitalsVerdict(vitals);
    return { audit, failures: [...measured.failures, ...axe, ...checks], checks: checks.length, warnings: measured.warnings };
  });
}

/** One Markdown table row per page, then each failure and warning in detail. */
export function auditReport(verdicts: PageVerdict[]): string {
  const rows = verdicts.map(({ audit, failures, checks, warnings }) => {
    const { page, vitals, runs, violations } = audit;
    const medianNote = runs > 1 ? ` (median of ${runs})` : '';
    const numbers = vitals ? [`${seconds(vitals.lcp)}${medianNote}`, shift(vitals.cls), `${Math.round(vitals.tbt)} ms`] : ['–', '–', '–'];
    const result = failures.length > 0 ? 'fail' : warnings.length > 0 ? 'pass, TBT warning' : 'pass';
    return `| ${[page, ...numbers, violations.length, checks === 0 ? 'pass' : `${checks} failed`, result].join(' | ')} |`;
  });
  const table = ['| Page | LCP | CLS | TBT | Axe violations | Page checks | Result |', '|---|---|---|---|---|---|---|', ...rows].join('\n');
  const list = (title: string, pick: (v: PageVerdict) => string[]) => {
    const lines = verdicts.flatMap((v) => pick(v).map((line) => `- ${v.audit.page}: ${line}`));
    return lines.length > 0 ? [`${title} (${lines.length})\n${lines.join('\n')}`] : [];
  };
  return [table, ...list('Failures', (v) => v.failures), ...list('Warnings', (v) => v.warnings)].join('\n\n');
}
