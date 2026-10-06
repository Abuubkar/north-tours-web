/*
 * Edit mode (ADR-0034) finds the content behind an element by its text: no component needs
 * wiring. This runs in the browser (served by the edit server) and in the unit tests.
 */

/** One string in content, by its content id. */
export type ContentEntry = { id: string; value: string };

/**
 * What an element's text matches: the same text exactly, or a template whose `{tokens}` stand for
 * other text ("{count} trips" matches "4 trips"). Several ids when the same text is in several places.
 */
export type ContentMatch = { kind: 'exact' | 'template'; ids: string[] };

const TOKEN = /\{\w+\}/g;
/** A template must say this much besides its tokens to be matched, or "{name}" alone would match everything. */
const MIN_TEMPLATE_TEXT = 3;

/** Text as an element shows it, for comparing: runs of whitespace as one space, trimmed. */
export const normalizeText = (text: string): string => text.replace(/\s+/g, ' ').trim();

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Builds a matcher over content's strings: give it an element's text, get the ids it shows, or null. */
export function contentMatcher(entries: ContentEntry[]): (text: string) => ContentMatch | null {
  const exact = new Map<string, string[]>();
  const templates: { id: string; pattern: RegExp }[] = [];
  for (const { id, value } of entries) {
    const text = normalizeText(value);
    if (!text) continue;
    exact.set(text, [...(exact.get(text) ?? []), id]);
    const parts = text.split(TOKEN);
    if (parts.length > 1 && parts.join('').replace(/\s/g, '').length >= MIN_TEMPLATE_TEXT) {
      templates.push({ id, pattern: new RegExp(`^${parts.map(escapeRegExp).join('[\\s\\S]+?')}$`) });
    }
  }
  return (shown) => {
    const text = normalizeText(shown);
    if (!text) return null;
    const ids = exact.get(text);
    if (ids) return { kind: 'exact', ids };
    const matched = templates.filter(({ pattern }) => pattern.test(text)).map(({ id }) => id);
    return matched.length > 0 ? { kind: 'template', ids: matched } : null;
  };
}
