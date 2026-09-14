import { phase, status, success, fmt } from "@shipcli/core/output";
import { loadShipcliConfig } from "@shipcli/core/project-config";
import { share } from "@shipcli/share";
import { shareCard } from "../share-card.js";

export interface RunOptions {
  json?: boolean;
  share?: boolean;
}

export async function run(target: string | undefined, options: RunOptions): Promise<void> {
  const config = await loadShipcliConfig();
  phase(`Analyzing ${fmt.app(target || ".")}`);
  status("Scanning...");

  // Your CLI logic here
  const result = { target: target || ".", status: "ok" };
  let shareImage: string | undefined;

  if (options.share && config.share?.enabled !== false) {
    shareImage = await share(shareCard, result, {
      toolName: "{{name}}",
      filename: "{{name}}-result.png",
    });
  }

  if (options.json) {
    console.log(JSON.stringify({ ...result, shareImage }, null, 2));
  } else {
    success("Done!");
  }
}
