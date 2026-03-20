import { writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { success, hint, fmt } from "@shipcli/core/output";
import { generateOgImage } from "./og-image.js";

export async function share(template, data, options = {}) {
  var toolName = options.toolName || "shipcli";
  var filename = options.filename || `${toolName}-share.png`;

  // Sanitize filename to prevent path traversal
  filename = basename(filename);

  var outDir = options.outDir || process.cwd();
  mkdirSync(outDir, { recursive: true });
  var outPath = join(outDir, filename);

  var png = await generateOgImage(template, data, {
    width: options.width || 1200,
    height: options.height || 630,
  });

  writeFileSync(outPath, png);
  success(`Share image saved to ${fmt.url(outPath)}`);
  hint("Share", `Upload this image to X/LinkedIn for maximum reach`);

  return outPath;
}
