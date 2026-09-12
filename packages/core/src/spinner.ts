import { createSpinner } from "nanospinner";

export function spinner(text: string) {
  return createSpinner(text, { color: "cyan" });
}
