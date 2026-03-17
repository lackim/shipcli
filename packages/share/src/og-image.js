import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

var __dirname = dirname(fileURLToPath(import.meta.url));

var fontCache = null;

async function loadFont() {
  if (fontCache) return fontCache;

  // Try to load Inter from system, fallback to fetching from Google Fonts
  try {
    var res = await fetch(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
    );
    var css = await res.text();
    var fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (fontUrl) {
      var fontRes = await fetch(fontUrl);
      fontCache = await fontRes.arrayBuffer();
      return fontCache;
    }
  } catch {}

  // Fallback: fetch directly from Google Fonts CDN
  try {
    var directRes = await fetch(
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
    );
    fontCache = await directRes.arrayBuffer();
    return fontCache;
  } catch {}

  return null;
}

export async function generateOgImage(template, data, options = {}) {
  var width = options.width || 1200;
  var height = options.height || 630;

  var element = template(data);
  var font = await loadFont();

  var fonts = font
    ? [
        { name: "Inter", data: font, weight: 400, style: "normal" },
        { name: "Inter", data: font, weight: 700, style: "normal" },
      ]
    : [];

  var svg = await satori(element, {
    width,
    height,
    fonts,
  });

  var resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });

  var pngData = resvg.render();
  return pngData.asPng();
}
