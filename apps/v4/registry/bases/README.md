# Registry bases (`base`, `aria` and `radix`)

This folder holds **three parallel registries**:

- **`base/`** — Base UI–backed components and blocks
- **`aria/`** — React Aria–backed components and blocks
- **`radix/`** — Radix-backed components and blocks

## Keep them in sync

For any **shared** surface (same preview block, same card, same example intent), changes should be applied to `base`, `aria`, and `radix` variants.

- Adjust only what must differ: imports (`.../base/ui/...` vs `.../radix/ui/...`) and primitive APIs.
- Avoid editing only one tree unless the work is intentionally scoped to a single base.
