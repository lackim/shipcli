import assert from "node:assert/strict";
import test from "node:test";

import { shareCard } from "../src/share-card.js";

test("share card contains the tool name and result", () => {
  const card = shareCard({ target: ".", status: "ok" });
  const contents = JSON.stringify(card);

  assert.match(contents, /{{name}}/);
  assert.match(contents, /Analysis: ok/);
});
