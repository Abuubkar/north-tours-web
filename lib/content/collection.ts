import { readdirSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { displayPath, parseFile, type ContentProblem } from './files.ts';

/** Lowercase words joined by hyphens, e.g. "hunza-skardu-grand". */
export const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase words joined by hyphens');

/**
 * Reads every JSON file in a content folder, one item per file. Each item's `slug` must match
 * its file name, so links stay predictable and duplicates are impossible.
 */
export function loadCollection<T extends z.ZodType<{ slug: string }>>(schema: T, folder: string) {
  const items: z.infer<T>[] = [];
  const problems: ContentProblem[] = [];
  /** Each item's file as shown in errors, by slug; includes invalid files, so links to them aren't reported twice. */
  const files: Record<string, string> = {};
  let names: string[] = [];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
  } catch {
    return { items, files, problems: [{ file: displayPath(folder), message: 'Folder not found' }] };
  }

  for (const name of names) {
    const file = path.join(folder, name);
    const expected = name.replace(/\.json$/, '');
    files[expected] = displayPath(file);
    const result = parseFile(schema, file);
    if (!result.data) {
      problems.push(...result.problems);
      continue;
    }
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
  return { items, files, problems };
}
