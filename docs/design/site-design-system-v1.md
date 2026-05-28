# Silicon Logic — Site Design System v1

**Status:** Canonical. This document governs the visual implementation of silicon-logic.com. Changes require a deliberate revision pass and a new version number. Phase 1 implementation (design tokens, base.css, BaseLayout.astro, /styleguide page) executes against this spec.

**Scope:** Typography, color, code rendering, layout, information architecture, component vocabulary, dark mode behavior. Does not cover: wordmark/logo design (deferred), per-article art direction (none — Silicon Logic publishes type-only articles), social-preview image design (covered separately in Phase 6).

**Foundational research:** Synthesized from ten Phase 0 reports including ChatGPT typography deep research, Claude color and code-block reports, Gemini IA report, Claude design criticism essay, Grok X discourse, and Manus three-task visual evidence research (~45 publication screenshots). See `~/silicon-logic-scratch/site-research-notes-v2.md` for the synthesis that produced these decisions.

**Voice:** Stratechery-meets-AnandTech. Analytical density with personality, technical authority, restrained design. Optimized for an archive of 100-200 articles over five years across two editorial tracks (Reviews and Benchmarks) with cryptographically signed benchmark artifacts as a load-bearing editorial commitment.

---

## 1. Principles

These principles govern every decision below. When future revisions arise, decisions should be checked against these principles before being made.

**1.1 Typography is the editorial commitment.** Silicon Logic's visual identity is its typography. Every other design decision serves the typography. The publication is licensed for Tiempos Text Web (Klim Type Foundry), drawn specifically for screen rendering of long-form editorial prose. The typography stack is locked for v1 and not subject to taste-driven revision.

**1.2 Restraint over decoration.** No element exists for ornament. Every visible feature serves either reading (typography, color, spacing) or navigation (track labels, byline, IA). No gradients, no decorative dividers, no marketing chrome, no above-the-fold subscribe CTAs, no social-engagement furniture, no modal overlays.

**1.3 The archive is the product.** Design decisions optimize for the corpus that exists at year five, not the home page at month one. Hierarchical URLs without dates. Methodology and analytical frameworks as first-class content. Concepts taxonomy (Stratechery-pattern) for surfacing the analytical methods used across reviews.

**1.4 Single restrained accent, used semantically.** One warm accent color for editorial identity, link underlines, track labels, and focus/selection affordances. A distinct semantic color for the signed-artifact badge. No third accent for decoration. The accent does semantic work; body-sized link text remains high-contrast text color.

**1.5 Verifiability is part of the design.** Every benchmark artifact gets a visible cryptographic-signature treatment. The signed-runs methodology page is surfaced in primary navigation, not buried. The design materially communicates that Silicon Logic publishes signed work.

**1.6 Self-host everything.** No third-party font CDNs, no Google Fonts on the page, no analytics with cookies, no external dependencies that could change under the publication. Files Silicon Logic uses are files Silicon Logic owns. The exceptions are Cloudflare Pages (hosting) and Cloudflare Web Analytics (privacy-preserving, free).

**1.7 No JavaScript except where it earns its place.** Astro 6 static site, build-time everything. Client-side JS appears only for: theme toggle, archive filter, table-of-contents sticky behavior. No client-side syntax highlighting (build-time Shiki). No client-side search v1 (build-time index acceptable later).

---

## 2. Design tokens

All tokens defined in CSS custom properties in `:root` and `[data-theme="dark"]` blocks. OKLCH primary with hex fallback. Tokens namespace by role (`--fg-default`, not `--gray-900`).

### 2.1 Color tokens — light mode

```css
:root, [data-theme="light"] {
  /* Surfaces */
  --bg-canvas: oklch(98.5% 0.005 90);   /* #fbfaf7 warm off-white */
  --bg-elevated: oklch(100% 0 0);        /* #ffffff for inset cards (rare) */
  --bg-subtle: oklch(96.5% 0.006 90);    /* #f4f2ed slightly deeper warm */
  --bg-code-inline: oklch(95% 0.008 90); /* #efece5 inline <code> tint */
  --bg-code-block: oklch(97% 0.006 90);  /* #f7f5f0 code block surface */

  /* Text */
  --fg-default: oklch(20% 0.005 280);    /* #1f2024 near-black, faint cool */
  --fg-muted: oklch(45% 0.01 280);       /* #5e6068 captions, metadata */
  --fg-subtle: oklch(60% 0.01 280);      /* #8a8c93 timestamps, disabled */

  /* Borders */
  --border-default: oklch(88% 0.008 90); /* #dcd9d1 */
  --border-muted: oklch(93% 0.006 90);   /* #ebe9e2 */

  /* Accent — warm orange/amber in the Stratechery direction */
  --accent: oklch(58% 0.14 55);          /* #c87238 muted warm orange */
  --accent-hover: oklch(50% 0.16 55);    /* #a85a25 deeper on hover */
  --accent-visited: oklch(45% 0.10 35);  /* #88553a muted brown for visited */

  /* Link colors — accent is brand-color-only; links use high-contrast text.
     Underline carries link semantics; color carries readability. */
  --link-fg: var(--fg-default);           /* 15.59:1 on bg-canvas (AAA) */
  --link-fg-visited: var(--fg-muted);     /* 6.01:1 on bg-canvas (AA body) */

  /* Signed-artifact semantic — muted teal, distinct from accent */
  --signed-fg: oklch(45% 0.08 195);      /* #2c6470 muted teal */
  --signed-bg: oklch(94% 0.02 195);      /* #dde8ec badge surface */
  --signed-border: oklch(75% 0.06 195);  /* #8db5be */
}
```

### 2.2 Color tokens — dark mode

