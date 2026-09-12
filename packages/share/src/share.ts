import { writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { success, hint, fmt } from "@shipcli/core/output";
import { generateOgImage } from "./og-image.js";
import type { OgTemplate } from "./og-image.js";

export interface ShareOptions {
  toolName?: string;
  filename?: string;
  outDir?: string;
  width?: number;
  height?: number;
}

export async function share<Data>(
  template: OgTemplate<Data>,
  data: Data,
  options: ShareOptions = {},
): Promise<string> {
  const toolName = options.toolName || "shipcli";
  let filename = options.filename || `${toolName}-share.png`;

  // Sanitize filename to prevent path traversal
  filename = basename(filename);

  const outDir = options.outDir || process.cwd();
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, filename);

  const png = await generateOgImage(template, data, {
    width: options.width || 1200,
    height: options.height || 630,
  });

  writeFileSync(outPath, png);
  success(`Share image saved to ${fmt.url(outPath)}`);
  hint("Share", `Upload this image to X/LinkedIn for maximum reach`);

  return outPath;
}
