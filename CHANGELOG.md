# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
[0.2.0]: https://github.com/lackim/shipcli/compare/v0.1.2...v0.2.0
