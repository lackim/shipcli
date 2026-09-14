import { defineConfig } from "@shipcli/core";

export default defineConfig({
  name: "hello-cli",
  description: "A minimal shipcli example",
  build: {
    entrypoint: "./src/cli.ts",
    outDir: "dist",
    targets: ["macos-arm64", "linux-x64"],
  },
  publish: {
    access: "public",
    bump: "patch",
  },
  share: {
    enabled: false,
  },
  landing: {
    outDir: "web",
  },
});
