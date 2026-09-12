import { Command } from "commander";
import { checkForUpdate } from "./update-check.js";
import { setupErrorHandler } from "./error-handler.js";

export interface CreateCLIOptions {
  name: string;
  description: string;
  version: string;
  packageName?: string;
}

export type ShipCLI = Command & { run(): void };

export function createCLI({ name, description, version, packageName = name }: CreateCLIOptions): ShipCLI {
  const program = new Command() as ShipCLI;

  program
    .name(name)
    .description(description)
    .version(version);

  program.option("--json", "Output as JSON");

  program.hook("preAction", async () => {
    await checkForUpdate(packageName, version);
  });

  setupErrorHandler(name);

  program.run = () => {
    program.parse();
  };

  return program;
}
