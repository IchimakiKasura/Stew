# Build System Overview

STEW includes a custom build pipeline designed around static websites and edge deployments. Rather than relying on large framework toolchains, the compiler performs only the transformations needed to produce an optimized production build via a high-performance regex-based engine.

The build process handles HTML, CSS, JavaScript, TypeScript, and static assets, with behavior varying slightly depending on the selected build mode.

## Build Modes

| Mode            | Purpose                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Development** | Builds the project for local development while preserving individual assets for easier debugging. |
| **Test**        | Compiles the project for local integration testing without producing a production deployment.     |
| **Production**  | Generates the fully optimized output intended for deployment.                                     |

## Build Pipeline

During a build, STEW performs the following operations to ensure zero-bloat delivery:

* **TypeScript Compilation:** Transforms TS logic into browser-ready ES Modules.
* **Recursive CSS Bundling:** (Production only) Automatically detects any `css`, `style`, or `styles` directories project-wide. Each site/sub-site (e.g., `/` and `/cosplay/`) is bundled into its own independent `bundle.min.css`.
* **Smart HTML Refactoring:**
    *   **Context Discovery:** Scans existing tags to detect the local directory structure (`css/` vs `styles/`) before assets are stripped.
    *   **Link Purging:** Removes all local stylesheet links while keeping external CDN links intact.
    *   **Bundle Injection:** Injects a single relative reference to the local bundle in the `<head>`.
* **HTML Processing:** Applies `stew-mod` transformations and minifies the final markup via `html-minifier-terser`.
* **Path Remapping:** If `--dotdir` is enabled, the compiler remaps root-relative paths (`/`) to indexed relative paths (`./`) on the fly, supporting deployments under any sub-URI.
* **Asset Management:** Copies raw static files directly into the mirrored `dist/` structure.

## Output

Production builds generate a deployable `dist/` directory. The structure mirrors the `src/` directory exactly to ensure that relative links between pages and their assets remain functional after bundling.

## Related Documentation

* [`modes.md`](./modes.md) — Build modes.
* [`html-modifiers.md`](./html-modifiers.md) — Build-time HTML attribute replacement.
