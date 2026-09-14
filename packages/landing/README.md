# @shipcli/landing

Scaffold a dark Next.js landing page for a command-line product.

Most users should run:

```bash
npm install --global @shipcli/cli
shipcli landing init
shipcli landing init --out-dir site
```

For programmatic use, install this package and call `scaffoldLanding(options)`:

```ts
import { scaffoldLanding } from "@shipcli/landing";

scaffoldLanding({
  name: "my-cli",
  description: "A useful command-line tool",
  outDir: "web",
});
```

The generated site includes a terminal demo, feature section, installation tabs
for npm and npx, structured-output preview, and shipcli attribution. The terminal
keeps a stable height and scrolls as the animated session grows.

[Landing guide](https://lackim.github.io/shipcli/docs#landing) ·
[Source](https://github.com/lackim/shipcli/tree/main/packages/landing) ·
[Changelog](https://github.com/lackim/shipcli/blob/main/packages/landing/CHANGELOG.md)
