import type { APIContext } from "astro";
import { renderOgImage } from "../../lib/og";

export async function GET(_context: APIContext) {
  const image = await renderOgImage({
    title: "Signed benchmarks and analytical notes on AI hardware.",
  });

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
