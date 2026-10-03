/*
 * Named `{tokens}` in page copy and message templates, filled from settings or the page, e.g.
 * "Hold your seats with a {advancePercent}% advance". The content schema checks each field
 * uses only the tokens it allows, so a typo fails the build instead of reaching the site.
 */

const TOKEN = /\{(\w+)\}/g;

/** The token names used in a template, in order: "{tour} on {date}" → ["tour", "date"]. */
export function tokensIn(template: string): string[] {
  return [...template.matchAll(TOKEN)].map((match) => match[1]);
}

/** Replaces each `{token}` with its value. Throws on a token with no value. */
export function fillTokens(template: string, values: Record<string, string>): string {
  return template.replace(TOKEN, (_, name: string) => {
    if (!(name in values)) throw new Error(`No value for {${name}} in "${template}"`);
    return values[name];
  });
}
