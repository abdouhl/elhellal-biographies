// Maps each author to the book summaries that exist on books.elhellal.com,
// read from the sibling elhellal-books repo. Output: src/data/book-summaries.json
import { readFileSync, writeFileSync } from "node:fs";

const books = JSON.parse(readFileSync(new URL("../../elhellal-books/src/data/books.json", import.meta.url), "utf8"));
const out: Record<string, { title: string; slug: string }[]> = {};
for (const b of books) (out[b.authorSlug] ??= []).push({ title: b.title, slug: b.slug });
writeFileSync(new URL("../src/data/book-summaries.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`${Object.keys(out).length} authors, ${books.length} summaries`);
