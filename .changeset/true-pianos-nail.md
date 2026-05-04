---
"shadcn": patch
---

fix(sidebar): prevent layout overflow from wide content using `min-w-0`

Fixes an issue where wide children (e.g. tables with long content) inside `SidebarInset`
could expand beyond the viewport, causing an unwanted page-level horizontal scrollbar.

### Root Cause

Flex items default to `min-width: auto`, which prevents them from shrinking smaller
than their intrinsic content width. This caused `SidebarInset` to overflow when rendering wide content.

### Fix

Apply `min-w-0` to `SidebarInset` to allow proper flex shrink behavior.

### Why not `overflow-x-hidden`?

Using `overflow-x-hidden` creates a clipping context, which breaks unportaled floating UI
components such as DropdownMenu, Select, and Tooltip by cutting them off near edges.

### Result

* Prevents layout-breaking horizontal overflow
* Preserves correct behavior for floating components
* Allows consumers to handle intentional overflow (e.g. tables) via `overflow-x-auto`
