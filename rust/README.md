# shadcn/ui Rust Components

WASM components built with Leptos for shadcn/ui, providing Rust alternatives to React components.

## Overview

This directory contains Rust/WASM implementations of shadcn/ui components using the Leptos framework. These components maintain the same design philosophy and Tailwind CSS styling as their React counterparts while offering the performance and type-safety benefits of Rust.

## Prerequisites

Before building these components, ensure you have:

- [Rust](https://rustup.rs/) (stable toolchain, 1.70+)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) for building WASM packages
- [Node.js](https://nodejs.org/) (for running examples)

### Installation

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Add WASM target (if not already added)
rustup target add wasm32-unknown-unknown
```

## Project Structure

```
rust/
├── Cargo.toml              # Workspace configuration
├── README.md               # This file
└── components/
    └── button/             # Button component
        ├── Cargo.toml      # Component package config
        ├── src/
        │   └── lib.rs      # Component implementation
        └── examples/
            └── index.html  # Usage example
```

## Available Components

### Button

A flexible, accessible button component with multiple variants and sizes.

**Features:**
- 6 variants: Default, Destructive, Outline, Secondary, Ghost, Link
- 4 sizes: Small, Default, Large, Icon
- Tailwind CSS styling matching shadcn/ui design
- Click event handling
- Disabled state support
- Custom class names
- Type-safe with Rust enums
- WASM-optimized for web performance

**Building:**

```bash
cd components/button
wasm-pack build --target web --out-dir pkg
```

**Usage in HTML:**

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import init, { mount_button, mount_button_variant, mount_button_full } from './pkg/button.js';

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
</head>
<body>
</body>
</html>
```

**Usage in Rust:**

```rust
use button::{Button, ButtonVariant, ButtonSize};
use leptos::*;

#[component]
fn App() -> impl IntoView {
    view! {
        // Default button
        <Button label="Click me" />

        // Destructive variant
        <Button label="Delete" variant=ButtonVariant::Destructive />

        // Small outline button
        <Button
            label="Cancel"
            variant=ButtonVariant::Outline
            size=ButtonSize::Sm
        />

        // With click handler
        <Button
            label="Submit"
            on_click=Some(Box::new(|| {
                // Handle click
            }))
        />
    }
}
```

See [components/button/README.md](components/button/README.md) for full documentation.

## Building All Components

From the `rust/` directory:

```bash
# Build all components in workspace
cargo build --release --target wasm32-unknown-unknown

# Or build with wasm-pack for web usage
cd components/button && wasm-pack build --target web
```

## Development

### Running Examples

Each component has an examples directory with HTML files demonstrating usage:

```bash
# Serve the example (requires a local server)
cd components/button/examples
python3 -m http.server 8080
# Visit http://localhost:8080
```

### Testing

```bash
# Run tests for all components
cargo test

# Run tests for specific component
cd components/button
cargo test
```

### Linting

```bash
# Check code formatting
cargo fmt --check

# Run clippy lints
cargo clippy -- -D warnings
```

## Design Philosophy

These components follow the shadcn/ui principles:

1. **Not a component library** - Components are meant to be copied and customized
2. **Tailwind CSS first** - Styling uses Tailwind utility classes
3. **Accessible** - Built with accessibility in mind
4. **Customizable** - Easy to modify and extend
5. **Type-safe** - Leveraging Rust's type system

## Technology Stack

- **Leptos 0.7** - Reactive UI framework for Rust
- **wasm-bindgen** - Rust/WASM/JavaScript interop
- **wasm-pack** - Build tool for WASM packages
- **Tailwind CSS** - Utility-first CSS framework

## Roadmap

Current components:
- ✅ Button (basic implementation)

Planned components:
- [ ] Input
- [ ] Card
- [ ] Dialog
- [ ] Select
- [ ] Checkbox
- [ ] Badge
- [ ] Avatar
- [ ] Alert

## Contributing

When adding new components:

1. Create a new directory under `components/`
2. Add it to the workspace in `rust/Cargo.toml`
3. Follow the Button component structure
4. Include examples and documentation
5. Match shadcn/ui styling and behavior

## License

MIT

## Resources

- [Leptos Documentation](https://leptos.dev/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
