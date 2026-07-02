# HTML Modifiers (`stew-mod`)

`stew-mod` is a build-time HTML utility that replaces the values of existing attributes before the final HTML is emitted.

Unlike JavaScript DOM manipulation, these replacements happen during compilation. The generated HTML contains the updated values and the `stew-mod` attribute itself is removed.

This feature is primarily intended for production transformations, although it can be used anywhere attribute replacement is needed.

---

## Syntax

```html
<tag stew-mod="[attribute][newValue]">
```

Each modifier consists of two parts:

```text
[attribute][newValue]
```

Multiple modifiers may be chained together.

```html
<tag stew-mod="
    [src][/img/logo.png]
    [alt][STEW Logo]
">
```

---

## Examples

### Replacing a stylesheet

Before compilation:

```html
<link
    rel="stylesheet"
    href="/css/home.css"
    stew-mod="[href][/css/bundle.min.css]"
>
```

After compilation:

```html
<link
    rel="stylesheet"
    href="/css/bundle.min.css"
>
```

---

### Replacing multiple attributes

Before compilation:

```html
<img
    src="/img/logo-dev.png"
    alt="Development Logo"
    stew-mod="
        [src][/img/logo.png]
        [alt][Production Logo]
    "
>
```

After compilation:

```html
<img
    src="/img/logo.png"
    alt="Production Logo"
>
```

---

## How it works

For every element containing `stew-mod`:

1. Each `[attribute][value]` pair is parsed.
2. If the attribute already exists on the element, its value is replaced.
3. All replacements are applied.
4. The `stew-mod` attribute is removed.

The resulting HTML contains no trace of `stew-mod`.

---

## Limitations

* Only existing attributes can be modified.
* New attributes are **not** created.
* Attribute names are matched case-insensitively.
* The transformation occurs only during the build process.
* The browser never sees the `stew-mod` attribute.

---

## Typical Use Cases

* Replacing development assets with production assets.
* Switching multiple CSS files to a bundled stylesheet.
* Updating CDN or asset URLs during production builds.
* Applying environment-specific HTML transformations.

---

## Notes

`stew-mod` is intentionally lightweight. It performs simple attribute replacement and does not evaluate expressions, execute JavaScript, or modify the document structure.
