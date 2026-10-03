// `pnpm content:check`: validates all content without building the site (PRD #24).
import { checkContent } from '../lib/content/check.ts';
import { formatProblems } from '../lib/content/files.ts';

const problems = checkContent();

if (problems.length > 0) {
  console.error(`Invalid content (${problems.length}):\n${formatProblems(problems)}`);
  process.exit(1);
}

console.log('Content is valid.');
