import { phase, status, success, fmt } from "@shipcli/core/output";
import { share } from "@shipcli/share";
import { shareCard } from "../share-card.js";

export async function run(target, options) {
  phase(`Analyzing ${fmt.app(target || ".")}`);
  status("Scanning...");

  // Your CLI logic here
  var result = { target: target || ".", status: "ok" };
  var shareImage;

  if (options.share) {
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
