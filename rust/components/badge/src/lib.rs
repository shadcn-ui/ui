use leptos::*;
use wasm_bindgen::prelude::*;

/// Badge variants matching shadcn/ui design system
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BadgeVariant {
    Default,
    Secondary,
    Destructive,
    Outline,
}

impl Default for BadgeVariant {
    fn default() -> Self {
        Self::Default
    }
}

impl BadgeVariant {
    /// Get the Tailwind CSS classes for this variant
    fn classes(&self) -> &'static str {
        match self {
            Self::Default => "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            Self::Secondary => "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            Self::Destructive => "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            Self::Outline => "text-foreground",
        }
    }
}

/// A badge component built with Leptos
///
/// Displays a small count or label, commonly used for tags, categories, or notifications.
///
/// # Examples
///
/// ```rust
/// use badge::{Badge, BadgeVariant};
/// use leptos::*;
///
/// #[component]
/// fn App() -> impl IntoView {
///     view! {
///         // Default badge
///         <Badge text="New" />
///
///         // Secondary variant
///         <Badge text="Beta" variant=BadgeVariant::Secondary />
///
///         // Destructive variant
///         <Badge text="Deprecated" variant=BadgeVariant::Destructive />
///
///         // Outline variant
///         <Badge text="Draft" variant=BadgeVariant::Outline />
///     }
/// }
/// ```
#[component]
pub fn Badge(
    /// The text to display in the badge
    #[prop(into)]
    text: String,

    /// Badge variant (default: Default)
    #[prop(optional)]
    variant: Option<BadgeVariant>,

    /// Additional CSS classes
    #[prop(optional, into)]
    class: Option<String>,
) -> impl IntoView {
    let variant = variant.unwrap_or_default();

    // Base classes that are always applied
    let base_classes = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    // Combine all classes
    let badge_class = format!(
        "{} {}{}",
        base_classes,
        variant.classes(),
        class.map(|c| format!(" {}", c)).unwrap_or_default()
    );

    view! {
        <div class=badge_class>
            {text}
        </div>
    }
}

/// Initialize the panic hook for better error messages in the browser console
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

/// Mount a simple badge component to the body
///
/// # Arguments
/// * `text` - The badge text
#[wasm_bindgen]
pub fn mount_badge(text: &str) -> Result<(), JsValue> {
    let text = text.to_string();

    mount_to_body(move || {
        view! {
            <Badge text=text.clone() />
        }
    });

    Ok(())
}

/// Mount a badge with a specific variant
///
/// # Arguments
/// * `text` - The badge text
/// * `variant` - Variant name: "default", "secondary", "destructive", "outline"
#[wasm_bindgen]
pub fn mount_badge_variant(text: &str, variant: &str) -> Result<(), JsValue> {
    let text = text.to_string();
    let variant = match variant.to_lowercase().as_str() {
        "secondary" => BadgeVariant::Secondary,
        "destructive" => BadgeVariant::Destructive,
        "outline" => BadgeVariant::Outline,
        _ => BadgeVariant::Default,
    };

    mount_to_body(move || {
        view! {
            <Badge text=text.clone() variant=variant />
        }
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_badge_variant_default() {
        let variant = BadgeVariant::default();
        assert_eq!(variant, BadgeVariant::Default);
    }

    #[test]
    fn test_badge_variant_classes() {
        assert!(BadgeVariant::Default.classes().contains("bg-primary"));
        assert!(BadgeVariant::Secondary.classes().contains("bg-secondary"));
        assert!(BadgeVariant::Destructive.classes().contains("bg-destructive"));
        assert!(BadgeVariant::Outline.classes().contains("text-foreground"));
    }

    #[test]
    fn test_all_variants_have_classes() {
        let variants = vec![
            BadgeVariant::Default,
            BadgeVariant::Secondary,
            BadgeVariant::Destructive,
            BadgeVariant::Outline,
        ];

        for variant in variants {
            assert!(!variant.classes().is_empty(), "Variant {:?} should have classes", variant);
        }
    }
}
