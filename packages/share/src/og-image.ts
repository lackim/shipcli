import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
export interface SatoriElement {
  type: string;
  props: Record<string, unknown>;
}
export type OgTemplate<Data> = (data: Data) => SatoriElement;

export interface OgImageOptions {
  width?: number;
  height?: number;
  fonts?: Font[];
}

let fontCache: Font[] | undefined;

function loadFonts(): Font[] {
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

export async function generateOgImage<Data>(
  template: OgTemplate<Data>,
  data: Data,
  options: OgImageOptions = {},
): Promise<Buffer> {
  const width = options.width || 1200;
  const height = options.height || 630;

  const element = template(data);
  const fonts = options.fonts || loadFonts();

  const svg = await satori(element as Parameters<typeof satori>[0], {
    width,
    height,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
