import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

/** Writes content files into a fresh temporary content folder for a test. */
export function contentFixture(files: Record<string, unknown>): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'content-'));
  for (const [name, data] of Object.entries(files)) {
    const file = path.join(dir, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data));
  }
  return dir;
}
