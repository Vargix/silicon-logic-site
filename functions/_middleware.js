// Launch routing toggle:
// SILICON_LOGIC_COMING_SOON_MODE defaults to "true", which serves the static
// Coming Soon page for public routes on Cloudflare Pages. Set it to "false"
// to pass requests through to the existing gated/public site; no gate logic is
// changed by this middleware.
const FALSE_VALUES = new Set(["false", "0", "off", "no"]);
const COMING_SOON_ASSET = "/coming-soon/";

function isComingSoonMode(env) {
  const rawValue = env && env.SILICON_LOGIC_COMING_SOON_MODE;

  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return true;
  }

  return !FALSE_VALUES.has(String(rawValue).trim().toLowerCase());
}

function shouldBypassComingSoon(pathname) {
  return (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.svg" ||
    pathname === "/favicon.ico" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/favicon-32.png" ||
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/methodology-preprint") ||
    pathname.startsWith("/motion/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/og-image/")
  );
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (!isComingSoonMode(context.env) || shouldBypassComingSoon(url.pathname)) {
    return context.next();
  }

  const assetUrl = new URL(COMING_SOON_ASSET, url.origin);
  return context.env.ASSETS.fetch(new Request(assetUrl, {
    headers: context.request.headers,
    method: "GET",
  }));
}
