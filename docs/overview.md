# Build System Overview

STEW includes a custom build pipeline designed around static websites and edge deployments. Rather than relying on large framework toolchains, the compiler performs only the transformations needed to produce an optimized production build.

The build process handles HTML, CSS, JavaScript, TypeScript, and static assets, with behavior varying slightly depending on the selected build mode.

## Build Modes

| Mode            | Purpose                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Development** | Builds the project for local development while preserving individual assets for easier debugging. |
| **Test**        | Compiles the project for local integration testing without producing a production deployment.     |
| **Production**  | Generates the fully optimized output intended for deployment.                                     |

## Build Pipeline

During a build, STEW may perform the following operations depending on the selected mode:

* Compile TypeScript into browser-ready JavaScript.
* Minify JavaScript and CSS.
* Process and minify HTML.
* Apply build-time HTML transformations such as `stew-mod`.
* Bundle stylesheets for production.
* Copy static assets into the output directory.
* Rewrite paths where required by the compiler.

## Output

Production builds generate a deployable `dist/` directory containing optimized HTML, JavaScript, CSS, and static assets.

## Related Documentation

* `modes.md` — Build modes.
* `html-modifiers.md` — Build-time HTML attribute replacement.