// `pnpm launch:check`: lists everything that must be real before launch (PRD #94, ADR-0022).
// Run on demand; not part of the build, `pnpm test` or the pre-commit hook.
import { formatProblems } from '../lib/content/files.ts';
import { formatLeftovers, launchCheck } from '../lib/content/leftovers.ts';

const { problems, leftovers } = launchCheck();

if (problems.length > 0) {
  console.error(`Invalid content (${problems.length}):\n${formatProblems(problems)}`);
  process.exit(1);
}

console.log(formatLeftovers(leftovers));
process.exit(leftovers.length > 0 ? 1 : 0);
