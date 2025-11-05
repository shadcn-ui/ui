# Separator Component

Visual divider for content separation.

## Features
- Horizontal and vertical orientations
- Decorative or semantic (ARIA role)
- Minimal and lightweight

## Usage

```rust
use separator::{Separator, SeparatorOrientation};

// Horizontal (default)
<Separator />

// Vertical
<Separator orientation=SeparatorOrientation::Vertical />

// Decorative only
<Separator decorative=Some(true) />
```

## JavaScript

```js
import { mount_separator, mount_separator_vertical } from './pkg/separator.js';
mount_separator();  // horizontal
mount_separator_vertical();  // vertical
```

## Build
```bash
wasm-pack build --target web --out-dir pkg
```
