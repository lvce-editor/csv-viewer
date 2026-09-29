# Application integration tests

These scenarios and fixtures moved from `lvce-editor` to `lvce-editor/csv-viewer`. The Integration workflow overlays this repository's build in a pinned, disposable LVCE checkout and runs the application's existing test runner.

The workflow preserves the original CI commands, settings, and platform restrictions. Scenarios that were outside the application's CI selection remain available for local runs; their existing skip declarations are unchanged. Repositories with no previously selected CI scenarios expose a manual Integration workflow.

Build this repository, install the pinned application's dependencies and Chromium, then run:

```sh
node packages/e2e-integration/prepare.mjs /path/to/disposable/lvce-editor
cd /path/to/disposable/lvce-editor/packages/extension-host-worker-tests
npm run e2e:headless --
```

Preparation replaces the disposable application's scenarios and fixtures and overlays local build artifacts. See `config.json` for artifact and script destinations, and `.github/workflows/integration.yml` for static export, Electron, and settings requirements. Update the pinned application commit when its runtime needs updating.