```css
[data-theme="dark"] {
  /* Surfaces */
  --bg-canvas: oklch(15% 0.008 280);     /* #111317 near-black, faint cool */
  --bg-elevated: oklch(19% 0.008 280);   /* #1a1d22 cards, pull quotes */
  --bg-subtle: oklch(22% 0.008 280);     /* #1f2228 section dividers */
  --bg-code-inline: oklch(25% 0.008 280);/* #25282f inline <code> tint */
  --bg-code-block: oklch(18% 0.008 280); /* #181a1f code block surface */

  /* Text */
  --fg-default: oklch(92% 0.005 90);     /* #e8e5dd warm-ish off-white */
  --fg-muted: oklch(70% 0.008 90);       /* #a8a59c captions */
  --fg-subtle: oklch(55% 0.008 90);      /* #7d7a71 timestamps */

  /* Borders */
  --border-default: oklch(30% 0.01 280); /* #2c2f36 */
  --border-muted: oklch(25% 0.008 280);  /* #24272d */

  /* Accent — lifted warm orange for dark surface */
  --accent: oklch(75% 0.13 55);          /* #e8a877 lifted warm orange */
  --accent-hover: oklch(82% 0.11 55);    /* #f0bd95 brighter on hover */
  --accent-visited: oklch(65% 0.08 35);  /* #b6906f */

  /* Link colors — accent is brand-color-only; links use high-contrast text. */
  --link-fg: var(--fg-default);           /* 14.77:1 on bg-canvas (AAA) */
  --link-fg-visited: var(--fg-muted);     /* 7.55:1 on bg-canvas (AAA) */

  /* Signed-artifact semantic */
  --signed-fg: oklch(78% 0.09 195);      /* #82c0cc lifted teal */
  --signed-bg: oklch(25% 0.04 195);      /* #1f323a */
  --signed-border: oklch(45% 0.07 195);  /* #4a7681 */
}
```

### 2.3 Computed contrast ratios (WCAG 2.x)

All foreground-background pairs computed from sRGB equivalents.

**Light mode:**

| Pair | Ratio | Verdict |
|---|---|---|
| fg-default on bg-canvas | 15.59:1 | Exceeds AAA (7:1) |
| fg-default on bg-elevated | 16.27:1 | Exceeds AAA |
| fg-muted on bg-canvas | 6.01:1 | AA body |
| fg-subtle on bg-canvas | 3.22:1 | AA large only — metadata only |
| link-fg on bg-canvas | 15.59:1 | Exceeds AAA |
| link-fg-visited on bg-canvas | 6.01:1 | AA body |
| accent on bg-canvas | 3.40:1 | AA large only — constrained to brand/decorative use |
| fg-default on bg-code-inline | 13.79:1 | Exceeds AAA |
| signed-fg on signed-bg | 5.32:1 | AA body |

**Dark mode:**

| Pair | Ratio | Verdict |
|---|---|---|
| fg-default on bg-canvas | 14.77:1 | Exceeds AAA |
| fg-default on bg-elevated | 13.42:1 | Exceeds AAA |
| fg-muted on bg-canvas | 7.55:1 | Exceeds AAA |
| fg-subtle on bg-canvas | 4.33:1 | AA large only — metadata only |
| link-fg on bg-canvas | 14.77:1 | Exceeds AAA |
| link-fg-visited on bg-canvas | 7.55:1 | Exceeds AAA |
| accent on bg-canvas | 9.12:1 | Exceeds AAA |
| signed-fg on signed-bg | 6.58:1 | AA body |

All body-sized text pairs are designed against WCAG 2.2 AA as floor, AAA where achievable. Accent text use is constrained to small uppercase brand/decorative treatments where AA-large is acceptable in light mode. APCA scores not specified (APCA still not in WCAG 3 working draft as of August 2025) but should be run as a sanity check against the same color pairs in `docs/color-contrast.md` as a future artifact.

Accent (`--accent`) is a brand color used for decoration: focus outlines, selection highlights, prose link underlines, track labels, section kickers, and dividers. Inline link text uses `--link-fg` (high-contrast text-on-canvas) with `--accent` as `text-decoration-color`. Hover states are signaled by underline thickness changes, not color changes. Visited prose links use `--fg-muted`. This separates link semantics (underline) from brand identity (warm accent) and maintains WCAG 2.2 AA-body floor for all body-sized text.

### 2.4 Type scale tokens

```css
:root {
  /* Font families */
  --font-body: "Tiempos Text Web", "Tiempos Text", Iowan Old Style,
               "Palatino Linotype", "Book Antiqua", Georgia, serif;
  --font-display: "Tiempos Headline", "Tiempos Text Web",
                  "Tiempos Text", Georgia, serif;
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
               Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Menlo, Monaco, Consolas,
               "Liberation Mono", "DejaVu Sans Mono", monospace;

  /* Size scale (desktop) */
  --size-body: 1.125rem;          /* 18px */
  --lh-body: 1.55;

  --size-footnote: 0.9375rem;     /* 15px */
  --lh-footnote: 1.5;

  --size-inline-code: 0.92em;     /* relative to surrounding text */
  --size-code: 0.9375rem;         /* 15px */
  --lh-code: 1.6;

  --size-h1: 2.375rem;            /* 38px */
  --lh-h1: 1.15;

  --size-h2: 1.5rem;              /* 24px */
  --lh-h2: 1.3;

  --size-h3: 1.1875rem;           /* 19px */
  --lh-h3: 1.4;

  --size-h4: 1rem;                /* 16px */
  --lh-h4: 1.45;

  --size-meta: 0.8125rem;         /* 13px — bylines, track labels */
  --lh-meta: 1.4;

  --size-wordmark: 1.5rem;        /* 24px — masthead in Tiempos Headline */

  /* Weights */
  --weight-body: 400;
  --weight-body-emphasis: 400;    /* italic carries emphasis, not weight */
  --weight-meta: 500;             /* Tiempos Text Medium */
  --weight-h1: 600;               /* Tiempos Text Web Semibold */
  --weight-h2: 600;               /* Inter Semibold */
  --weight-h3: 600;               /* Inter Semibold */
  --weight-h4: 500;               /* Inter Medium */
  --weight-wordmark: 700;         /* Tiempos Headline Bold */
}

/* Mobile reductions */
@media (max-width: 768px) {
  :root {
    --size-body: 1.0625rem;       /* 17px */
    --size-h1: 1.95rem;           /* 31px */
    --size-h2: 1.375rem;          /* 22px */
    --size-h3: 1.125rem;          /* 18px */
  }
}
```

