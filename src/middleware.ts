// Launch routing toggle:
// SILICON_LOGIC_COMING_SOON_MODE defaults to "true", which rewrites public
// site routes to /coming-soon/. Set it to "false" and rebuild to restore the
// existing gated/public site behavior without changing the gate or article code.
import { defineMiddleware } from "astro:middleware";
import { isComingSoonMode, shouldBypassComingSoon } from "./lib/launch-mode";

export const onRequest = defineMiddleware((context, next) => {
  if (isComingSoonMode() && !shouldBypassComingSoon(context.url.pathname)) {
    return context.rewrite("/coming-soon/");
  }

  return next();
});
