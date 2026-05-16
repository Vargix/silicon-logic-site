import { getCollection, type CollectionEntry } from "astro:content";

export type ArticleEntry = CollectionEntry<"articles">;
export type ArticleTrack = ArticleEntry["data"]["track"];

export const SITE_URL = "https://siliconlogic.dev";
export const SITE_DESCRIPTION =
  "Silicon Logic publishes signed benchmarks, technical reviews, and analytical notes on AI hardware and inference runtimes. Every numeric claim is verifiable. Methodology is open.";

export const TRACK_LABELS: Record<ArticleTrack, string> = {
  reviews: "Reviews",
  benchmarks: "Benchmarks",
  notes: "Notes",
};

export const TRACK_DESCRIPTIONS: Record<ArticleTrack, string> = {
  reviews:
    "Long-form technical reviews that connect hardware behavior to the inference workloads readers actually run.",
  benchmarks:
    "Signed benchmark reports with enough methodological context to make the numbers inspectable.",
  notes:
    "Shorter analytical notes on runtime behavior, measurement practice, and concepts that will matter later.",
};

export function isPublishedArticle(article: ArticleEntry) {
  return import.meta.env.DEV || !article.data.draft;
}

export async function getArticles() {
  if (!(await hasArticleMarkdownFiles())) return [];

  const articles = await getCollection("articles", isPublishedArticle);
  return sortArticles(articles);
}

export function sortArticles(articles: ArticleEntry[]) {
  return [...articles].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export function getArticlePath(article: ArticleEntry) {
  return `/${article.data.track}/${article.data.slug}/`;
}

export function getArticleOgImage(article: ArticleEntry) {
  return `/og-image/${article.data.slug}.png`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getReadingTimeMinutes(article: ArticleEntry) {
  const body = article.body ?? "";
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

export function titleCaseConcept(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export interface ArchiveMonth {
  month: string;
  articles: ArticleEntry[];
}

export interface ArchiveYear {
  year: string;
  months: ArchiveMonth[];
}

export function groupArticlesByYearMonth(articles: ArticleEntry[]): ArchiveYear[] {
  const years = new Map<string, Map<string, ArticleEntry[]>>();

  for (const article of articles) {
    const year = String(article.data.date.getUTCFullYear());
    const month = new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "UTC",
    }).format(article.data.date);

    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);
    if (!months) continue;
    if (!months.has(month)) months.set(month, []);
    months.get(month)?.push(article);
  }

  return [...years.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, months]) => ({
      year,
      months: [...months.entries()].map(([month, monthArticles]) => ({
        month,
        articles: sortArticles(monthArticles),
      })),
    }));
}

async function hasArticleMarkdownFiles() {
  const { readdir } = await import("node:fs/promises");
  const { extname, join } = await import("node:path");
  const articleDirectory = join(process.cwd(), "src/content/articles");
  const markdownExtensions = new Set([".md", ".markdown"]);

  async function visit(directory: string): Promise<boolean> {
    let entries;

    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        return false;
      }

      throw error;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (await visit(join(directory, entry.name))) return true;
        continue;
      }

      const fileName = entry.name.toLowerCase();

      if (
        entry.isFile() &&
        fileName !== "readme.md" &&
        fileName !== "readme.markdown" &&
        markdownExtensions.has(extname(fileName))
      ) {
        return true;
      }
    }

    return false;
  }

  return visit(articleDirectory);
}
