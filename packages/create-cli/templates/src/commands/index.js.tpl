import { phase, status, success, fmt } from "@shipcli/core/output";

export async function run(target, options) {
  phase(`Analyzing ${fmt.app(target || ".")}`);
  status("Scanning...");

  // Your CLI logic here

  success("Done!");

  if (options.json) {
    console.log(JSON.stringify({ target, status: "ok" }, null, 2));
  }
}
