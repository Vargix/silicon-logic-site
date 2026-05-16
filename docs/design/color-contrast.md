# Color Contrast Verification

Generated against design system v1 (see `docs/design/site-design-system-v1.md` §2.3).

Ratios use the WCAG 2.x sRGB relative luminance formula and the hex equivalents annotated in the spec.

Inline prose links use high-contrast text with `--accent` only as `text-decoration-color`; that accent underline is not treated as a foreground text contrast pair.
The `--accent` text pair below is documented for constrained brand/decorative uses such as uppercase track labels and section kickers.

## Light mode

| Pair | Hex | Computed | Spec | Verdict | Match? |
|---|---|---:|---:|---|---|
| fg-default on bg-canvas | #1f2024 on #fbfaf7 | 15.59:1 | 15.59:1 | AAA | Yes |
| fg-default on bg-elevated | #1f2024 on #ffffff | 16.27:1 | 16.27:1 | AAA | Yes |
| fg-muted on bg-canvas | #5e6068 on #fbfaf7 | 6.01:1 | 6.01:1 | AA body | Yes |
| fg-subtle on bg-canvas | #8a8c93 on #fbfaf7 | 3.22:1 | 3.22:1 | AA large | Yes |
| link-fg on bg-canvas | #1f2024 on #fbfaf7 | 15.59:1 | 15.59:1 | AAA | Yes |
| link-fg-visited on bg-canvas | #5e6068 on #fbfaf7 | 6.01:1 | 6.01:1 | AA body | Yes |
| accent on bg-canvas (decorative/small labels) | #c87238 on #fbfaf7 | 3.40:1 | 3.40:1 | AA large | Yes |
| fg-default on bg-code-inline | #1f2024 on #efece5 | 13.79:1 | 13.79:1 | AAA | Yes |
| signed-fg on signed-bg | #2c6470 on #dde8ec | 5.32:1 | 5.32:1 | AA body | Yes |

## Dark mode

| Pair | Hex | Computed | Spec | Verdict | Match? |
|---|---|---:|---:|---|---|
| fg-default on bg-canvas | #e8e5dd on #111317 | 14.77:1 | 14.77:1 | AAA | Yes |
| fg-default on bg-elevated | #e8e5dd on #1a1d22 | 13.42:1 | 13.42:1 | AAA | Yes |
| fg-muted on bg-canvas | #a8a59c on #111317 | 7.55:1 | 7.55:1 | AAA | Yes |
| fg-subtle on bg-canvas | #7d7a71 on #111317 | 4.33:1 | 4.33:1 | AA large | Yes |
| link-fg on bg-canvas | #e8e5dd on #111317 | 14.77:1 | 14.77:1 | AAA | Yes |
| link-fg-visited on bg-canvas | #a8a59c on #111317 | 7.55:1 | 7.55:1 | AAA | Yes |
| accent on bg-canvas (decorative/small labels) | #e8a877 on #111317 | 9.12:1 | 9.12:1 | AAA | Yes |
| signed-fg on signed-bg | #82c0cc on #1f323a | 6.58:1 | 6.58:1 | AA body | Yes |

## Discrepancies

None.
