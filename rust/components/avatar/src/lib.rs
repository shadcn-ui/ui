use leptos::*;
use wasm_bindgen::prelude::*;

/// Avatar sizes matching shadcn/ui design system
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AvatarSize {
    Sm,
    Default,
    Lg,
}

impl Default for AvatarSize {
    fn default() -> Self {
        Self::Default
    }
}

impl AvatarSize {
    /// Get the Tailwind CSS classes for this size
    fn classes(&self) -> &'static str {
        match self {
            Self::Sm => "h-8 w-8",
            Self::Default => "h-10 w-10",
            Self::Lg => "h-12 w-12",
        }
    }

    /// Get the text size class for fallback text
    fn text_size(&self) -> &'static str {
        match self {
            Self::Sm => "text-xs",
            Self::Default => "text-sm",
            Self::Lg => "text-base",
        }
    }
}

/// An avatar component built with Leptos
///
/// Displays a user avatar with image, fallback to initials, and error handling.
///
/// # Examples
///
/// ```rust
/// use avatar::{Avatar, AvatarSize};
/// use leptos::*;
///
/// #[component]
/// fn App() -> impl IntoView {
///     view! {
///         // With image
///         <Avatar
///             src=Some("https://github.com/shadcn.png".to_string())
///             alt="User Avatar"
///         />
///
///         // With initials fallback
///         <Avatar
///             alt="John Doe"
///             fallback="JD"
///         />
///
///         // Large size
///         <Avatar
///             src=Some("https://github.com/shadcn.png".to_string())
///             alt="User"
///             size=AvatarSize::Lg
///         />
///     }
/// }
/// ```
#[component]
pub fn Avatar(
    /// The alt text for the image (required for accessibility)
    #[prop(into)]
    alt: String,

    /// The image source URL
    #[prop(optional, into)]
    src: Option<String>,

    /// Fallback text (usually initials) when image fails to load
    #[prop(optional, into)]
    fallback: Option<String>,

    /// Avatar size (default: Default)
    #[prop(optional)]
    size: Option<AvatarSize>,

    /// Additional CSS classes
    #[prop(optional, into)]
    class: Option<String>,
) -> impl IntoView {
    let size = size.unwrap_or_default();
    let (image_loaded, set_image_loaded) = create_signal(src.is_some());
    let (image_error, set_image_error) = create_signal(false);

    // Base classes that are always applied
    let base_classes = "relative flex shrink-0 overflow-hidden rounded-full";

    // Combine all classes
    let avatar_class = format!(
        "{} {} {}{}",
        base_classes,
        size.classes(),
        if image_loaded.get() && !image_error.get() { "" } else { "bg-muted" },
        class.map(|c| format!(" {}", c)).unwrap_or_default()
    );

    // Determine what to display
    let fallback_text = fallback.unwrap_or_else(|| {
        // Extract initials from alt text
        alt.split_whitespace()
            .filter_map(|word| word.chars().next())
            .take(2)
            .collect::<String>()
            .to_uppercase()
    });

    view! {
        <span class=avatar_class>
            {move || {
                if let Some(ref src_url) = src {
                    if !image_error.get() {
                        view! {
                            <img
                                src=src_url.clone()
                                alt=alt.clone()
                                class="aspect-square h-full w-full object-cover"
                                on:error=move |_| {
                                    set_image_error.set(true);
                                    set_image_loaded.set(false);
                                }
                                on:load=move |_| {
                                    set_image_loaded.set(true);
                                    set_image_error.set(false);
                                }
                            />
                        }.into_view()
                    } else {
                        // Show fallback when image fails
                        view! {
                            <span class=format!(
                                "flex h-full w-full items-center justify-center font-medium {}",
                                size.text_size()
                            )>
                                {fallback_text.clone()}
                            </span>
                        }.into_view()
                    }
                } else {
                    // No image source, show fallback
                    view! {
                        <span class=format!(
                            "flex h-full w-full items-center justify-center font-medium {}",
                            size.text_size()
                        )>
                            {fallback_text.clone()}
                        </span>
                    }.into_view()
                }
            }}
        </span>
    }
}

/// Initialize the panic hook for better error messages in the browser console
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

/// Mount a simple avatar component to the body
///
/// # Arguments
/// * `src` - The image URL
/// * `alt` - Alt text for accessibility
#[wasm_bindgen]
pub fn mount_avatar(src: &str, alt: &str) -> Result<(), JsValue> {
    let src = if src.is_empty() { None } else { Some(src.to_string()) };
    let alt = alt.to_string();

    mount_to_body(move || {
        view! {
            <Avatar src=src.clone() alt=alt.clone() />
        }
    });

    Ok(())
}

/// Mount an avatar with fallback text
///
/// # Arguments
/// * `src` - The image URL (empty string for no image)
/// * `alt` - Alt text for accessibility
/// * `fallback` - Fallback text (usually initials)
#[wasm_bindgen]
pub fn mount_avatar_with_fallback(src: &str, alt: &str, fallback: &str) -> Result<(), JsValue> {
    let src = if src.is_empty() { None } else { Some(src.to_string()) };
    let alt = alt.to_string();
    let fallback = Some(fallback.to_string());

    mount_to_body(move || {
        view! {
            <Avatar src=src.clone() alt=alt.clone() fallback=fallback.clone() />
        }
    });

    Ok(())
}

/// Mount an avatar with specific size
///
/// # Arguments
/// * `src` - The image URL (empty string for no image)
/// * `alt` - Alt text for accessibility
/// * `fallback` - Fallback text
/// * `size` - Size name: "sm", "default", "lg"
#[wasm_bindgen]
pub fn mount_avatar_full(src: &str, alt: &str, fallback: &str, size: &str) -> Result<(), JsValue> {
    let src = if src.is_empty() { None } else { Some(src.to_string()) };
    let alt = alt.to_string();
    let fallback = Some(fallback.to_string());

    let size = match size.to_lowercase().as_str() {
        "sm" => AvatarSize::Sm,
        "lg" => AvatarSize::Lg,
        _ => AvatarSize::Default,
    };

    mount_to_body(move || {
        view! {
            <Avatar src=src.clone() alt=alt.clone() fallback=fallback.clone() size=size />
        }
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_avatar_size_default() {
        let size = AvatarSize::default();
        assert_eq!(size, AvatarSize::Default);
    }

    #[test]
    fn test_avatar_size_classes() {
        assert_eq!(AvatarSize::Sm.classes(), "h-8 w-8");
        assert_eq!(AvatarSize::Default.classes(), "h-10 w-10");
        assert_eq!(AvatarSize::Lg.classes(), "h-12 w-12");
    }

    #[test]
    fn test_avatar_text_sizes() {
        assert_eq!(AvatarSize::Sm.text_size(), "text-xs");
        assert_eq!(AvatarSize::Default.text_size(), "text-sm");
        assert_eq!(AvatarSize::Lg.text_size(), "text-base");
    }

    #[test]
    fn test_all_sizes_have_classes() {
        let sizes = vec![
            AvatarSize::Sm,
            AvatarSize::Default,
            AvatarSize::Lg,
        ];

        for size in sizes {
            assert!(!size.classes().is_empty(), "Size {:?} should have classes", size);
            assert!(!size.text_size().is_empty(), "Size {:?} should have text size", size);
        }
    }
}
