# Contributing to shipcli

Thanks for considering a contribution. shipcli is in early access, so small,
well-scoped changes with a clear use case are especially valuable.

## Before you start

- Search existing issues before opening a new one.
- Use an issue to discuss large features or public API changes first.
- Keep pull requests focused on one concern.
- Never include credentials, private repository data, or generated build output.

## Local setup

You need Node.js 24 or newer and pnpm 10.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
```

To work on the website, run `pnpm dev:web`.

## Pull requests

1. Create a branch from `main`.
2. Add or update tests when behavior changes.
3. Run `pnpm check` and, for website changes, `pnpm build:web`.
4. Run `pnpm changeset` for user-visible package changes and commit the generated
   markdown file.
5. Explain the problem and the chosen solution in the pull request.
6. Call out breaking changes and user-visible limitations explicitly.

By contributing, you agree that your contribution is licensed under the MIT
License that covers this repository.
