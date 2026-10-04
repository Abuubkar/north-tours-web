// The browser pass of `pnpm audit:site`: axe-core's default rules (as the story tests use) and
// the page checks, in Playwright's Chromium with reduced motion, so everything is in its final state.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { Browser } from 'playwright';
import type { AxeViolation, PageFacts } from '../../lib/utils/audit.ts';

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

/** The widths axe and the page checks run at: a phone and a desktop. */
export const WIDTHS = [390, 1440] as const;

/** Runs axe and reads the page facts at one width, once the page has settled. */
export async function inspectPage(browser: Browser, url: string, width: number): Promise<{ facts: PageFacts; violations: AxeViolation[] }> {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axeSource });
    const facts = await page.evaluate((w) => {
      const attribute = (selector: string, name = 'content') => document.querySelector(selector)?.getAttribute(name) ?? '';
      return {
        width: w,
        // Only the <h1>s shown at this width: one hidden with display: none isn't read out either.
        h1s: [...document.querySelectorAll('h1')].filter((h1) => h1.checkVisibility()).length,
        title: document.title.trim(),
        description: attribute('meta[name="description"]'),
        ogImage: attribute('meta[property="og:image"]'),
        twitterImage: attribute('meta[name="twitter:image"]'),
        canonical: attribute('link[rel="canonical"]', 'href'),
        ogUrl: attribute('meta[property="og:url"]'),
      };
    }, width);
    const results = await page.evaluate(() => (window as unknown as { axe: typeof import('axe-core') }).axe.run(document));
    const violations = results.violations.map((v) => ({
      width,
      rule: v.id,
      targets: v.nodes.map((node) => node.target.join(' ')),
    }));
    return { facts, violations };
  } finally {
    await context.close();
  }
}
