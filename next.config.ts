import type { NextConfig } from 'next';
import { checkContent } from './lib/content/check.ts';
import { ContentError } from './lib/content/files.ts';

// Invalid content fails the build (ADR-0003, CLAUDE.md §7).
const problems = checkContent();
if (problems.length > 0) throw new ContentError(problems);

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
