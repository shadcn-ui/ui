// Static manifest of available components per framework base.
// This is used client-side to determine whether a component page exists
// for a given framework before navigating. Update this when adding new
// framework-specific component docs.

export const FRAMEWORK_COMPONENTS: Record<string, Set<string>> = {
  // React bases have all components — no need to check.
  radix: new Set(["*"]),
  base: new Set(["*"]),
  // Vue and Svelte: list available component slugs.
  vue: new Set(["accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge", "breadcrumb", "button", "button-group", "calendar", "card", "carousel", "chart", "checkbox", "collapsible", "combobox", "command", "context-menu", "dialog", "drawer", "dropdown-menu", "empty", "field", "hover-card", "input", "input-group", "input-otp", "item", "kbd", "label", "menubar", "native-select", "navigation-menu", "pagination", "popover", "progress", "radio-group", "resizable", "scroll-area", "select", "separator", "sheet", "sidebar", "skeleton", "slider", "sonner", "spinner", "switch", "table", "tabs", "textarea", "toggle", "toggle-group", "tooltip"]),
  svelte: new Set(["accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge", "breadcrumb", "button", "button-group", "calendar", "card", "carousel", "chart", "checkbox", "collapsible", "command", "context-menu", "dialog", "drawer", "dropdown-menu", "empty", "field", "hover-card", "input", "input-group", "input-otp", "item", "kbd", "label", "menubar", "native-select", "navigation-menu", "pagination", "popover", "progress", "radio-group", "range-calendar", "resizable", "scroll-area", "select", "separator", "sheet", "sidebar", "skeleton", "slider", "sonner", "spinner", "switch", "table", "tabs", "textarea", "toggle", "toggle-group", "tooltip"]),
  ember: new Set(["accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge", "breadcrumb", "button", "button-group", "card", "checkbox", "collapsible", "combobox", "command", "context-menu", "dialog", "dropdown-menu", "empty", "field", "form", "hover-card", "input", "input-group", "input-otp", "item", "kbd", "label", "native-select", "pagination", "popover", "progress", "radio-group", "scroll-area", "select", "separator", "sheet", "sidebar", "skeleton", "slider", "sonner", "spinner", "switch", "table", "tabs", "textarea", "toast", "toggle", "toggle-group", "tooltip", "typography"]),
}

export function hasComponentForBase(
  base: string,
  componentSlug: string
): boolean {
  const components = FRAMEWORK_COMPONENTS[base]
  if (!components) return false
  if (components.has("*")) return true
  return components.has(componentSlug)
}
