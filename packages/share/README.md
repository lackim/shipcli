# @shipcli/share

Generate shareable Open Graph images for command-line products with Satori and
Resvg.

```bash
npm install @shipcli/share
```

The package exports `generateOgImage(template, data, options)` for in-memory PNG
generation and `share(template, data, options)` for writing a PNG to disk. A
template is a function that returns a Satori-compatible element tree.

See the [shipcli repository](https://github.com/lackim/shipcli) for project status
and support.