### 2.5 Layout tokens

```css
:root {
  --measure-prose: 68ch;          /* primary reading column */
  --measure-artifact: 94ch;       /* code, tables, charts can break wider */
  --measure-display: 52ch;        /* tighter measure for h1 hero */

  --space-paragraph: 0.95rem;     /* between paragraphs */
  --space-block: 1.5rem;          /* between blocks (lists, code, quotes) */
  --space-section: 2.5rem;        /* before H2 */
  --space-subsection: 1.75rem;    /* before H3 */
  --space-code-pad-y: 0.875rem;
  --space-code-pad-x: 1rem;

  --radius-code: 6px;
  --radius-callout: 8px;
}

@media (max-width: 768px) {
  :root {
    --measure-prose: 100%;        /* full width on mobile */
    --measure-artifact: 100%;
  }
}
```

---

## 3. Typography

### 3.1 Locked typography stack

**Body face (web, screen-optimized):** Tiempos Text Web (Klim Type Foundry, paid license)
- Regular, Regular Italic, Semibold, Semibold Italic — these are the screen-optimized cuts
- Used for: body prose, body emphasis, H1 article titles, H1 titles with italicized words

**Editorial weights (web, standard cuts):** Tiempos Text (Klim Type Foundry, paid license)
- Medium (500) — for byline labels, track tags, section divider metadata, pull-quote attribution
- Bold (700) — available but spec does not use it; reserved for future strong-emphasis editorial moments

**Display face (web, for wordmark/masthead only):** Tiempos Headline (Klim Type Foundry, paid license)
- Black or Bold — used exclusively for the "Silicon Logic" wordmark in site header
- Not used in article body, not used for H1, not used for any other display purpose
- The discipline: Headline appears at most once per page (the masthead)

**Structural sans (free, self-hosted):** Inter (rsms.me, SIL OFL)
- Regular (400), Medium (500), Semibold (600)
- Used for: navigation links, byline metadata, track labels, footnote markers, signed-artifact badge text, H2/H3/H4 section headers, UI elements, captions

**Monospace (free, self-hosted):** IBM Plex Mono (Google Fonts/IBM, SIL OFL)
- Regular (400), Italic (400 italic)
- Used for: inline `<code>`, code blocks, terminal output, file paths, hashes/fingerprints
- Ligatures disabled (`font-variant-ligatures: none`) — Silicon Logic's code is editorial evidence; ligature substitution introduces ambiguity about whether `<=` is literal

### 3.2 @font-face declarations

All fonts self-hosted as WOFF2. Klim-licensed fonts served from outside the public git repo (Cloudflare R2 bucket or private host). Open-source fonts (Inter, IBM Plex Mono) can be committed to the public repo if desired or also hosted privately for consistency.

```css
/* Tiempos Text Web (body, screen-optimized) */
@font-face {
  font-family: "Tiempos Text Web";
  src: url("/fonts/tiempos/tiempos-text-web-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Tiempos Text Web";
  src: url("/fonts/tiempos/tiempos-text-web-regular-italic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "Tiempos Text Web";
  src: url("/fonts/tiempos/tiempos-text-web-semibold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Tiempos Text Web";
  src: url("/fonts/tiempos/tiempos-text-web-semibold-italic.woff2") format("woff2");
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}

/* Tiempos Text (Medium and Bold standard cuts, for utility weights) */
@font-face {
  font-family: "Tiempos Text";
  src: url("/fonts/tiempos/tiempos-text-medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Tiempos Text";
  src: url("/fonts/tiempos/tiempos-text-bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Tiempos Headline (masthead/wordmark only) */
@font-face {
  font-family: "Tiempos Headline";
  src: url("/fonts/tiempos/tiempos-headline-black.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Tiempos Headline";
  src: url("/fonts/tiempos/tiempos-headline-web-bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Inter (structural sans) */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-Semibold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* IBM Plex Mono (code) */
@font-face {
  font-family: "IBM Plex Mono";
  src: url("/fonts/plex-mono/IBMPlexMono-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "IBM Plex Mono";
  src: url("/fonts/plex-mono/IBMPlexMono-Italic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

**Preload strategy:**

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/tiempos/tiempos-text-web-regular.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/inter/Inter-Medium.woff2" crossorigin>
```

Only preload what's used in the above-the-fold content of every page: body Regular and Inter Medium (for byline/nav). Italic, Semibold, and other weights load on-demand via normal CSS discovery.

### 3.3 Body prose typography

```css
body {
  font-family: var(--font-body);
  font-size: var(--size-body);
  line-height: var(--lh-body);
  font-weight: var(--weight-body);
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--fg-default);
  background: var(--bg-canvas);
}

.prose {
  max-width: var(--measure-prose);
  margin-inline: auto;
}

.prose p {
  margin: 0 0 var(--space-paragraph);
}

.prose p:first-of-type {
  margin-top: 0;
}

em, i {
  font-style: italic;
  /* Italic uses Tiempos Text Web Regular Italic via @font-face matching */
}

strong, b {
  font-weight: 700;
  /* Maps to Tiempos Text Bold; use sparingly */
}
```

