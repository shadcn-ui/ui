use leptos::*;
use wasm_bindgen::prelude::*;

/// Separator orientation
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SeparatorOrientation {
    Horizontal,
    Vertical,
}

impl Default for SeparatorOrientation {
    fn default() -> Self {
        Self::Horizontal
    }
}

impl SeparatorOrientation {
    fn classes(&self) -> &'static str {
        match self {
            Self::Horizontal => "h-[1px] w-full",
            Self::Vertical => "h-full w-[1px]",
        }
    }
}

/// A separator/divider component
///
/// # Examples
///
/// ```rust
/// use separator::{Separator, SeparatorOrientation};
/// use leptos::*;
///
/// #[component]
/// fn App() -> impl IntoView {
///     view! {
///         <div>
///             <p>"Content above"</p>
///             <Separator />
///             <p>"Content below"</p>
///
///             <div class="flex">
///                 <div>"Left"</div>
///                 <Separator orientation=SeparatorOrientation::Vertical />
///                 <div>"Right"</div>
///             </div>
///         </div>
///     }
/// }
/// ```
#[component]
pub fn Separator(
    /// Orientation (default: Horizontal)
    #[prop(optional)]
    orientation: Option<SeparatorOrientation>,

    /// Decorative only (no semantic meaning)
    #[prop(optional)]
    decorative: Option<bool>,

    /// Additional CSS classes
    #[prop(optional, into)]
    class: Option<String>,
) -> impl IntoView {
    let orientation = orientation.unwrap_or_default();
    let decorative = decorative.unwrap_or(false);

    let base_classes = "shrink-0 bg-border";
    let separator_class = format!(
        "{} {}{}",
        base_classes,
        orientation.classes(),
        class.map(|c| format!(" {}", c)).unwrap_or_default()
    );

    if decorative {
        view! { <div class=separator_class /> }.into_view()
    } else {
        view! {
            <div
                role="separator"
                aria-orientation=move || match orientation {
                    SeparatorOrientation::Horizontal => "horizontal",
                    SeparatorOrientation::Vertical => "vertical",
                }
                class=separator_class
            />
        }.into_view()
    }
}

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn mount_separator() -> Result<(), JsValue> {
    mount_to_body(|| view! { <Separator /> });
    Ok(())
}

#[wasm_bindgen]
pub fn mount_separator_vertical() -> Result<(), JsValue> {
    mount_to_body(|| view! { <Separator orientation=SeparatorOrientation::Vertical /> });
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_orientation_default() {
        assert_eq!(SeparatorOrientation::default(), SeparatorOrientation::Horizontal);
    }

    #[test]
    fn test_orientation_classes() {
        assert!(SeparatorOrientation::Horizontal.classes().contains("w-full"));
        assert!(SeparatorOrientation::Vertical.classes().contains("h-full"));
    }
}
