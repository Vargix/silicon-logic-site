import type { APIContext } from "astro";
import { getArticlePath, getArticles } from "../lib/articles";
import { isComingSoonMode } from "../lib/launch-mode";

const STATIC_ROUTES = [
  "/",
  "/reviews/",
  "/benchmarks/",
  "/notes/",
  "/methodology/",
  "/concepts/",
  "/archive/",
  "/about/",
  "/styleguide/",
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://siliconlogic.dev");
  const paths = isComingSoonMode()
    ? ["/"]
    : [
        ...STATIC_ROUTES,
        ...(await getArticles()).map((article) => getArticlePath(article)),
      ];

  const urls = [...new Set(paths)]
    .map((path) => `  <url><loc>${escapeXml(new URL(path, site).toString())}</loc></url>`)
    .join("\n");

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      "</urlset>",
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
