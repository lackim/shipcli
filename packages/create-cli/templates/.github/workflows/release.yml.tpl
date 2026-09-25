name: Release
on:
  push:
    tags: ["v*"]

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
        with:
          node-version: "24"
      - run: npm ci --ignore-scripts
      - run: npm run typecheck
      - run: npm test
      - run: mkdir -p release-artifact && npm pack --pack-destination release-artifact
      - uses: actions/upload-artifact@b7c566a772e6b6bfb58ed0dc250532a479d7789f # v6
        with:
          name: npm-package
          path: release-artifact/*.tgz
          if-no-files-found: error
          retention-days: 1

  publish:
    needs: verify
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
        with:
          node-version: "24"
          registry-url: "https://registry.npmjs.org"
          package-manager-cache: false
      - name: Set up npm for trusted publishing
        run: npm install --global npm@11.15.0
      - uses: actions/download-artifact@37930b1c2abaa49bbe596cd826c3c89aef350131 # v7
        with:
          name: npm-package
          path: release-artifact
      # Configure this workflow as a trusted publisher in the npm package settings.
      - run: npm publish ./release-artifact/*.tgz --access public
