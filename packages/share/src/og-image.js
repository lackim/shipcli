import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { createRequire } from "module";

var require = createRequire(import.meta.url);
var fontCache;

function loadFonts() {
  if (fontCache) return fontCache;

  fontCache = [
    {
      name: "Inter",
      data: readFileSync(require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff")),
      weight: 400,
      style: "normal",
    },
    {
      name: "Inter",
      data: readFileSync(require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff")),
      weight: 700,
      style: "normal",
    },
  ];

  return fontCache;
}

export async function generateOgImage(template, data, options = {}) {
  var width = options.width || 1200;
  var height = options.height || 630;

  var element = template(data);
  var fonts = options.fonts || loadFonts();

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
