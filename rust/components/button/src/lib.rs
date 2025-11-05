use leptos::*;
use wasm_bindgen::prelude::*;

/// Button variants matching shadcn/ui design system
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ButtonVariant {
    Default,
    Destructive,
    Outline,
    Secondary,
    Ghost,
    Link,
}

impl Default for ButtonVariant {
    fn default() -> Self {
        Self::Default
    }
}

impl ButtonVariant {
    /// Get the Tailwind CSS classes for this variant
    fn classes(&self) -> &'static str {
        match self {
            Self::Default => "bg-primary text-primary-foreground hover:bg-primary/90",
            Self::Destructive => "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            Self::Outline => "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            Self::Secondary => "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            Self::Ghost => "hover:bg-accent hover:text-accent-foreground",
            Self::Link => "text-primary underline-offset-4 hover:underline",
        }
    }
}

/// Button sizes matching shadcn/ui design system
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ButtonSize {
    Default,
    Sm,
    Lg,
    Icon,
}

impl Default for ButtonSize {
    fn default() -> Self {
        Self::Default
    }
}

impl ButtonSize {
    /// Get the Tailwind CSS classes for this size
    fn classes(&self) -> &'static str {
        match self {
            Self::Default => "h-10 px-4 py-2",
            Self::Sm => "h-9 rounded-md px-3",
            Self::Lg => "h-11 rounded-md px-8",
            Self::Icon => "h-10 w-10",
        }
    }
}

/// A flexible button component built with Leptos
///
/// This component provides a clickable button with multiple variants and sizes,
/// matching the shadcn/ui design system with Tailwind CSS styling.
///
/// # Examples
///
/// ```rust
/// use button::{Button, ButtonVariant, ButtonSize};
/// use leptos::*;
///
/// #[component]
/// fn App() -> impl IntoView {
///     view! {
///         // Default button
///         <Button label="Click me" />
///
///         // Destructive variant
///         <Button label="Delete" variant=ButtonVariant::Destructive />
///
///         // Small outline button with click handler
///         <Button
///             label="Submit"
///             variant=ButtonVariant::Outline
///             size=ButtonSize::Sm
///             on_click=Some(Box::new(|| {
///                 // Handle click
///             }))
///         />
///     }
/// }
/// ```
#[component]
pub fn Button(
    /// The text to display on the button
    #[prop(into)]
    label: String,

    /// Button variant (default: Default)
    #[prop(optional)]
    variant: Option<ButtonVariant>,

    /// Button size (default: Default)
    #[prop(optional)]
    size: Option<ButtonSize>,

    /// Whether the button is disabled
    #[prop(optional)]
    disabled: Option<bool>,

    /// Additional CSS classes
    #[prop(optional, into)]
    class: Option<String>,

    /// Optional click handler
    #[prop(optional)]
    on_click: Option<Box<dyn Fn()>>,
) -> impl IntoView {
    let variant = variant.unwrap_or_default();
    let size = size.unwrap_or_default();
    let disabled = disabled.unwrap_or(false);

    // Base classes that are always applied
    let base_classes = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    // Combine all classes
    let button_class = format!(
        "{} {} {}{}",
        base_classes,
        variant.classes(),
        size.classes(),
        class.map(|c| format!(" {}", c)).unwrap_or_default()
    );

    let handle_click = move |_| {
        if !disabled {
            if let Some(ref callback) = on_click {
                callback();
            }
        }
    };

    view! {
        <button
            class=button_class
            disabled=disabled
            on:click=handle_click
        >
            {label}
        </button>
    }
}

/// Initialize the panic hook for better error messages in the browser console
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

/// Mount a simple button component to the body
///
/// # Arguments
/// * `label` - The button text
#[wasm_bindgen]
pub fn mount_button(label: &str) -> Result<(), JsValue> {
    let label = label.to_string();

    mount_to_body(move || {
        view! {
            <Button label=label.clone() />
        }
    });

    Ok(())
}

/// Mount a button with a specific variant
///
/// # Arguments
/// * `label` - The button text
/// * `variant` - Variant name: "default", "destructive", "outline", "secondary", "ghost", "link"
#[wasm_bindgen]
pub fn mount_button_variant(label: &str, variant: &str) -> Result<(), JsValue> {
    let label = label.to_string();
    let variant = match variant.to_lowercase().as_str() {
        "destructive" => ButtonVariant::Destructive,
        "outline" => ButtonVariant::Outline,
        "secondary" => ButtonVariant::Secondary,
        "ghost" => ButtonVariant::Ghost,
        "link" => ButtonVariant::Link,
        _ => ButtonVariant::Default,
    };

    mount_to_body(move || {
        view! {
            <Button label=label.clone() variant=variant />
        }
    });

    Ok(())
}

/// Mount a button with specific variant and size
///
/// # Arguments
/// * `label` - The button text
/// * `variant` - Variant name: "default", "destructive", "outline", "secondary", "ghost", "link"
/// * `size` - Size name: "default", "sm", "lg", "icon"
#[wasm_bindgen]
pub fn mount_button_full(label: &str, variant: &str, size: &str) -> Result<(), JsValue> {
    let label = label.to_string();

    let variant = match variant.to_lowercase().as_str() {
        "destructive" => ButtonVariant::Destructive,
        "outline" => ButtonVariant::Outline,
        "secondary" => ButtonVariant::Secondary,
        "ghost" => ButtonVariant::Ghost,
        "link" => ButtonVariant::Link,
        _ => ButtonVariant::Default,
    };

    let size = match size.to_lowercase().as_str() {
        "sm" => ButtonSize::Sm,
        "lg" => ButtonSize::Lg,
        "icon" => ButtonSize::Icon,
        _ => ButtonSize::Default,
    };

    mount_to_body(move || {
        view! {
            <Button label=label.clone() variant=variant size=size />
        }
    });

    Ok(())
}
