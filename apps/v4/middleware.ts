import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of all component names.
const COMPONENT_NAMES = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "form",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "typography",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Match /docs/components/:component (not /docs/components/radix/:component or /docs/components/base/:component).
  const match = pathname.match(/^\/docs\/components\/([^/]+)$/)

  if (match) {
    const segment = match[1]
    // Redirect component pages to radix version (default).
    if (COMPONENT_NAMES.includes(segment)) {
      return NextResponse.redirect(
        new URL(`/docs/components/radix/${segment}`, request.url),
        301
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/docs/components/:path*",
}
