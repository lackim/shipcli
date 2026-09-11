# Changesets

Run `pnpm changeset` when a contribution changes a published package. Select the
affected packages, choose the appropriate semantic-version bump, and describe
the user-facing change. Commit the generated markdown file with the code.

Maintainers use the manual **Release** GitHub Actions workflow to create a
version pull request. After that pull request is merged, running the workflow
again publishes the packages and creates their git tags. Publishing requires an
`NPM_TOKEN` repository secret with access to the `@shipcli` scope.
