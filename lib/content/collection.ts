import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';
import { displayPath, parseFile, type ContentProblem } from './files.ts';

/** Lowercase words joined by hyphens, e.g. "hunza-skardu-grand". */
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Reads every JSON file in a content folder, one item per file. Each item's `slug` must match
 * its file name, so links stay predictable and duplicates are impossible.
 */
export function loadCollection<T extends z.ZodType<{ slug: string }>>(schema: T, folder: string) {
  const items: z.infer<T>[] = [];
  const problems: ContentProblem[] = [];
  let names: string[] = [];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
  } catch {
    return { items, slugs: [], problems: [{ file: displayPath(folder), message: 'Folder not found' }] };
  }
  /** Every item that has a file, valid or not, so links to an invalid file aren't reported twice. */
  const slugs = names.map((name) => name.replace(/\.json$/, ''));

  for (const name of names) {
    const file = path.join(folder, name);
    const result = parseFile(schema, file);
    if (!result.data) {
      problems.push(...result.problems);
      continue;
    }
    const expected = name.replace(/\.json$/, '');
    if (result.data.slug !== expected) {
      problems.push({
        file: displayPath(file),
        field: 'slug',
        message: `Must match the file name ("${expected}")`,
      });
      continue;
    }
    items.push(result.data);
  }
  return { items, slugs, problems };
}
