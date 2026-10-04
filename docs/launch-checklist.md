# Launch checklist

What must be true before the site goes live. Hosting itself is out of scope (ADR-0007, CLAUDE.md §11): the owner sets it up by hand once this list is clear.

## 1. Everything real: `pnpm launch:check`

```sh
pnpm launch:check
```

It validates content first (as `pnpm content:check`), then reads every JSON file under `content/` and lists what must be real before launch, grouped by kind, with the file and field of each item (`content/settings.json › contact.officeAddress`). It fails (exit code 1) while anything is left, and prints "Nothing left to replace." once nothing is. It isn't part of the build, `pnpm test` or the pre-commit hook, so builds and merges keep working until launch.

| Kind | Where it lives | How to clear it |
|---|---|---|
| **Brand name** | `content/settings.json › brand.name` | Write the real name. Page titles and the footer use it. |
| **Site URL** | `content/settings.json › site.url` | Write the live address, e.g. `https://example.pk`. |
| **Placeholders** | Any text with a `[bracketed]` part, whole or partial ("[Office address], Lahore, Punjab"): contact details, office hours, the pickup point, the DTS licence, the company registration, social links, memberships | Replace the bracketed part with the real value. A value with no real counterpart (say, no YouTube channel) still has to be supplied for now; making it optional is a content-model change. |
| **Sample content** | Every object with `"sample": true`: invented claims about the company (ADR-0019), sample legal and policy text (ADR-0020), and each sample tour, tour rating, destination, guide, review and the `booking`, `trust` and `policies` settings figures (ADR-0022) | Make the item real, or have it reviewed (the lawyer for the Privacy Policy, the Terms and the Help policies), then remove the `sample` field. Delete a sample tour, guide or review the company doesn't have. |
| **Placeholder photos** | Every image still `{ "placeholder", "alt" }`: guide portraits, the founder, the office, any place without a photo yet | Add the photo (ADR-0009): people and the office are the owner's own photos only, never stock. Run `pnpm images` and commit both folders. |
| **Map vetting** | `content/settings.json › maps.surveyOfPakistanVetted` | Set it to `true` once the Survey of Pakistan has vetted the route map, the itinerary maps and the places maps (CLAUDE.md §8). Nothing on the site reads it. |

Not checked: the Homepage hero video (#38) is a nice-to-have, not a launch blocker.

Reviews and guides added with `/add-review` and `/add-guide` are real and never get `sample`.
