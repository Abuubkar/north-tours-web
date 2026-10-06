import type { NextConfig } from 'next';
import { checkContent } from './lib/content/check.ts';
import { ContentError } from './lib/content/files.ts';
import { BASE_PATH } from './lib/utils/basePath.ts';

// Invalid content fails the build (ADR-0003, CLAUDE.md §7).
const problems = checkContent();
if (problems.length > 0) throw new ContentError(problems);

const nextConfig: NextConfig = {
  output: 'export',
  // `next dev` (which edit mode runs, ADR-0034) would otherwise add its own block to CLAUDE.md.
  agentRules: false,
  // A base-path build (the GitHub Pages preview, ADR-0032) is served from a sub-path and exports
  // each page as a folder with its own index.html, so `/tours` never depends on how GitHub Pages
  // picks between `tours.html` and a `tours/` folder. With no base path the export is unchanged.
  basePath: BASE_PATH,
  trailingSlash: BASE_PATH !== '',
  // Passed into every bundle, so `sitePath` reads the same base path in the browser.
  env: { BASE_PATH },
};

export default nextConfig;
