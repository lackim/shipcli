import { defineConfig } from "@shipcli/core";

export default defineConfig({
  name: "{{name}}",
  description: "{{description}}",
  build: {
    entrypoint: "./src/cli.ts",
    outDir: "dist",
  },
  publish: {
    access: "public",
  },
  share: {
    enabled: {{share}},
  },
  landing: {
    outDir: "web",
  },
});
