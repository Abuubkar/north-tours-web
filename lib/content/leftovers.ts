import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { hasPlaceholder } from '../utils/placeholder.ts';
import { checkContent } from './check.ts';
import { CONTENT_DIR, displayPath, type ContentProblem } from './files.ts';
import { PUBLIC_DIR } from './imageFiles.ts';
import { placeholderImageSchema } from './images.ts';
import { settingsFile } from './settings.ts';

/** What must be real before launch, in the order `pnpm launch:check` prints it. */
export const LEFTOVER_KINDS = ['brand', 'siteUrl', 'placeholder', 'sample', 'photo', 'mapVetting'] as const;

export type LeftoverKind = (typeof LEFTOVER_KINDS)[number];

/** One thing to replace: its kind, file and field ("content/settings.json › contact.email"), and what it is now. */
export type Leftover = { kind: LeftoverKind; file: string; field?: string; label?: string };

/** Each kind's heading, with how to clear it. */
const HEADINGS: Record<LeftoverKind, string> = {
  brand: 'Brand name: write the real name',
  siteUrl: 'Site URL: write the live address, e.g. https://example.pk',
  placeholder: 'Placeholders: replace each [bracketed] part with the real value',
  sample: 'Sample content: remove "sample": true once the item is real or reviewed',
  photo: 'Placeholder photos: add a photo of each shot (people and the office: the owner’s own)',
  mapVetting: 'Map vetting: set to true once the Survey of Pakistan has vetted the maps',
};

/** The settings fields with a kind of their own; any other `[placeholder]` is a plain placeholder. */
const SETTINGS_KINDS: Record<string, LeftoverKind> = { 'brand.name': 'brand', 'site.url': 'siteUrl' };

/** An object's name in the list: its title, name or id, where it has one. */
function nameOf(item: Record<string, unknown>): string | undefined {
  const name = item.title ?? item.name ?? item.id ?? item.slug;
  return typeof name === 'string' ? name : undefined;
}

/** Every leftover in one content file's data. `settings` marks the settings file, whose brand, site URL and map vetting have kinds of their own. */
function leftoversIn(data: unknown, file: string, settings: boolean): Leftover[] {
  const found: Leftover[] = [];
  const visit = (value: unknown, at: (string | number)[]) => {
    const field = at.length > 0 ? at.join('.') : undefined;
    if (typeof value === 'string') {
      if (hasPlaceholder(value)) found.push({ kind: (settings && SETTINGS_KINDS[field!]) || 'placeholder', file, field, label: value });
      return;
    }
    if (Array.isArray(value)) return value.forEach((item, i) => visit(item, [...at, i]));
    if (typeof value !== 'object' || value === null) return;
    const item = value as Record<string, unknown>;
    if (placeholderImageSchema.safeParse(item).success) {
      found.push({ kind: 'photo', file, field, label: item.placeholder as string });
      return;
    }
    if (item.sample === true) found.push({ kind: 'sample', file, field, label: nameOf(item) });
    if (settings && field === 'maps' && item.surveyOfPakistanVetted === false) {
      found.push({ kind: 'mapVetting', file, field: 'maps.surveyOfPakistanVetted', label: 'false' });
    }
    for (const [key, child] of Object.entries(item)) visit(child, [...at, key]);
  };
  visit(data, []);
  return found;
}

/** Every JSON file under a folder, in a stable order. */
function jsonFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(dir, name));
}

/**
 * Walks every JSON file in content and returns what must be real before launch, grouped by
 * kind (`LEFTOVER_KINDS`): it reads files, not a list of fields, so new content is covered.
 * The hero video isn't a launch blocker, so it isn't listed.
 */
export function findLeftovers(dir = CONTENT_DIR): Leftover[] {
  const settings = settingsFile(dir);
  const found = jsonFiles(dir).flatMap((file) =>
    leftoversIn(JSON.parse(readFileSync(file, 'utf8')), displayPath(file), file === settings),
  );
  return LEFTOVER_KINDS.flatMap((kind) => found.filter((leftover) => leftover.kind === kind));
}

/** `pnpm launch:check`: validates content first (invalid content has problems and no leftovers), then lists the leftovers. */
export function launchCheck(dir = CONTENT_DIR, publicDir = PUBLIC_DIR): { problems: ContentProblem[]; leftovers: Leftover[] } {
  const problems = checkContent(dir, publicDir);
  return { problems, leftovers: problems.length > 0 ? [] : findLeftovers(dir) };
}

/** The leftovers as printed: a heading per kind with its count, one line per item, then the total. */
export function formatLeftovers(leftovers: Leftover[]): string {
  if (leftovers.length === 0) return 'Nothing left to replace.';
  const groups = LEFTOVER_KINDS.flatMap((kind) => {
    const items = leftovers.filter((leftover) => leftover.kind === kind);
    if (items.length === 0) return [];
    const lines = items.map(({ file, field, label }) => `  ${file}${field ? ` › ${field}` : ''}${label ? `: ${label}` : ''}`);
    return [`${HEADINGS[kind]} (${items.length})\n${lines.join('\n')}`];
  });
  const total = `${leftovers.length} ${leftovers.length === 1 ? 'item' : 'items'} left to replace before launch.`;
  return [...groups, total].join('\n\n');
}
