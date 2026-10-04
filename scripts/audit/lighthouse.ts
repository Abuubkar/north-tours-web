// Lighthouse for `pnpm audit:site` (ADR-0021): its default mobile settings (a mid-range phone
// screen, simulated slow 4G, 4x CPU slowdown), performance only, in the Chromium Playwright
// installed for the story tests (ADR-0012).
import lighthouse from 'lighthouse';
import { createServer } from 'node:net';
import { chromium } from 'playwright';
import type { Vitals } from '../../lib/utils/audit.ts';

/** A free localhost port for Chromium's remote debugging, which Lighthouse connects to. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      probe.close(() => (typeof address === 'object' && address ? resolve(address.port) : reject(new Error('No free port'))));
    });
  });
}

/** Starts Chromium for Lighthouse, with `browserArgs` from the server, and returns a function measuring one URL. */
export async function startLighthouse(browserArgs: string[]) {
  const port = await freePort();
  const browser = await chromium.launch({ channel: 'chromium', args: [`--remote-debugging-port=${port}`, ...browserArgs] });
  const measure = async (url: string): Promise<Vitals> => {
    const result = await lighthouse(url, { port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] });
    const lhr = result?.lhr;
    if (!lhr || lhr.runtimeError) throw new Error(`Lighthouse couldn’t measure ${url}: ${lhr?.runtimeError?.message ?? 'no result'}`);
    const value = (id: string) => {
      const number = lhr.audits[id]?.numericValue;
      if (number === undefined) throw new Error(`Lighthouse returned no ${id} for ${url}`);
      return number;
    };
    return { lcp: value('largest-contentful-paint'), cls: value('cumulative-layout-shift'), tbt: value('total-blocking-time') };
  };
  return { measure, close: () => browser.close() };
}