### 3.4 Heading typography

```css
.prose h1 {
  font-family: var(--font-body);
  font-size: var(--size-h1);
  line-height: var(--lh-h1);
  font-weight: var(--weight-h1);
  max-width: var(--measure-display);
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
  color: var(--fg-default);
}

.prose h2 {
  font-family: var(--font-sans);
  font-size: var(--size-h2);
  line-height: var(--lh-h2);
  font-weight: var(--weight-h2);
  margin: var(--space-section) 0 0.75rem;
  letter-spacing: -0.005em;
  color: var(--fg-default);
}

.prose h3 {
  font-family: var(--font-sans);
  font-size: var(--size-h3);
  line-height: var(--lh-h3);
  font-weight: var(--weight-h3);
  margin: var(--space-subsection) 0 0.5rem;
  color: var(--fg-default);
}

.prose h4 {
  font-family: var(--font-sans);
  font-size: var(--size-h4);
  line-height: var(--lh-h4);
  font-weight: var(--weight-h4);
  margin: var(--space-block) 0 0.4rem;
  letter-spacing: 0.005em;
  text-transform: none;
  color: var(--fg-default);
}
```

The split: **H1 in Tiempos Text Web Semibold** (body serif at title moment, unified family for the article title). **H2/H3/H4 in Inter** (structural apparatus, sans for clarity).

This is the paired-family approach. Article opens with serif gravity at the title; structural headers feel like apparatus, not prose continuations.

### 3.5 Metadata and bylines

```css
.byline {
  font-family: var(--font-sans);
  font-size: var(--size-meta);
  line-height: var(--lh-meta);
  font-weight: 500;
  color: var(--fg-muted);
  letter-spacing: 0.01em;
}

.byline .author {
  color: var(--fg-default);
}

.byline .track-label {
  font-family: var(--font-sans);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
  color: var(--accent);
}

.byline .date {
  color: var(--fg-muted);
}

.byline .reading-time {
  color: var(--fg-subtle);
}
```

### 3.6 The Tiempos Text Medium use case

Medium (500) is the weight that gives Silicon Logic typographic depth between Regular and Semibold. The spec uses it for:

- **Pull-quote attribution** — quote in italic body, attribution in Tiempos Text Medium below
- **Section divider labels** when a section break has a topical label
- **Article series indicators** ("Part 2 of 4: Apple Silicon Memory Bandwidth")
- **Sub-byline metadata** when the byline area wants slight presence without being a header

Not used for: body text (always Regular), section headers (always Inter Semibold), display moments (always Semibold or Headline).

---

## 4. Color usage rules

### 4.1 Link styling

```css
a {
  color: var(--link-fg);
  text-decoration: underline;
  text-decoration-color: var(--link-fg);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
  text-decoration-skip-ink: auto;
}

a:hover {
  /* Hover affordance via underline thickness only; color stays for legibility */
  text-decoration-thickness: 2px;
}

a:visited {
  color: var(--link-fg-visited);
  text-decoration-color: var(--link-fg-visited);
}

/* Links inside body prose specifically — slightly different treatment */
.prose a {
  /* Article prose: dark text with accent underline.
     Accent functions as visual marker, text stays high-contrast. */
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

.prose a:hover {
  /* Hover affordance via underline thickness; text color stays for legibility */
  text-decoration-thickness: 2px;
}

.prose a:visited {
  /* Visited prose links: muted text, muted underline */
  color: var(--fg-muted);
  text-decoration-color: var(--fg-muted);
}
```

The principle: link semantics come from underline treatment and high-contrast text. Body-prose links inherit body color but use the accent color for the underline, so the brand marker is visible without the accent fighting the prose or failing AA-body contrast.

### 4.2 Accent color usage discipline

The warm orange/amber accent appears only at:
- **Inline body-prose link underlines**
- **Focus outlines and selection highlights**
- **Track labels** in the byline area (uppercase, small; AA-large acceptable)
- **Section kickers / divider labels** (uppercase, small; AA-large acceptable)
- **The publication wordmark** "Silicon Logic" in the header (optional — could also be `--fg-default`)

The accent does **not** appear at:
- Buttons (use bordered Inter Medium with `--fg-default` color)
- Background tints
- Pull quotes (use `--border-default` left border)
- Body-sized link text
- Callouts or signed-artifact treatments (use signed semantic color)

### 4.3 Signed-artifact color usage discipline

The muted teal (`--signed-fg`) is reserved exclusively for:
- **The cryptographic-signature badge** on benchmark artifacts
- **The verification-check icon** that accompanies the badge
- **The methodology callout border** when a callout marks signed-run methodology specifically
- **Optionally, a thin accent rule under benchmark tables** that contain signed data

The signed color never appears as decoration. It is a semantic color that means "verified, cryptographically signed" and nothing else. If a reader sees teal, it should mean exactly that.

### 4.4 Color application in code blocks

Code blocks use the syntax-highlighting theme (see §5). The accent and signed colors do not appear inside code blocks — code is its own visual domain.

---

## 5. Code block rendering

### 5.1 Pipeline

**Astro 6** ships with **Shiki v4** as the default Markdown highlighter. The site uses **Expressive Code** (the Astro-team-adjacent integration) layered on Shiki for annotation primitives (file-path headers, line ranges, diff markers, copy button).

