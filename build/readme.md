# Custom Compiler for [ichiprototech](https://ichiprototech.com)
- Because I like my own way lmao *(use vite they say)*

The compiler cleans out development flags, handles path mapping on the fly, and strips down assets for zero-bloat delivery.

### 🟢 Development Build (`npm run build:dev`)
*   **TypeScript:** Compiles client-side TS logic down to ES Modules.
*   **HTML:** Strips out local dev tokens via regex, minifies the markup, and outputs to `dist/`.
*   **JavaScript:** Replaces development blocks (e.g., toggles `__DEV__` from `true` to `false`), remaps relative file imports to target compiled `.min.js` files, minifies using Terser, and outputs to `dist/`.
*   **CSS:** Individually minifies your component stylesheets into `dist/css/*.min.css`.
*   **Assets:** Copies images and raw unhandled files directly into `dist/`.

### 🔵 Live Production Build (`npm run build:prod`)
Runs the same deep optimization process as the development build, with one major performance upgrade for the layout:
*   **CSS Bundling:** Instead of copying individual stylesheets, it reads your entire `src/css/` directory, concatenates every file into a unified stream, pushes it through CleanCSS, and serves a single optimized `/css/bundle.min.css`.
*   **HTML Refactoring:** Automatically strips out individual `<link>` declarations via regex and hot-plugs a single, deferred bundle tag directly into your document `</head>`.