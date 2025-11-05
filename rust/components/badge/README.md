# Badge Component

A small, inline label component built with Leptos and compiled to WebAssembly.

## Features

- **4 Variants**: Default, Secondary, Destructive, Outline
- **Type-safe**: Leveraging Rust's enum system
- **Accessible**: Proper semantic HTML
- **Performant**: Compiled to WASM
- **Customizable**: Support for custom classes
- **Small**: ~15-20KB gzipped

## Installation

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### Build

```bash
cd rust/components/badge
wasm-pack build --target web --out-dir pkg
```

## Usage

### In Rust/Leptos

```rust
use badge::{Badge, BadgeVariant};
use leptos::*;

#[component]
fn App() -> impl IntoView {
    view! {
        // Default badge
        <Badge text="New" />

        // Secondary variant
        <Badge text="Beta" variant=BadgeVariant::Secondary />

        // Destructive variant
        <Badge text="Deprecated" variant=BadgeVariant::Destructive />

        // Outline variant
        <Badge text="Draft" variant=BadgeVariant::Outline />

        // With custom classes
        <Badge
            text="Custom"
            variant=BadgeVariant::Default
            class=Some("ml-2".to_string())
        />
    }
}
```

### In HTML/JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <script type="module">
        import init, {
            mount_badge,
            mount_badge_variant
        } from './pkg/badge.js';

        async function run() {
            await init();

            // Simple badge
            mount_badge('New');

            // Badge with variant
            mount_badge_variant('Deprecated', 'destructive');
        }

        run();
    </script>
</body>
</html>
```

## API Reference

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `String` | Required | The text to display in the badge |
| `variant` | `Option<BadgeVariant>` | `Default` | Visual style variant |
| `class` | `Option<String>` | `None` | Additional CSS classes |

### BadgeVariant

```rust
pub enum BadgeVariant {
    Default,      // Primary badge style (dark background)
    Secondary,    // Secondary badge style (light background)
    Destructive,  // For errors or warnings (red background)
    Outline,      // Bordered badge with no background
}
```

### JavaScript Functions

#### `mount_badge(text: string)`

Mount a simple badge with default variant.

```javascript
mount_badge('New');
```

#### `mount_badge_variant(text: string, variant: string)`

Mount a badge with a specific variant.

```javascript
mount_badge_variant('Error', 'destructive');
```

**Variants**: `"default"`, `"secondary"`, `"destructive"`, `"outline"`

## Examples

### Status Badges

```rust
<Badge text="Active" variant=BadgeVariant::Default />
<Badge text="Pending" variant=BadgeVariant::Secondary />
<Badge text="Error" variant=BadgeVariant::Destructive />
```

### Category Tags

```rust
<Badge text="React" variant=BadgeVariant::Outline />
<Badge text="TypeScript" variant=BadgeVariant::Outline />
<Badge text="Rust" variant=BadgeVariant::Outline />
```

### Notification Count

```rust
<Badge text="3" variant=BadgeVariant::Destructive />
<Badge text="99+" variant=BadgeVariant::Destructive />
```

### Feature Labels

```rust
<Badge text="New" variant=BadgeVariant::Default />
<Badge text="Beta" variant=BadgeVariant::Secondary />
<Badge text="Deprecated" variant=BadgeVariant::Destructive />
```

## Styling

The badge uses Tailwind CSS classes that match the shadcn/ui design system. Make sure to include Tailwind CSS in your project and configure the shadcn/ui color palette:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(222.2 47.4% 11.2%)",
                    foreground: "hsl(210 40% 98%)",
                },
                secondary: {
                    DEFAULT: "hsl(210 40% 96.1%)",
                    foreground: "hsl(222.2 47.4% 11.2%)",
                },
                destructive: {
                    DEFAULT: "hsl(0 84.2% 60.2%)",
                    foreground: "hsl(210 40% 98%)",
                },
                // ... more colors
            }
        }
    }
}
```

See the `examples/index.html` file for a complete Tailwind configuration.

## Development

### Build for Development

```bash
wasm-pack build --target web --dev --out-dir pkg
```

### Build for Production

```bash
wasm-pack build --target web --release --out-dir pkg
```

### Run Examples

```bash
cd examples
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Testing

```bash
cargo test
```

### Test Output

```
running 3 tests
test tests::test_badge_variant_default ... ok
test tests::test_badge_variant_classes ... ok
test tests::test_all_variants_have_classes ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

## Bundle Size

Typical sizes (with wasm-opt):

- WASM module: ~40-50KB (uncompressed)
- WASM module: ~15-20KB (gzipped)
- JavaScript glue: ~5KB

## Browser Support

Supports all modern browsers with WebAssembly support:

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

## Common Use Cases

### With Icons

```rust
// Note: Icon support requires additional setup
<Badge text="⭐ Featured" variant=BadgeVariant::Default />
<Badge text="🔥 Popular" variant=BadgeVariant::Destructive />
```

### In Lists

```rust
<div class="flex items-center gap-2">
    <span>Project Name</span>
    <Badge text="Private" variant=BadgeVariant::Outline />
    <Badge text="Active" variant=BadgeVariant::Default />
</div>
```

### With Counters

```rust
<div class="flex items-center gap-2">
    <span>Notifications</span>
    <Badge text="5" variant=BadgeVariant::Destructive />
</div>
```

## Accessibility

- Uses semantic `<div>` element
- Proper text contrast ratios
- Focus styles for keyboard navigation
- Screen reader friendly

## License

MIT

## Contributing

Contributions are welcome! Please ensure:

1. Code follows Rust formatting (`cargo fmt`)
2. All tests pass (`cargo test`)
3. No clippy warnings (`cargo clippy`)
4. Examples are updated if API changes

## Related Components

- [Button](../button/README.md) - Clickable button component
- Avatar (coming soon) - User avatar component
- Label (coming soon) - Form label component

## Resources

- [Leptos Documentation](https://leptos.dev/)
- [shadcn/ui Badge](https://ui.shadcn.com/docs/components/badge)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)

---

Built with 🦀 Rust + ⚡ Leptos + 🌐 WASM
