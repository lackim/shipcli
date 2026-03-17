import { Command } from "commander";
import { checkForUpdate } from "./update-check.js";
import { setupErrorHandler } from "./error-handler.js";

export function createCLI({ name, description, version, configDir }) {
  var program = new Command();

  program
    .name(name)
    .description(description)
    .version(version);

  program.option("--json", "Output as JSON");

  program.hook("preAction", async () => {
    await checkForUpdate(name, version);
  });

  setupErrorHandler(name);

  program.run = () => program.parse();

  return program;
}
