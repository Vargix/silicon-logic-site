import type { APIContext } from "astro";
import { formatDate, getArticles, TRACK_LABELS, type ArticleEntry } from "../../lib/articles";
import { renderOgImage } from "../../lib/og";

export async function getStaticPaths() {
  const articles = await getArticles();

  return articles.map((article) => ({
    params: { slug: article.data.slug },
    props: { article },
  }));
}

interface Props {
  article: ArticleEntry;
}

export async function GET(context: APIContext) {
  const { article } = context.props as Props;
  const image = await renderOgImage({
    title: article.data.title,
    trackLabel: TRACK_LABELS[article.data.track],
    date: formatDate(article.data.date),
  });

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
