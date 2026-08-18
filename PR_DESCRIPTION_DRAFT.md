## 📌 Summary
Fixes #11533

Adds `asChild` / `render` / `elementType` support to `SidebarContent`, enabling developers to render `SidebarContent` as a `<nav>` landmark for screen reader navigation and accessibility compliance without breaking layout or styling.

---

## 🔍 Root Cause Analysis
Previously, `SidebarContent` rendered a hardcoded `<div>` and did not accept `asChild` (unlike sibling components like `SidebarGroupLabel`, `SidebarGroupAction`, and `SidebarMenuButton`). Because `SidebarContent` manages flex and scroll container behavior (`min-h-0 flex-1 overflow-auto`), wrapping it in an external `<nav>` breaks layout behavior, while omitting `<nav>` prevents screen readers from discovering the main navigation landmark.

---

## 🛠️ Changes
- **`apps/v4/registry/new-york-v4/ui/sidebar.tsx`**: Added `asChild` prop support using `Slot.Root` from `@radix-ui/react-slot`.
- **`apps/v4/registry/bases/radix/ui/sidebar.tsx`**: Added `asChild` prop support using `Slot.Root`.
- **`apps/v4/registry/bases/base/ui/sidebar.tsx`**: Added `render` prop support via `useRender`.
- **`apps/v4/registry/bases/aria/ui/sidebar.tsx`**: Added `elementType` prop support.
