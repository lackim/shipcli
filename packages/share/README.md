# @shipcli/share

Generate shareable Open Graph images for command-line products with Satori and
Resvg.

```bash
npm install @shipcli/share
```

The package exports `generateOgImage(template, data, options)` for in-memory PNG
generation and `share(template, data, options)` for writing a PNG to disk. A
template is a function that returns a Satori-compatible element tree.
TypeScript consumers can import the `OgImageOptions`, `OgTemplate`,
`SatoriElement`, and `ShareOptions` types from the package root.

Inter is bundled as a package dependency, so rendering does not require a font
download at runtime. Custom Satori fonts can be supplied through `options.fonts`.

```ts
import { share, type SatoriElement } from "@shipcli/share";

const card = (data: { score: number }): SatoriElement => ({
  type: "div",
  props: {
    style: { display: "flex", padding: 64, fontSize: 48 },
    children: `Score: ${data.score}`,
  },
});

await share(card, { score: 92 }, {
  toolName: "my-cli",
  filename: "report.png",
});
```

The returned path is absolute and the filename is sanitized before writing.

[Share guide](https://lackim.github.io/shipcli/docs#share) ·
[Source](https://github.com/lackim/shipcli/tree/main/packages/share) ·
[Changelog](https://github.com/lackim/shipcli/blob/main/packages/share/CHANGELOG.md)
