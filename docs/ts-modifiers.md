# TypeScript Modifiers

STEW supports simple build-time modifiers for TypeScript through the `__DEV__` constant.

This allows you to include development-only code that is automatically disabled in production builds.

---

## `__DEV__`

Declare the following constant near the top of your file:

```ts
const __DEV__ = true;
```

During production builds, the compiler rewrites it to:

```ts
const __DEV__ = false;
```

After minification, the declaration itself is removed from the final output.

---

## Example

Before compilation:

```ts
const __DEV__ = true;

if (__DEV__) {
    console.log("Running in development mode.");
}
```

During the production build, the compiler transforms it into:

```ts
const __DEV__ = false;

if (__DEV__) {
    console.log("Running in development mode.");
}
```

Since `__DEV__` is now a compile-time constant, Terser evaluates the condition and removes the unreachable branch.

Final output:

```ts
// Development code removed
```

---

## Typical Usage

### Debug Logging

```ts
const __DEV__ = true;

if (__DEV__) {
    console.log(data);
}
```

---

### Test Utilities

```ts
const __DEV__ = true;

if (__DEV__) {
    runDebugOverlay();
}
```

---

### Performance Instrumentation

```ts
const __DEV__ = true;

if (__DEV__) {
    console.time("Render");
}

render();

if (__DEV__) {
    console.timeEnd("Render");
}
```

---

## Notes

* `__DEV__` is intended for development-only code.
* The declaration should be written exactly as:

```ts
const __DEV__ = true;
```

* The compiler replaces this declaration during production builds.
* After minification, the `__DEV__` declaration is removed from the generated JavaScript.
* Code guarded by `if (__DEV__)` can be eliminated automatically during minification, reducing the final bundle size.