### 5.2 Theme configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark-dimmed'],
      useDarkModeMediaQuery: false,  // theme driven by [data-theme] attribute
      themeCssSelector: (t) => `[data-theme="${t.type}"]`,
      emitExternalStylesheet: true,  // single hashed CSS file
      defaultProps: {
        frame: 'none',               // no fake editor chrome
        showLineNumbers: false,
        overridesByLang: {
          'bash,sh,shellscript': { frame: 'terminal' },
        },
      },
      plugins: [pluginLineNumbers()],
      styleOverrides: {
        codeFontFamily: 'var(--font-mono)',
        codeFontSize: 'var(--size-code)',
        codeLineHeight: 'var(--lh-code)',
        borderRadius: 'var(--radius-code)',
        borderColor: 'transparent',
        codeBackground: 'var(--bg-code-block)',
        frames: {
          shadowColor: 'transparent',
          editorActiveTabBackground: 'transparent',
          editorTabsMarginBlockStart: '0',
        },
      },
      minSyntaxHighlightingColorContrast: 5.5,
    }),
  ],
});
```

### 5.3 Code block rules

**Frame disabled by default.** No fake editor window, no tab chrome, no traffic-light decorations. Code blocks are editorial evidence boxes: tinted background, subtle (optional) border, generous padding, no ornamentation.

**File-path headers via Expressive Code's `title="..."` meta:**

````markdown
```python title="bench/inference.py"
result = model.forward(x)
return result.cpu()
```
````

Rendered as a small caption above the code block, in IBM Plex Mono, slightly dimmed, left-aligned. Not styled as a tab.

**Line numbers off by default.** Enable only when the prose references specific lines:

````markdown
```python title="bench/inference.py" showLineNumbers
...
```
````

**Long lines: horizontal scroll, never soft-wrap.** Soft-wrapping Python/bash/YAML misrepresents whitespace-sensitive code.

**Special handling for fingerprints/hashes.** Inline hashes and long fingerprints use `overflow-wrap: anywhere` or are placed in dedicated artifact lines:

```css
.fingerprint {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
  word-break: break-all;
}
```

**Diff highlighting** via Expressive Code's notation syntax:

````python
result = model.forward(x)        # [!code highlight]
return result.cpu()              # [!code ++]
return result                    # [!code --]
````

**Copy button** enabled (Expressive Code default). Always visible on hover-capable devices, always visible on touch. Real `<button>` element with `aria-label`.

### 5.4 Inline code

```css
code:not(pre code) {
  font-family: var(--font-mono);
  font-size: var(--size-inline-code);
  background: var(--bg-code-inline);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  white-space: nowrap;
  font-variant-ligatures: none;
  letter-spacing: 0.005em;
}

/* For long inline tokens (URLs, hashes), allow breaking */
code.breakable {
  white-space: normal;
  overflow-wrap: anywhere;
}
```

### 5.5 Terminal output

Bash/sh blocks use `frame="terminal"` for a different visual treatment. Output should be styled distinct from input — same monospace, same geometry, but no syntax highlighting and a slightly different surface:

````bash
$ python bench/inference.py
Loading model: llama-3.1-8b-instruct-Q4_K_S.gguf
Tokens/sec: 87.3 ± 2.1
````

For mixed input+output sessions, prefer two adjacent blocks so the command copies cleanly.

---

## 6. Layout

### 6.1 Page structure

Every article page follows this structure:

```
┌─────────────────────────────────────┐
│ Site header (sticky on scroll)      │
│ - Wordmark | Nav links | Theme tog. │
├─────────────────────────────────────┤
│                                     │
│ Byline area                         │
│ - Track label                       │
│ - H1 article title                  │
│ - Author • Date • Reading time      │
│                                     │
│ Prose lane (68ch)                   │
│ - Body paragraphs                   │
│ - Code blocks (94ch wider lane)     │
│ - Charts/tables (94ch wider lane)   │
│ - Blockquotes                       │
│ - Callouts                          │
│                                     │
│ Signed-runs footer block            │
│ - Verification metadata             │
│ - Methodology link                  │
│ - License/copyright                 │
│                                     │
├─────────────────────────────────────┤
│ Site footer                         │
│ - Feed links | Theme toggle | About │
└─────────────────────────────────────┘
```

Sticky table of contents appears in a right-side gutter on viewports ≥1280px wide. On narrower viewports, ToC collapses to a toggleable button or is hidden entirely.

### 6.2 Measure discipline

**Body prose:** 68ch. This is the primary reading column. Body paragraphs, headings, blockquotes, inline-flow content.

**Artifact lane:** 94ch. Code blocks, data tables, charts, figures. These can break out wider than the prose lane to give technical content room.

**Display measure:** 52ch for H1 titles specifically. This keeps titles from sprawling across the full prose width when the title is short.

CSS implementation:

```css
.prose {
  max-width: var(--measure-prose);
  margin-inline: auto;
}

.prose .artifact-lane {
  max-width: var(--measure-artifact);
  margin-inline: auto;
}

.prose pre,
.prose .data-table,
.prose figure {
  /* These break out to artifact-lane width */
  max-width: var(--measure-artifact);
  margin-inline: calc((var(--measure-prose) - var(--measure-artifact)) / 2);
}

@media (max-width: 1024px) {
  .prose pre,
  .prose .data-table,
  .prose figure {
    margin-inline: 0;
    max-width: 100%;
  }
}
```

### 6.3 Mobile reductions

At viewports ≤768px:
- Body size 17px (down from 18px)
- Measure becomes 100% with reasonable side padding
- Code blocks horizontal-scroll (do not soft-wrap)
- ToC hidden (or behind a button)
- Sticky header collapses (no shrink behavior — just stays consistent)

---

## 7. Information architecture

### 7.1 URL conventions

Hierarchical URLs without dates. Articles are reference content, not dated news.

```
silicon-logic.com/
├── /                              Home (broadcast)
├── /reviews/<slug>/               Individual review article
├── /benchmarks/<slug>/            Individual benchmark article
├── /reviews/                      Reviews track index
├── /benchmarks/                   Benchmarks track index
├── /methodology/                  Methodology document (single-page)
├── /methodology/<concept>/        Specific methodology concept page
├── /concepts/                     Concepts taxonomy index
├── /concepts/<concept>/           Articles tagged with this concept
├── /archive/                      Compressed full archive
├── /artifacts/<sha-prefix>/       Cryptographically signed run artifacts
├── /about/                        About the author and the publication
├── /feeds/                        Multi-RSS directory
└── /feeds/all.xml                 Firehose RSS feed
    /feeds/reviews.xml             Reviews-only feed
    /feeds/benchmarks.xml          Benchmarks-only feed
