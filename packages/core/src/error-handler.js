import { error } from "./output.js";

export function setupErrorHandler(name) {
  process.on("uncaughtException", (err) => {
    error(err.message, `This is a bug in ${name}. Please report it.`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    var msg = reason instanceof Error ? reason.message : String(reason);
    error(msg, `This is a bug in ${name}. Please report it.`);
    if (process.env.DEBUG) console.error(reason);
    process.exit(1);
  });
}
