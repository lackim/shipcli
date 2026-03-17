import { createSpinner } from "nanospinner";

export function spinner(text) {
  return createSpinner(text, { color: "cyan" });
}