```

### 7.2 Top navigation

```
[Silicon Logic wordmark]    Reviews · Benchmarks · Methodology · Concepts · Archive · About
```

Always visible. Sticky on scroll. No mega-menus, no dropdowns (mobile uses hamburger that exposes the same flat list).

The Concepts taxonomy is the Stratechery-pattern innovation — articles tagged by analytical framework (memory bandwidth modeling, quantization analysis, GQA inference math, cryptographic verification) with each framework as its own page nesting the articles that use it.

### 7.3 Home page ("the broadcast")

```
┌─────────────────────────────────────┐
│ HERO                                │
│ - Single most-recent or most-       │
│   important article                 │
│ - Track label, title, dek, byline   │
├─────────────────────────────────────┤
│ SPLIT FEED                          │
│ ┌──────────────┬──────────────┐    │
│ │ Latest       │ Latest       │    │
│ │ Reviews      │ Benchmarks   │    │
│ │              │              │    │
│ │ • Article 1  │ • Article A  │    │
│ │ • Article 2  │ • Article B  │    │
│ │ • Article 3  │ • Article C  │    │
│ └──────────────┴──────────────┘    │
├─────────────────────────────────────┤
│ METHODOLOGY CALLOUT                 │
│ - Brief signed-artifact statement   │
│ - Link to methodology page          │
└─────────────────────────────────────┘
```

No subscribe modal. No social-engagement furniture. No newsletter capture above the fold. The home page is for readers, not for capturing readers.

### 7.4 Archive page ("the library")

```
2026
  May
    14  REVIEWS    Apple Silicon Memory Bandwidth Analysis
    09  BENCHMARKS Llama 3.1 8B Q4_K_S Comprehensive Run
    02  REVIEWS    First-Token Latency on M5 Max

  April
    27  BENCHMARKS Mistral 7B Q4_K_S Inference
    ...

2025
  ...
```

Dense, text-only, no thumbnails. Grouped by Year > Month. Each row: date · track label · article title. Year and Month headings in Inter Semibold; row content in Tiempos Text Web Regular with Inter for the track label.

JavaScript filter toggle at the top lets readers hide one track:

```
[All]  [Reviews only]  [Benchmarks only]
```

Filter is client-side, no page reload, no URL parameter pollution by default (optionally `?track=reviews` for shareable filtered views).

### 7.5 Concepts taxonomy page

```
Concepts

Memory & Bandwidth
  ↳ Memory Bandwidth Modeling
    ↳ Apple Silicon Unified Memory
    ↳ M5 Max Memory Architecture
    ↳ Llama Inference Bandwidth Math
  ↳ Quantization & Memory Footprint
    ↳ Q4_K_S Calibration Analysis
    ↳ GGUF Format Internals

Inference & Throughput
  ↳ GQA Inference Math
  ↳ First-Token Latency
  ↳ Tail-Latency Distributions

Methodology & Verification
  ↳ Cryptographic Run Signing
  ↳ BenchmarkRun Artifact Format
  ↳ Reproducibility Standards
```

Each concept name is a link to its dedicated page, which lists all articles that apply or develop it. This is what compounds editorial value across the five-year archive.

### 7.6 Single-article structure

```
[Track Label uppercase orange small Inter Semibold]

[H1: Article Title in Tiempos Text Web Semibold]

[Dek/standfirst — optional, in Tiempos Text Web Regular Italic, fg-muted]

By Douglas Vargas  ·  May 14, 2026  ·  18 min read
[byline in Inter Medium fg-muted, track label and date as separators]

[Sticky ToC on right side ≥1280px viewport]

[Body prose in 68ch lane]
[Code/tables/figures break out to 94ch artifact lane]

──────────────────────────────────────

Signed Run Footer Block:
  ┌─────────────────────────────────┐
  │ ✓ Cryptographically Signed      │
  │                                 │
  │ Run ID: 2026-05-14-1830-llama   │
  │ Artifact: artifacts/<sha-prefix>│
  │ Methodology: /methodology/...   │
  │ Verify: github.com/Silicon-Logic/...   │
  └─────────────────────────────────┘

Series Navigation (if applicable):
  ← Previous in Series: Part 1
  → Next in Series: Part 3

Related in Reviews:
  • Related Article 1
  • Related Article 2
```

### 7.7 Multi-RSS strategy

Three feeds always available:

- `/feeds/all.xml` — firehose, every article
- `/feeds/reviews.xml` — Reviews track only
- `/feeds/benchmarks.xml` — Benchmarks track only

Full-content feeds (not excerpt). Atom format (better metadata than RSS 2.0). Linked from `/feeds/` directory page and from the site footer.

---

## 8. Component vocabulary

### 8.1 Byline component

```html
<header class="byline">
  <div class="track-label">Reviews</div>
  <h1>Apple Silicon Memory Bandwidth Analysis</h1>
  <p class="dek">Why the M5 Max's 460 GB/s peak matters for Llama inference,
     and where it doesn't.</p>
  <div class="meta">
    <span class="author">Douglas Vargas</span>
    <span class="separator">·</span>
    <time datetime="2026-05-14">May 14, 2026</time>
    <span class="separator">·</span>
    <span class="reading-time">18 min read</span>
  </div>
