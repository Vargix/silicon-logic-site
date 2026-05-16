import type { APIContext } from "astro";
import { buildFeed } from "../../lib/feeds";

export function GET(context: APIContext) {
  return buildFeed(context);
}
