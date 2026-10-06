import type { JsonPath } from './contentIds.ts';

/** One string value in a JSON text: its path, its value, and where its quoted form sits in the text. */
export type JsonString = { path: JsonPath; value: string; start: number; end: number };

/**
 * Every string value in a JSON text, with its path and position (not object keys). A small
 * scanner rather than JSON.parse, because edit mode (ADR-0034) needs the positions, to change one
 * value and leave the file's formatting exactly as it was. Throws on text that isn't JSON.
 */
export function jsonStrings(text: string): JsonString[] {
  const found: JsonString[] = [];
  let at = 0;

  const fail = (what: string): never => {
    throw new SyntaxError(`${what} at position ${at}`);
  };
  const skipSpace = () => {
    while (at < text.length && /\s/.test(text[at])) at++;
  };
  const readString = (): { value: string; start: number; end: number } => {
    const start = at;
    if (text[at] !== '"') fail('Expected a string');
    at++;
    while (at < text.length && text[at] !== '"') at += text[at] === '\\' ? 2 : 1;
    if (at >= text.length) fail('Unterminated string');
    at++;
    return { value: JSON.parse(text.slice(start, at)) as string, start, end: at };
  };
  const readValue = (path: JsonPath): void => {
    skipSpace();
    const char = text[at];
    if (char === '"') {
      found.push({ path, ...readString() });
    } else if (char === '{') {
      at++;
      skipSpace();
      if (text[at] === '}') {
        at++;
        return;
      }
      for (;;) {
        skipSpace();
        const key = readString().value;
        skipSpace();
        if (text[at] !== ':') fail('Expected ":"');
        at++;
        readValue([...path, key]);
        skipSpace();
        if (text[at] === ',') at++;
        else if (text[at] === '}') {
          at++;
          return;
        } else fail('Expected "," or "}"');
      }
    } else if (char === '[') {
      at++;
      skipSpace();
      if (text[at] === ']') {
        at++;
        return;
      }
      for (let index = 0; ; index++) {
        readValue([...path, index]);
        skipSpace();
        if (text[at] === ',') at++;
        else if (text[at] === ']') {
          at++;
          return;
        } else fail('Expected "," or "]"');
      }
    } else {
      const literal = /^(?:-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/.exec(text.slice(at));
      if (!literal) fail('Unexpected character');
      at += literal![0].length;
    }
  };

  readValue([]);
  skipSpace();
  if (at < text.length) fail('Unexpected text after the value');
  return found;
}

const samePath = (a: JsonPath, b: JsonPath) => a.length === b.length && a.every((segment, i) => segment === b[i]);

/** The string at `path`, or undefined when there's no string there. */
export function jsonStringAt(text: string, path: JsonPath): JsonString | undefined {
  return jsonStrings(text).find((string) => samePath(string.path, path));
}

/** The text with the string at `path` set to `value`; everything else is left exactly as it was. */
export function replaceJsonString(text: string, path: JsonPath, value: string): string {
  const string = jsonStringAt(text, path);
  if (!string) throw new Error(`No string at ${path.join('.') || 'the top level'}`);
  return text.slice(0, string.start) + JSON.stringify(value) + text.slice(string.end);
}
