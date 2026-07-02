# Build Modes

STEW supports multiple build modes, allowing the compiler to adjust its behavior for development, testing, and production.

## Build Commands

| Command              | Mode        |
| -------------------- | ----------- |
| `npm run build:dev`  | Development |
| `npm run build:test` | Test        |
| `npm run build:prod` | Production  |

## Typical Behavior

### Development

Designed for local development and debugging.

Typical characteristics include:

* HTML minification.
* JavaScript minification.
* CSS minification.
* Optimized static assets.

### Test

Used for validating the project before deployment.

Typical characteristics include:

* Same compilation pipeline as production where applicable.
* Intended for local testing workflows.
* Does not create files as its intended for testing whether the build passes.

### Production

Produces the final deployable output.

Typical characteristics include:

* Same from the Development
* CSS bundling.
* Build-time HTML transformations.