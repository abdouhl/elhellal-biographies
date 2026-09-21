// Validates author entries in src/data/authors.json.
// Usage: bun scripts/check-biography.ts [slug]   (no slug = all authors)
import { existsSync, readFileSync } from "node:fs";

type Author = {
  slug: string; name: string; image: string; tagline: string;
  born: { year: number; place: string }; died: { year: number; place: string } | null;
  nationality: string; roles: string[]; summary: string;
  sections: { title: string; text: string }[]; works: { title: string; year?: number | string }[];
};

const read = (rel: string) => JSON.parse(readFileSync(new URL(rel, import.meta.url), "utf8"));
const authors: Author[] = read("../src/data/authors.json");
const quotesPath = new URL("../../elhellal/src/data/quotes.json", import.meta.url);
const quoteSlugs = existsSync(quotesPath)
  ? new Set<string>(read("../../elhellal/src/data/quotes.json").authors.map((a: { slug: string }) => a.slug))
  : null;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const target = process.argv[2];
const list = target ? authors.filter((a) => a.slug === target) : authors;
if (target && !list.length) { console.error(`no author with slug "${target}"`); process.exit(1); }

let errors = 0;
for (const a of list) {
  const errs: string[] = [], warns: string[] = [];
  for (const k of ["slug", "name", "image", "tagline", "nationality", "summary"] as const)
    if (!a[k]?.trim()) errs.push(`missing ${k}`);
  if (!Number.isInteger(a.born?.year) || !a.born?.place) errs.push("born needs year and place");
  if (a.died !== null && (!Number.isInteger(a.died?.year) || !a.died?.place)) errs.push("died must be null or {year, place}");
  if (a.died && a.died.year < a.born.year) errs.push("died before born");
  if (!a.roles?.length) errs.push("roles is empty");
  if (authors.filter((b) => b.slug === a.slug).length > 1) errs.push("duplicate slug");
  if (quoteSlugs && !quoteSlugs.has(a.slug)) errs.push("slug not found in elhellal quotes.json");
  if (a.tagline && a.tagline.length > 80) warns.push(`tagline is ${a.tagline.length} chars (max 80)`);
  if (a.summary && (a.summary.length < 200 || a.summary.length > 330)) warns.push(`summary is ${a.summary.length} chars (want 200-330)`);
  if (/[٠-٩]/.test(JSON.stringify(a))) warns.push("contains Arabic-Indic digits; use 0-9");

  const total = (a.sections ?? []).reduce((n, s) => n + words(s.text), 0);
  if (!a.sections?.length) errs.push("no sections");
  if (a.sections?.length < 6) warns.push(`${a.sections.length} sections (want 6-8)`);
  if (total < 1800) warns.push(`${total} words (want 1800-2800)`);
  if (total > 3200) warns.push(`${total} words (over 3200)`);
  for (const s of a.sections ?? []) {
    if (!s.title?.trim() || !s.text?.trim()) errs.push("section with empty title or text");
    else if (s.text.split(/\n\n/).length < 2) warns.push(`section "${s.title}" is a single paragraph`);
  }
  if ((a.works?.length ?? 0) < 5) warns.push(`${a.works?.length ?? 0} works (want 8-15)`);
  for (const w of a.works ?? []) if ("year" in w && !/^\d{3,4}([–-]\d{3,4})?$/.test(String(w.year))) errs.push(`work "${w.title}" has malformed year "${w.year}"`);

  console.log(`${errs.length ? "FAIL" : "ok  "} ${a.slug} — ${a.sections?.length ?? 0} sections, ${total} words`);
  for (const e of errs) console.log(`  error: ${e}`);
  for (const w of warns) console.log(`  warn:  ${w}`);
  errors += errs.length;
}
process.exit(errors ? 1 : 0);
