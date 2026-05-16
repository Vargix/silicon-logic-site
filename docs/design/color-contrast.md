# Color Contrast Verification

Generated against design system v1 (see `docs/design/site-design-system-v1.md` §2.3).

Ratios use the WCAG 2.x sRGB relative luminance formula and the hex equivalents annotated in the spec.

## Light mode

| Pair | Hex | Computed | Spec | Verdict | Match? |
|---|---|---:|---:|---|---|
| fg-default on bg-canvas | #1f2024 on #fbfaf7 | 15.59:1 | 15.9:1 | AAA | No |
| fg-default on bg-elevated | #1f2024 on #ffffff | 16.27:1 | 16.6:1 | AAA | No |
| fg-muted on bg-canvas | #5e6068 on #fbfaf7 | 6.01:1 | 6.9:1 | AA body | No |
| fg-subtle on bg-canvas | #8a8c93 on #fbfaf7 | 3.22:1 | 3.8:1 | AA large | No |
| accent on bg-canvas | #c87238 on #fbfaf7 | 3.40:1 | 5.2:1 | AA large | No |
| accent-visited on bg-canvas | #88553a on #fbfaf7 | 5.90:1 | 4.6:1 | AA body | No |
| fg-default on bg-code-inline | #1f2024 on #efece5 | 13.79:1 | 14.5:1 | AAA | No |
| signed-fg on signed-bg | #2c6470 on #dde8ec | 5.32:1 | 5.4:1 | AA body | Yes |

## Dark mode

| Pair | Hex | Computed | Spec | Verdict | Match? |
|---|---|---:|---:|---|---|
| fg-default on bg-canvas | #e8e5dd on #111317 | 14.77:1 | 14.7:1 | AAA | Yes |
| fg-default on bg-elevated | #e8e5dd on #1a1d22 | 13.42:1 | 12.4:1 | AAA | No |
| fg-muted on bg-canvas | #a8a59c on #111317 | 7.55:1 | 8.0:1 | AAA | No |
| fg-subtle on bg-canvas | #7d7a71 on #111317 | 4.33:1 | 4.5:1 | AA large | No |
| accent on bg-canvas | #e8a877 on #111317 | 9.12:1 | 9.2:1 | AAA | Yes |
| accent-visited on bg-canvas | #b6906f on #111317 | 6.38:1 | 6.4:1 | AA body | Yes |
| signed-fg on signed-bg | #82c0cc on #1f323a | 6.58:1 | 6.7:1 | AA body | Yes |

## Discrepancies

- fg-default on bg-canvas: computed 15.59:1 from #1f2024 on #fbfaf7, spec claims 15.9:1.
- fg-default on bg-elevated: computed 16.27:1 from #1f2024 on #ffffff, spec claims 16.6:1.
- fg-muted on bg-canvas: computed 6.01:1 from #5e6068 on #fbfaf7, spec claims 6.9:1.
- fg-subtle on bg-canvas: computed 3.22:1 from #8a8c93 on #fbfaf7, spec claims 3.8:1.
- accent on bg-canvas: computed 3.40:1 from #c87238 on #fbfaf7, spec claims 5.2:1.
- accent-visited on bg-canvas: computed 5.90:1 from #88553a on #fbfaf7, spec claims 4.6:1.
- fg-default on bg-code-inline: computed 13.79:1 from #1f2024 on #efece5, spec claims 14.5:1.
- fg-default on bg-elevated: computed 13.42:1 from #e8e5dd on #1a1d22, spec claims 12.4:1.
- fg-muted on bg-canvas: computed 7.55:1 from #a8a59c on #111317, spec claims 8.0:1.
- fg-subtle on bg-canvas: computed 4.33:1 from #7d7a71 on #111317, spec claims 4.5:1.
