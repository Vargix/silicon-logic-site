import { Resvg } from "@resvg/resvg-js";

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 72;

interface OgImageOptions {
  title: string;
  trackLabel?: string;
  date?: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function wrapTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= 30) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  const visibleLines = lines.slice(0, 4);

  if (lines.length > visibleLines.length) {
    const lastLine = visibleLines[visibleLines.length - 1] ?? "";
    visibleLines[visibleLines.length - 1] = `${lastLine.replace(/\s+\S+$/, "") || lastLine}...`;
  }

  return visibleLines.length > 0 ? visibleLines : ["Silicon Logic"];
}

function renderTitleLines(title: string) {
  return wrapTitle(title)
    .map(
      (line, index) =>
        `<tspan x="${PADDING}" dy="${index === 0 ? 0 : 80}">${escapeHtml(line)}</tspan>`,
    )
    .join("");
}

export async function renderOgImage({ title, trackLabel, date }: OgImageOptions) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fbfaf7"/>
  <text x="${PADDING}" y="104" fill="#c87238" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="2">
    ${escapeHtml((trackLabel ?? "Silicon Logic").toUpperCase())}
  </text>
  ${
    date
      ? `<text x="${WIDTH - PADDING}" y="104" fill="#5e6068" font-family="Arial, Helvetica, sans-serif" font-size="28" text-anchor="end">${escapeHtml(date)}</text>`
      : ""
  }
  <text x="${PADDING}" y="284" fill="#1f2024" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700">
    ${renderTitleLines(title)}
  </text>
  <text x="${PADDING}" y="560" fill="#1f2024" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700">
    Silicon Logic
  </text>
</svg>`;

  return new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  }).render().asPng();
}
