const FALSE_VALUES = new Set(["false", "0", "off", "no"]);

export function isComingSoonMode(
  rawValue = import.meta.env.SILICON_LOGIC_COMING_SOON_MODE,
) {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return true;
  }

  return !FALSE_VALUES.has(String(rawValue).trim().toLowerCase());
}

export function shouldBypassComingSoon(pathname: string) {
  return (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.svg" ||
    pathname === "/favicon.ico" ||
    pathname === "/apple-touch-icon.png" ||
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/og-image/")
  );
}
