# Avatar Component

User avatar with image, fallback to initials, and size variants.

## Features

- **Image Support**: Display user profile images
- **Fallback Handling**: Automatic fallback to initials when image fails
- **3 Sizes**: Small, Default, Large
- **Auto Initials**: Extracts initials from alt text
- **Error Handling**: Graceful degradation on image load errors
- **Accessible**: Proper alt text support

## Usage

### Rust/Leptos

```rust
use avatar::{Avatar, AvatarSize};
use leptos::*;

#[component]
fn App() -> impl IntoView {
    view! {
        // With image
        <Avatar
            src=Some("https://github.com/shadcn.png".to_string())
            alt="User Avatar"
        />

        // With fallback
        <Avatar alt="John Doe" fallback="JD" />

        // Different sizes
        <Avatar src=Some("...".to_string()) alt="User" size=AvatarSize::Sm />
        <Avatar src=Some("...".to_string()) alt="User" size=AvatarSize::Lg />
    }
}
```

### JavaScript

```html
<script type="module">
    import init, { mount_avatar, mount_avatar_with_fallback, mount_avatar_full } from './pkg/avatar.js';

    await init();

    // With image
    mount_avatar('https://github.com/shadcn.png', 'User Avatar');

    // With fallback initials
    mount_avatar_with_fallback('', 'John Doe', 'JD');

    // With size
    mount_avatar_full('https://...', 'User', 'JD', 'lg');
</script>
```

## API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alt` | `String` | Required | Alt text (used for initials if no fallback) |
| `src` | `Option<String>` | `None` | Image URL |
| `fallback` | `Option<String>` | Auto from alt | Fallback text (initials) |
| `size` | `Option<AvatarSize>` | `Default` | Size variant |
| `class` | `Option<String>` | `None` | Additional CSS classes |

### AvatarSize

```rust
pub enum AvatarSize {
    Sm,       // h-8 w-8
    Default,  // h-10 w-10
    Lg,       // h-12 w-12
}
```

## Build

```bash
cd rust/components/avatar
wasm-pack build --target web --out-dir pkg
```

## Tests

```bash
cargo test
```

4 tests covering size defaults, classes, and text sizes.

## License

MIT
