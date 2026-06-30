# Custom Compiler for [ichiprototech](https://ichiprototech.com)
- Because I like my own way lmao *(use vite they say)*

### build process:
- Clears development codes from the src folder *(HTML, JS, TS)*

- process: *`(npm run build-prod)`* -live production build
    - Compiles TypeScript to ES2020 JS
    - Strips HTML's development codes using regex -> Minified -> Copies to dist
    - Strips TS/JS development codes using regex -> renamed the imports -> Minified -> Copies to dist
    - Minified CSS -> Bundles CSS into single file -> Copies to dist
    - Rest of the files are Copied to dist

- process: *`(npm run build)`* -development build
    - Compiles TypeScript to ES2020 JS
    - Strips HTML's development codes using regex -> Minified -> Copies to dist
    - Strips TS/JS development codes using regex -> renamed the imports -> Minified -> Copies to dist
    - Minified CSS -> Copies to dist
    - Rest of the files are Copied to dist