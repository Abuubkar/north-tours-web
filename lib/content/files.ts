import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';

/** Where content lives (ADR-0003). Loaders take a directory so tests can use fixtures. */
export const CONTENT_DIR = path.join(process.cwd(), 'content');

/** One problem in one content file, e.g. "content/settings.json › contact.email: …". */
export type ContentProblem = { file: string; field?: string; message: string };

export class ContentError extends Error {
  readonly problems: ContentProblem[];

  constructor(problems: ContentProblem[]) {
    super(`Invalid content:\n${formatProblems(problems)}`);
    this.name = 'ContentError';
    this.problems = problems;
  }
}

/** One problem per line, ready to print. */
export function formatProblems(problems: ContentProblem[]): string {
  return problems
    .map(({ file, field, message }) => (field ? `  ${file} › ${field}: ${message}` : `  ${file}: ${message}`))
    .join('\n');
}

/** Returns a collection's items, or throws a ContentError listing every problem. */
export function requireItems<T>(result: { items: T[]; problems: ContentProblem[] }): T[] {
  if (result.problems.length > 0) throw new ContentError(result.problems);
  return result.items;
}

/** Returns the data, or throws a ContentError listing every problem. */
export function requireValid<T>(result: { data: T | null; problems: ContentProblem[] }): T {
  if (result.data === null || result.problems.length > 0) throw new ContentError(result.problems);
  return result.data;
}

/** Path shown in errors, relative to the project, e.g. "content/settings.json". */
export function displayPath(file: string): string {
  return path.relative(process.cwd(), file) || file;
}

/** Reads and validates one JSON file. Returns the data, or the problems found. */
export function parseFile<T extends z.ZodType>(
  schema: T,
  file: string,
): { data: z.infer<T>; problems: [] } | { data: null; problems: ContentProblem[] } {
  const shown = displayPath(file);
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return { data: null, problems: [{ file: shown, message: (error as Error).message }] };
  }
  const result = schema.safeParse(json);
  if (result.success) return { data: result.data, problems: [] };
  return {
    data: null,
    problems: result.error.issues.map((issue) => ({
      file: shown,
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}