</header>
```

### 8.2 Signed-artifact badge

Two variants: inline (within prose) and footer (large, end-of-article).

**Inline variant:**
```html
<span class="signed-badge">
  <svg class="check-icon" /> Signed Run · <code>2026-05-14-llama</code>
</span>
```

**Footer variant:**
```html
<aside class="signed-footer">
  <h4 class="signed-heading">
    <svg class="check-icon" /> Cryptographically Signed Run
  </h4>
  <dl class="signed-meta">
    <dt>Run ID</dt><dd><code>2026-05-14-1830-llama</code></dd>
    <dt>Artifact</dt><dd><a href="/artifacts/abc123...">SHA-256: abc123...</a></dd>
    <dt>Methodology</dt><dd><a href="/methodology/inference">v2.1</a></dd>
    <dt>Verify</dt><dd><a href="https://github.com/Silicon-Logic/silicon-logic#verifying">Instructions</a></dd>
  </dl>
</aside>
```

Both use `--signed-fg`, `--signed-bg`, `--signed-border` colors.

### 8.3 Callout components

Three types, each with distinct visual treatment:

**Note** — neutral, low-prominence:
```css
.callout-note {
  border-left: 3px solid var(--border-muted);
  padding: 0 0 0 1rem;
  color: var(--fg-muted);
  margin: var(--space-block) 0;
}
```

**Caveat** — author honesty about uncertainty:
```css
.callout-caveat {
  border-left: 3px solid var(--signed-fg);
  padding: 0 0 0 1rem;
  font-style: italic;
  color: var(--fg-default);
  margin: var(--space-block) 0;
}
```

**Methodology** — load-bearing, full treatment:
```css
.callout-methodology {
  background: var(--signed-bg);
  border: 1px solid var(--signed-border);
  border-left: 4px solid var(--signed-fg);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-callout);
  margin: var(--space-block) 0;
}

.callout-methodology h4 {
  color: var(--signed-fg);
  margin-top: 0;
}
```

### 8.4 Blockquote

```css
blockquote {
  border-left: 3px solid var(--border-default);
  padding: 0 0 0 1.25rem;
  margin: var(--space-block) 0;
  font-style: italic;
  color: var(--fg-muted);
}

blockquote cite {
  display: block;
  font-style: normal;
  font-family: var(--font-body);
  font-weight: 500;  /* Tiempos Text Medium */
  font-size: 0.9rem;
  color: var(--fg-default);
  margin-top: 0.5rem;
}

blockquote cite::before {
  content: "— ";
}
```

### 8.5 Data table

```css
.data-table {
  max-width: var(--measure-artifact);
  margin: var(--space-block) auto;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-default);
  padding: 0.5rem 1rem 0.5rem 0;
  color: var(--fg-default);
}

.data-table td {
  padding: 0.4rem 1rem 0.4rem 0;
  border-bottom: 1px solid var(--border-muted);
  color: var(--fg-default);
  font-variant-numeric: tabular-nums;  /* aligned numbers */
}

.data-table td.numeric {
  text-align: right;
  font-feature-settings: "tnum" 1;
}
```

### 8.6 Track label badge

```css
.track-label {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: 0.5rem;
}
```

### 8.7 Wordmark

```css
.wordmark {
  font-family: var(--font-display);  /* Tiempos Headline */
  font-weight: 700;                   /* or 900 for Black variant */
  font-size: var(--size-wordmark);
  letter-spacing: -0.01em;
  color: var(--fg-default);
  text-decoration: none;
}

/* Reserved for the masthead only — never used elsewhere */
```

### 8.8 Buttons (rare — used for theme toggle, archive filter)

```css
.btn {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--fg-default);
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: var(--bg-subtle);
}

.btn[aria-pressed="true"] {
  background: var(--fg-default);
  color: var(--bg-canvas);
  border-color: var(--fg-default);
}
```

Buttons are utility, not editorial. Inter, restrained, no accent color.

---

## 9. Dark mode behavior

### 9.1 Three-state toggle

States stored in `localStorage` under key `silicon-logic-theme`:
- `"light"` — explicitly light, ignores system preference
- `"dark"` — explicitly dark, ignores system preference
- absent — follow system preference via `prefers-color-scheme`

### 9.2 Toggle placement

Footer of every page. Right-aligned, alongside feed links. Three-button group:

```html
<fieldset class="theme-toggle">
  <legend class="visually-hidden">Theme</legend>
  <button data-theme-set="light" aria-pressed="false">Light</button>
  <button data-theme-set="dark" aria-pressed="false">Dark</button>
  <button data-theme-set="system" aria-pressed="true">Auto</button>
