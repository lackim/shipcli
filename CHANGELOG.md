# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added typed `shipcli.config.ts` project defaults for build, publish, share, and
  landing workflows.
- Added a runnable example project and pre-release checks for package tarballs,
  registry versions, and provenance.
- Added mobile documentation navigation, a favicon, robots metadata, and a
  sitemap to the public website.

### Changed

- Expanded the npm package documentation and made CLI scaffolding options
  available through `shipcli init`.
- Made CLI actions properly await asynchronous handlers and tightened binary
  target and publishing safeguards.

## [0.3.0] - 2026-09-14

### Changed

- Migrated package sources and generated CLI projects to strict TypeScript with
  compiled ESM, declaration files, and source maps.
- Raised the supported runtime baseline to Node.js 24.
- Redesigned the public and generated landing pages with a responsive layout,
  realistic install commands, and a fixed-height scrolling terminal.

## [0.2.0] - 2026-09-11

### Changed

- Completed the starter generator with install, git, test, and share-card support.
- Made share-card generation fully offline with bundled Inter fonts.
- Added release automation, broader cross-platform CI, and GitHub Pages deployment.
- Clarified installation, package roles, project status, and contribution flow.
- Standardized local development and CI around pnpm.

### Fixed

- Read the CLI version from its package metadata.
- Keep `publish --dry-run` from modifying package metadata or git history.
- Refuse to overwrite non-empty generated projects and landing pages by default.

[Unreleased]: https://github.com/lackim/shipcli/commits/main
[0.3.0]: https://github.com/lackim/shipcli/releases/tag/%40shipcli%2Fcli%400.3.0
[0.2.0]: https://github.com/lackim/shipcli/commit/39910abf9d5dd95201dd75cb9c6830bb6c3716f6
