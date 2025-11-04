use leptos::*;
use wasm_bindgen::prelude::*;

/// A basic button component built with Leptos
///
/// This is a foundational UI component that provides a clickable button
/// with Tailwind CSS styling similar to shadcn/ui React components.
#[component]
pub fn Button(
    /// The text to display on the button
    #[prop(into)]
    label: String,

    /// Optional click handler
    #[prop(optional)]
    on_click: Option<Box<dyn Fn()>>,
) -> impl IntoView {
    // Base classes matching shadcn/ui button styling
    let class = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2";

    let handle_click = move |_| {
        if let Some(ref callback) = on_click {
            callback();
        }
    };

    view! {
        <button
            class=class
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

/// Mount the button component to a DOM element
///
/// # Arguments
/// * `selector` - CSS selector for the mount point (e.g., "#app")
/// * `label` - The button text
#[wasm_bindgen]
pub fn mount_button(selector: &str, label: &str) -> Result<(), JsValue> {
    let label = label.to_string();

    mount_to_body(move || {
        view! {
            <Button label=label.clone() />
        }
    });

    Ok(())
}
