---
name: write-biography
description: Research and write a long-form Arabic biography for a quotes author and add it to src/data/authors.json. Use when the user asks to add, write, expand, or rewrite an author's biography (سيرة) for biographies.elhellal.com, or names an author from elhellal.com/quotes who has no biography yet.
---

# Write a long-form author biography

Produces one entry in `src/data/authors.json` for an author who has quotes on elhellal.com. The site is Arabic, RTL, and each author becomes a page at `/<slug>/`. Existing entries are short (about 600 characters); this skill produces a real long-form biography of roughly **1,800–2,800 Arabic words**.

Accuracy matters more than length. A shorter biography with every fact sourced beats a longer one with a guessed date.

## Inputs

An author name or slug. If the user gives a name, resolve the slug from `../elhellal/src/data/quotes.json` (`authors[].slug`, `name`, `image`). The slug **must match that file exactly**, because the page links to `https://elhellal.com/quotes/<slug>/`. If the author isn't in `quotes.json`, tell the user and stop; don't invent a slug.

If an entry already exists in `authors.json`, this is a rewrite: keep `slug`, `image`, and any facts you can re-verify, and replace the rest.

## Workflow

1. **Identify.** Get `slug`, `name`, `image` from `quotes.json`. Check `authors.json` for an existing entry. Check `src/data/book-summaries.json[slug]` for books that already have summaries on books.elhellal.com; those titles anchor the "works" section.
2. **Research.** Use WebSearch and WebFetch. Prefer, in this order: Arabic Wikipedia, the author's publisher or official site, major newspaper obituaries or profiles, recorded interviews, encyclopedic sources (Britannica, Arab Writers Union, prize committees). Gather at least two independent sources for every birth/death date, place, prize, and publication year. Note where sources disagree.
3. **Outline** the sections (see below), dropping any that would be empty.
4. **Write** the text in the voice described below.
5. **Save** by editing `src/data/authors.json` (add or replace the entry; keep the array's existing order and 2-space indent).
6. **Validate** with `bun scripts/check-biography.ts <slug>` and fix every error. Warnings need a conscious decision.
7. **Report** to the user: what you wrote, the sources used, and every fact you left out or hedged because sources conflicted.

## Entry shape

Same schema as the README, with richer content:

```json
{
  "slug": "as in quotes.json",
  "name": "...",
  "image": "as in quotes.json",
  "tagline": "one line, under 80 characters",
  "born": { "year": 1911, "place": "..." },
  "died": { "year": 2006, "place": "..." },
  "nationality": "...",
  "roles": ["روائي", "..."],
  "summary": "one paragraph, 200–330 characters; the first 155 become the meta description",
  "sections": [{ "title": "...", "text": "paragraph one\n\nparagraph two\n\nparagraph three" }],
  "works": [{ "title": "...", "year": 1959 }]
}
```

- `died` is `null` for living authors.
- `year` on a work is optional: a number (`1993`) or a range string for multi-volume works (`"1994–1995"`). **Omit it when unsure. Never guess.**
- Paragraphs inside a section are separated by a blank line (`\n\n` in the JSON string). The page renders each as its own `<p>`.
- `works`: 8–15 most significant titles, chronological. Only titles you found in a source.

## Section plan

Aim for **6–8 sections**, 2–4 paragraphs each (about 100–150 words per paragraph). Adapt titles to the author; don't force a template.

| Section | Covers |
|---|---|
| النشأة والأسرة | birth, family, hometown, childhood, the historical setting |
| التعليم والتكوين | schooling, formative teachers and reading, early jobs |
| البدايات الأدبية | first publications, early reception, turning points |
| المشروع الأدبي | the main body of work, recurring themes, style, key titles |
| المحطات الفارقة | exile, imprisonment, politics, relationships, moves, crises, where they shaped the work |
| الجوائز والتقدير | prizes, translations, adaptations, critical standing |
| الأثر والإرث | influence on later writers, readers, and how the author is read today |
| أيامه الأخيرة | only for authors who have died; how and where, without sensationalism |

Order is roughly chronological, but the thematic sections can follow the narrative.

## Voice and style

- Modern Standard Arabic, clear and literary but not ornate. Narrative prose that follows the life, not a list of facts strung together.
- Third person, neutral, encyclopedic with warmth. No hagiography ("العبقري الذي لا يُجارى") and no filler openers.
- Book titles in guillemets: «ذاكرة الجسد». Years as Western digits, matching the existing entries (1953, not ١٩٥٣).
- Connect life to work: say how an event shows up in a book, only where the author or credible critics have said so.
- Each paragraph carries at least one concrete fact (date, place, title, name, event). Cut paragraphs that carry none.
- Don't quote the author's own lines as biographical evidence. Quotes circulating online are frequently misattributed. If you do quote a line, it must come from a book or interview you found a source for.
- Don't copy sentences from sources. Paraphrase and synthesize.

## Hard rules

- **No fabrication.** No invented dates, prizes, anecdotes, dialogue, or relationships. If the sources conflict, either use the better-sourced version or write it as contested ("تختلف المصادر في ...").
- **Sensitive material** (health, family, legal, political affiliation): include only what the author has publicly discussed or major sources report, in restrained language. For living authors be conservative: nothing you couldn't say to their face.
- **Living authors:** `died: null`, use past tense for history and present tense only for verified current activity.
- Don't change other authors' entries, the page template, or the schema beyond what this task needs.
