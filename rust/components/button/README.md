# Button Component

A flexible, accessible button component built with Leptos and compiled to WebAssembly.

## Features

- **6 Variants**: Default, Destructive, Outline, Secondary, Ghost, Link
- **4 Sizes**: Small, Default, Large, Icon
- **Type-safe**: Leveraging Rust's type system
- **Accessible**: Built with web standards
- **Performant**: Compiled to WASM
- **Customizable**: Support for custom classes
- **Event handling**: Click events and more
- **Disabled state**: Built-in disabled support

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
cd rust/components/button
wasm-pack build --target web --out-dir pkg
```

## Usage

### In Rust/Leptos

```rust
use button::{Button, ButtonVariant, ButtonSize};
use leptos::*;

#[component]
fn App() -> impl IntoView {
    view! {
        // Basic button
        <Button label="Click me" />

        // Destructive variant
        <Button
            label="Delete"
            variant=ButtonVariant::Destructive
        />

        // Small outline button
        <Button
            label="Cancel"
            variant=ButtonVariant::Outline
            size=ButtonSize::Sm
        />

        // With click handler
        <Button
            label="Submit"
            variant=ButtonVariant::Default
            on_click=Some(Box::new(|| {
                web_sys::console::log_1(&"Button clicked!".into());
            }))
        />

        // Disabled button
        <Button
            label="Disabled"
            disabled=Some(true)
        />

        // With custom classes
        <Button
            label="Custom"
            class=Some("my-custom-class".to_string())
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
            mount_button,
            mount_button_variant,
            mount_button_full
        } from './pkg/button.js';

        async function run() {
            await init();

            // Simple button
            mount_button('Click Me');

            // Button with variant
            mount_button_variant('Delete', 'destructive');

            // Button with variant and size
            mount_button_full('Submit', 'outline', 'sm');
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
| `label` | `String` | Required | The text to display on the button |
| `variant` | `Option<ButtonVariant>` | `Default` | Visual style variant |
| `size` | `Option<ButtonSize>` | `Default` | Size variant |
| `disabled` | `Option<bool>` | `false` | Whether the button is disabled |
| `class` | `Option<String>` | `None` | Additional CSS classes |
| `on_click` | `Option<Box<dyn Fn()>>` | `None` | Click event handler |

### ButtonVariant

```rust
pub enum ButtonVariant {
    Default,      // Primary button style
    Destructive,  // Dangerous actions (delete, remove)
    Outline,      // Secondary actions with border
    Secondary,    // Alternative secondary style
    Ghost,        // Minimal style, no background
    Link,         // Link-style button
}
```

### ButtonSize

```rust
pub enum ButtonSize {
    Default,  // h-10 px-4 py-2
    Sm,       // h-9 px-3
    Lg,       // h-11 px-8
    Icon,     // h-10 w-10 (square for icons)
}
```

### JavaScript Functions

#### `mount_button(label: string)`

Mount a simple button with default variant and size.

```javascript
mount_button('Click Me');
```

#### `mount_button_variant(label: string, variant: string)`

Mount a button with a specific variant.

```javascript
mount_button_variant('Delete', 'destructive');
```

**Variants**: `"default"`, `"destructive"`, `"outline"`, `"secondary"`, `"ghost"`, `"link"`

#### `mount_button_full(label: string, variant: string, size: string)`

Mount a button with specific variant and size.

```javascript
mount_button_full('Submit', 'outline', 'sm');
```

**Sizes**: `"default"`, `"sm"`, `"lg"`, `"icon"`

## Examples

### Default Button

```rust
<Button label="Button" />
```

### Destructive Actions

```rust
<Button
    label="Delete Account"
    variant=ButtonVariant::Destructive
/>
```

### Outline Button

```rust
<Button
    label="Cancel"
    variant=ButtonVariant::Outline
/>
```

### Secondary Button

```rust
<Button
    label="Learn More"
    variant=ButtonVariant::Secondary
/>
```

### Ghost Button

```rust
<Button
    label="Menu"
    variant=ButtonVariant::Ghost
/>
```

### Link Button

```rust
<Button
    label="Read Documentation"
    variant=ButtonVariant::Link
/>
```

### Size Variants

```rust
// Small
<Button label="Small" size=ButtonSize::Sm />

// Large
<Button label="Large" size=ButtonSize::Lg />

// Icon (square button)
<Button label="⚙️" size=ButtonSize::Icon />
```

### Combined

```rust
<Button
    label="Small Outline"
    variant=ButtonVariant::Outline
    size=ButtonSize::Sm
/>
```

## Styling

The button uses Tailwind CSS classes that match the shadcn/ui design system. Make sure to include Tailwind CSS in your project and configure the shadcn/ui color palette:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                border: "hsl(214.3 31.8% 91.4%)",
                input: "hsl(214.3 31.8% 91.4%)",
                ring: "hsl(222.2 84% 4.9%)",
                background: "hsl(0 0% 100%)",
                foreground: "hsl(222.2 84% 4.9%)",
                primary: {
                    DEFAULT: "hsl(222.2 47.4% 11.2%)",
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

## Bundle Size

The WASM bundle is optimized for size using `wasm-opt`. Typical sizes:

- WASM module: ~50-100KB (uncompressed)
- WASM module: ~20-40KB (gzipped)
- JavaScript glue: ~5-10KB

## Browser Support

Supports all modern browsers with WebAssembly support:

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

## License

MIT

## Contributing

Contributions are welcome! Please ensure:

1. Code follows Rust formatting (`cargo fmt`)
2. All tests pass (`cargo test`)
3. No clippy warnings (`cargo clippy`)
4. Examples are updated if API changes

## Related

- [Leptos Documentation](https://leptos.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)
