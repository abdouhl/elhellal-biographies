# biographies.elhellal.com

سِيَر الكتّاب — Arabic author biographies, a companion site to [elhellal.com](https://elhellal.com) (quotes) and [books.elhellal.com](https://books.elhellal.com) (book summaries).

## Stack

Astro 5 + Cloudflare adapter, same `@new-ui/foundations` design tokens and layout shell as `elhellal-books`. Fully static, no client framework.

## Develop

```bash
bun install
bun run dev
bun run build
```

## Content

Authors live in `src/data/authors.json` (each becomes `/<slug>/`). Entry shape:

```json
{
  "slug": "must match the author slug on elhellal.com/quotes",
  "name": "...",
  "image": "portrait url (same Goodreads image used on elhellal.com)",
  "tagline": "one line",
  "born": { "year": 1911, "place": "..." },
  "died": { "year": 2006, "place": "..." },
  "nationality": "...",
  "roles": ["روائي", "..."],
  "summary": "1 paragraph, also used as meta description",
  "sections": [{ "title": "...", "text": "..." }],
  "works": [{ "title": "...", "year": 1959 }]
}
```

`died` is `null` for living authors; `year` on a work is optional (omit when unsure — don't guess).

Sections can hold several paragraphs, separated by a blank line (`\n\n`) inside `text`.

To write a long-form biography for a quotes author, use the project skill `/write-biography <author>` (`.claude/skills/write-biography`), then check it with `bun scripts/check-biography.ts <slug>`.

Cross-links to book summaries come from `src/data/book-summaries.json`, generated from the sibling `../elhellal-books` repo:

```bash
bun run sync-summaries
```

Author pages also link to `https://elhellal.com/quotes/<slug>/`, so keep slugs identical to `quotes.json` on the main site.

## Ads

Same AdSense publisher as elhellal.com (`ca-pub-3610150616518651`, `public/ads.txt`). `src/components/AdUnit.astro` is copied from `elhellal-books`; slots are lazy-filled by the script in `Layout.astro` and hidden when unfilled. Author pages carry a sidebar unit and a closing unit, plus an in-article unit after the second section on longer biographies (4+ sections). The home page has one unit below the grid.

## Deploying to biographies.elhellal.com

Not deployed yet. `bun run build`, then `wrangler pages deploy dist` (or connect the repo to Cloudflare Pages) and add `biographies.elhellal.com` as a custom domain on that project — same steps as books.elhellal.com.
