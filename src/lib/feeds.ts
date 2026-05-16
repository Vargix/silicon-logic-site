import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import {
  getArticlePath,
  getArticles,
  SITE_DESCRIPTION,
  TRACK_LABELS,
  type ArticleTrack,
} from "./articles";

export async function buildFeed(context: APIContext, track?: ArticleTrack) {
  const site = context.site ?? new URL("https://siliconlogic.dev");
  const articles = (await getArticles()).filter((article) =>
    track ? article.data.track === track : true,
  );
  const title = track ? `Silicon Logic ${TRACK_LABELS[track]}` : "Silicon Logic";

  return rss({
    title,
    description: track
      ? `${TRACK_LABELS[track]} from Silicon Logic.`
      : SITE_DESCRIPTION,
    site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      author: article.data.author,
      categories: article.data.concepts,
      link: getArticlePath(article),
      content: article.rendered?.html ?? "",
    })),
  });
}
