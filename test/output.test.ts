import assert from "node:assert/strict";
import test from "node:test";

import { box, progressBar, table } from "../packages/core/src/output.js";

function stripAnsi(value: string): string {
  return value.replace(new RegExp("\\u001B\\[[0-9;]*m", "g"), "");
}

test("table aligns rows and box renders its content", () => {
  const renderedTable = stripAnsi(table(["Name", "Score"], [["Ada", 100], ["Lin", 8]]));
  assert.match(renderedTable, /Name\s+Score/);
  assert.match(renderedTable, /Ada\s+100/);

  const renderedBox = stripAnsi(box("Result", ["Everything passed"]));
  assert.match(renderedBox, /Result/);
  assert.match(renderedBox, /Everything passed/);
});

test("progressBar clamps values and handles an empty total", () => {
  assert.match(stripAnsi(progressBar(5, 10, 10)), /50%$/);
  assert.match(stripAnsi(progressBar(12, 10, 10)), /100%$/);
  assert.match(stripAnsi(progressBar(-1, 10, 10)), /0%$/);
  assert.match(stripAnsi(progressBar(0, 0, 10)), /0%$/);
});
