// The elhellal.com app's Explore tab (src/pages/explore.astro there) reads
// this: every biography, one featured a day. CORS in public/_headers.
import authors from "../data/authors.json";

export function GET() {
    const items = authors.map((a) => ({
        title: a.name,
        meta: a.tagline,
        image: a.image,
        url: `https://biographies.elhellal.com/${encodeURIComponent(a.slug)}/`,
    }));
    return Response.json({ v: 1, site: "biographies", title: "السير الذاتية", url: "https://biographies.elhellal.com/", items });
}
