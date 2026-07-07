# Custom Compiler/Bundler
- Because I like my own way lmao *(use vite they say)*

The compiler cleans out development flags, handles path mapping on the fly, and strips down assets for zero-bloat delivery.
All thanks to [regex101](https://regex101.com)

### 🟢 Development Build (`npm run build:dev`)
*   **TypeScript:** Compiles client-side TS logic down to ES Modules.
*   **JavaScript:** Replaces development blocks (e.g., toggles `__DEV__` from `true` to `false`), remaps relative file imports to target compiled `.min.js` files, minifies using Terser, and outputs to `dist/`.
*   **CSS:** Individually minifies component stylesheets into their respective `dist/**/css/*.min.css` directories.
*   **Assets:** Copies images and raw unhandled files directly into `dist/`.

### 🔵 Live Production Build (`npm run build:prod`)
Runs the same deep optimization process as the development build, with a major performance upgrade for the layout:
*   **Automated Recursive Bundling:** Automatically crawls the project to find every `css`, `style`, or `styles` folder. Each directory is bundled independently into a `bundle.min.css` to keep sub-sites completely separate.
*   **Smart HTML Refactoring:** 
    *   **Context Discovery:** Scans existing `<link>` tags to identify if the page uses `css/` or `styles/` before stripping them.
    *   **Link Purging:** Uses non-destructive regex to remove all local stylesheets while preserving external CDN links.
    *   **Bundle Injection:** Injects a single optimized `bundle.min.css` using the correctly detected local path.
    *   **Stew Modifiers:** Executes custom `stew-mod` logic for production-only attribute and content transformations.
*   **Relative Path Mapping:** When `--dotdir` is enabled, the compiler dynamically remaps root paths (`/`) to relative ones (`./`) to support deployments on any sub-URI or static host.