</fieldset>
```

### 9.3 FOUC prevention

Inline `<script>` in `<head>` before any stylesheet:

```html
<script>
  (function() {
    try {
      var stored = localStorage.getItem('silicon-logic-theme');
      var theme = stored ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

The `try/catch` handles privacy-mode browsers where `localStorage` access throws.

### 9.4 System preference change listening

For users who pick "system," listen for OS preference changes mid-session:

```javascript
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('silicon-logic-theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});
```

### 9.5 Default behavior

First-time visitor with no stored preference: follow system. Most readers have a meaningful system preference. Respecting it is the courteous default.

---

## 10. Honest open items

Documented for future Phase work, not blocking v1.

**10.1 Wordmark design.** The current spec uses "Silicon Logic" typeset in Tiempos Headline Bold or Black as the wordmark. This is functional but not distinctive. A proper wordmark (custom letterspacing, possibly a small icon mark, established visual identity) is Phase 6 polish work.

**10.2 Methodology page design.** The methodology page is referenced throughout the spec but its detailed design (how the cryptographic-signing process is explained, how methodology versions are tracked, how the verification instructions are presented) is its own design challenge. Defer to first article publish-prep.

**10.3 Series navigation visual treatment.** Spec includes "← Previous in Series / → Next in Series" but doesn't fully visual-design it. First series article will inform.

**10.4 OG image generation.** Social-preview images for articles need their own design. Since the Tiempos license is web-only (no desktop license owned), OG images will use Inter (which has a desktop-usable open-source license) for titles, with Silicon Logic's brand mark as the visual anchor. Defer detailed design to Phase 6.

**10.5 RSS feed XSL stylesheet.** Some publications style their `.xml` feeds with XSL so they render in browsers as readable pages. Decide later.

**10.6 Search.** Not in v1. At year-1 article counts (<20 articles), browsing is sufficient. Re-evaluate at year 2.

**10.7 Print stylesheet.** Not in v1. Articles render readably in browser print preview. A proper print stylesheet (page numbers, footnote handling, code-block treatment) is Phase 6+.

**10.8 APCA contrast scores.** WCAG 2.x ratios documented in §2.3. APCA scores should be computed in the same docs/color-contrast.md artifact when the design is implemented. APCA still not in WCAG 3 draft (August 2025), so AAA on WCAG 2.x remains the floor.

**10.9 Variable font usage.** Klim shipped variable WOFF2 files for Tiempos Text and Italic in the Collection package. The spec uses static instances for clarity and reduced file size for the specific weights needed. Variable fonts could be revisited if Silicon Logic ever needs more weight flexibility than the four locked weights provide.

---

## 11. File organization (target structure)

```
silicon-logic-site/
├── astro.config.mjs              # Astro 6 config with Expressive Code
├── package.json
├── public/
│   ├── fonts/                    # served from CDN, license-aware
│   │   ├── tiempos/              # NOT committed to public repo
│   │   ├── inter/                # OFL, can commit publicly
│   │   └── plex-mono/            # OFL, can commit publicly
│   └── feeds/                    # generated RSS/Atom
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # root <html>, theme init, head
│   │   ├── ArticleLayout.astro   # article page wrapper
│   │   └── IndexLayout.astro     # archive/track index wrapper
│   ├── components/
│   │   ├── Byline.astro
│   │   ├── SignedBadge.astro
│   │   ├── SignedFooter.astro
│   │   ├── Callout.astro
│   │   ├── DataTable.astro
│   │   ├── TrackLabel.astro
│   │   ├── ThemeToggle.astro
│   │   ├── SiteHeader.astro
│   │   ├── SiteFooter.astro
│   │   └── ToC.astro
│   ├── styles/
│   │   ├── tokens.css            # all design tokens
│   │   ├── base.css              # element resets and typography base
│   │   ├── components.css        # component styles
│   │   └── theme-init.html       # inline FOUC-prevention script
│   └── pages/
│       ├── index.astro           # home / broadcast
│       ├── archive.astro         # full archive
│       ├── about.astro
│       ├── methodology/
│       ├── concepts/
│       ├── reviews/
│       │   └── [slug].astro
│       ├── benchmarks/
│       │   └── [slug].astro
│       ├── feeds/
│       │   ├── all.xml.ts        # generates firehose Atom feed
│       │   ├── reviews.xml.ts
│       │   └── benchmarks.xml.ts
│       └── styleguide.astro      # internal: renders all components
├── docs/
│   └── design/
│       ├── site-design-system-v1.md  # this file
│       ├── color-contrast.md         # computed WCAG + APCA scores
│       └── typography-license.md     # Klim license documentation
└── content/
    ├── reviews/                  # markdown articles via submodule
    └── benchmarks/               # markdown articles via submodule
```

---

## 12. Phase 1 implementation checklist

The Codex/Claude Code prompt for Phase 1 should execute against this spec by:

1. **Create `src/styles/tokens.css`** with all design tokens from §2.1, §2.2, §2.4, §2.5
2. **Create `src/styles/base.css`** with element resets, body typography, heading typography, link styling, code styling per §3 and §4
3. **Create `src/styles/components.css`** with all component styles from §8
4. **Create `src/layouts/BaseLayout.astro`** with FOUC-prevention script (§9.3), `<head>` meta, font preloads (§3.2), and outer page structure
5. **Configure `astro.config.mjs`** with Expressive Code per §5.2
6. **Install fonts** in `public/fonts/` (Inter + IBM Plex Mono committed; Tiempos hosted privately or via Cloudflare R2)
7. **Create `src/pages/styleguide.astro`** — internal page that renders every component, every type style, every color token, every code-block variant for visual review
8. **Create `src/components/ThemeToggle.astro`** with three-state behavior per §9
9. **Verify** all contrast ratios in light and dark mode against §2.3 table
10. **Commit** all of this on `feature/design-system-v1-implementation` branch in the silicon-logic-site repo

The /styleguide page is the verification artifact. If it renders correctly with all components, all type styles, all color tokens, all code variants, and the theme toggle works without FOUC — Phase 1 is complete.

---

## 13. Decisions explicitly NOT made in v1

For future reference, these are deliberately deferred:

- Final wordmark/logo design
- Author photo treatment (currently: no photo)
- Newsletter signup design (currently: no newsletter)
- Comment system (currently: no comments)
- Subscription/paywall design (currently: none — open access)
- Sharing buttons (currently: none — readers share by URL)
- Reading-progress indicator (currently: none)
- Bookmarking UI (currently: none)
- Article ratings or feedback (currently: none)
- Social-media linking from articles (currently: none)
- Embedded media (video, audio) treatment (defer to first article needing it)
- Internationalization (currently: en-US only)
- Sitemap structure beyond standard sitemap.xml

Each of these is a deliberate omission. If Silicon Logic needs any of them later, they get their own design pass with explicit reasoning, not added to v1 by drift.
