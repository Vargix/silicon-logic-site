#!/usr/bin/env python3
"""Generate WCAG 2.x contrast verification for Silicon Logic design tokens."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Pair:
    name: str
    foreground: str
    background: str
    spec: str
    claimed: float


LIGHT_MODE = [
    Pair("fg-default on bg-canvas", "#1f2024", "#fbfaf7", "15.59:1", 15.59),
    Pair("fg-default on bg-elevated", "#1f2024", "#ffffff", "16.27:1", 16.27),
    Pair("fg-muted on bg-canvas", "#5e6068", "#fbfaf7", "6.01:1", 6.01),
    Pair("fg-subtle on bg-canvas", "#8a8c93", "#fbfaf7", "3.22:1", 3.22),
    Pair("link-fg on bg-canvas", "#1f2024", "#fbfaf7", "15.59:1", 15.59),
    Pair("link-fg-visited on bg-canvas", "#5e6068", "#fbfaf7", "6.01:1", 6.01),
    Pair("accent on bg-canvas (decorative/small labels)", "#c87238", "#fbfaf7", "3.40:1", 3.40),
    Pair("fg-default on bg-code-inline", "#1f2024", "#efece5", "13.79:1", 13.79),
    Pair("signed-fg on signed-bg", "#2c6470", "#dde8ec", "5.32:1", 5.32),
]

DARK_MODE = [
    Pair("fg-default on bg-canvas", "#e8e5dd", "#111317", "14.77:1", 14.77),
    Pair("fg-default on bg-elevated", "#e8e5dd", "#1a1d22", "13.42:1", 13.42),
    Pair("fg-muted on bg-canvas", "#a8a59c", "#111317", "7.55:1", 7.55),
    Pair("fg-subtle on bg-canvas", "#7d7a71", "#111317", "4.33:1", 4.33),
    Pair("link-fg on bg-canvas", "#e8e5dd", "#111317", "14.77:1", 14.77),
    Pair("link-fg-visited on bg-canvas", "#a8a59c", "#111317", "7.55:1", 7.55),
    Pair("accent on bg-canvas (decorative/small labels)", "#e8a877", "#111317", "9.12:1", 9.12),
    Pair("signed-fg on signed-bg", "#82c0cc", "#1f323a", "6.58:1", 6.58),
]


def srgb_channel(value: int) -> float:
    normalized = value / 255
    if normalized <= 0.03928:
        return normalized / 12.92
    return ((normalized + 0.055) / 1.055) ** 2.4


def relative_luminance(hex_color: str) -> float:
    value = hex_color.lstrip("#")
    red = srgb_channel(int(value[0:2], 16))
    green = srgb_channel(int(value[2:4], 16))
    blue = srgb_channel(int(value[4:6], 16))
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


def contrast_ratio(foreground: str, background: str) -> float:
    fg_luminance = relative_luminance(foreground)
    bg_luminance = relative_luminance(background)
    lighter = max(fg_luminance, bg_luminance)
    darker = min(fg_luminance, bg_luminance)
    return (lighter + 0.05) / (darker + 0.05)


def verdict(ratio: float) -> str:
    if ratio >= 7:
        return "AAA"
    if ratio >= 4.5:
        return "AA body"
    if ratio >= 3:
        return "AA large"
    return "Fail"


def matches_spec(computed: float, claimed: float) -> bool:
    return abs(computed - claimed) <= 0.01


def table_for(pairs: list[Pair]) -> tuple[str, list[str]]:
    rows = [
        "| Pair | Hex | Computed | Spec | Verdict | Match? |",
        "|---|---|---:|---:|---|---|",
    ]
    discrepancies: list[str] = []

    for pair in pairs:
        ratio = contrast_ratio(pair.foreground, pair.background)
        match = matches_spec(ratio, pair.claimed)
        rows.append(
            f"| {pair.name} | {pair.foreground} on {pair.background} | "
            f"{ratio:.2f}:1 | {pair.spec} | {verdict(ratio)} | "
            f"{'Yes' if match else 'No'} |"
        )
        if not match:
            discrepancies.append(
                f"- {pair.name}: computed {ratio:.2f}:1 from {pair.foreground} on "
                f"{pair.background}, spec claims {pair.spec}."
            )

    return "\n".join(rows), discrepancies


def main() -> None:
    light_table, light_discrepancies = table_for(LIGHT_MODE)
    dark_table, dark_discrepancies = table_for(DARK_MODE)
    discrepancies = light_discrepancies + dark_discrepancies

    output = "\n".join(
        [
            "# Color Contrast Verification",
            "",
            "Generated against design system v1 (see `docs/design/site-design-system-v1.md` §2.3).",
            "",
            "Ratios use the WCAG 2.x sRGB relative luminance formula and the hex equivalents annotated in the spec.",
            "",
            "Inline prose links use high-contrast text with `--accent` only as `text-decoration-color`; that accent underline is not treated as a foreground text contrast pair.",
            "The `--accent` text pair below is documented for constrained brand/decorative uses such as uppercase track labels and section kickers.",
            "",
            "## Light mode",
            "",
            light_table,
            "",
            "## Dark mode",
            "",
            dark_table,
            "",
            "## Discrepancies",
            "",
            "\n".join(discrepancies) if discrepancies else "None.",
            "",
        ]
    )

    Path("docs/design/color-contrast.md").write_text(output, encoding="utf-8")


if __name__ == "__main__":
    main()
