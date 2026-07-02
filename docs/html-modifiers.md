# HTML Modifiers (`stew-mod`)

`stew-mod` is a build-time HTML utility that modifies attributes, updates text content, or removes elements before the final HTML is emitted.

---

## Syntax & Commands

| Feature | Syntax | Result |
| :--- | :--- | :--- |
| **Modify Attribute** | `[class][active]` | Updates or adds the attribute. |
| **Remove Attribute** | `[src][]` | Deletes the attribute from the tag. |
| **Update Text** | `[textContent][Hi]` | Replaces everything inside the tag. |
| **Remove Element** | `[remove][]` | Deletes the entire element and children. |

### Example Chaining
```html
<div class="old" stew-mod="[class][new-box] [id][] [textContent][Updated!]">
    Placeholder
</div>
```

---

## How it works

1. **Check for Removal**: If `[remove][]` is found, the element is deleted.
2. **Parse Pairs**: Each `[key][value]` is evaluated.
3. **Apply Logic**: Updates inner content, removes attributes with empty values, or updates/adds new ones.
4. **Cleanup**: The `stew-mod` attribute is stripped from the final output.

---

## Use Cases

* **Environment Stripping**: Use `[remove][]` to hide dev-only UI components in production.
* **Asset Swapping**: Use `[href][/path/min.css]` to point to production bundles.