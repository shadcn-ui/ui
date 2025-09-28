# Fix: Complete TanStack Start root route configuration (#8225)

## Description
Fixes incomplete TanStack Start root route configuration that was causing rendering issues and missing HTML structure.

## Problem
The original code had several critical issues:
- Missing `RootComponent` function implementation
- Incorrect `title` placement in `meta` array instead of `title` field
- No proper HTML structure with required TanStack Start components

## Solution
- ✅ Added complete `RootComponent` with proper HTML structure
- ✅ Fixed `title` configuration placement
- ✅ Added `<Meta />`, `<Outlet />`, and `<Scripts />` components
- ✅ Updated documentation in both v4 and www apps

## Changes Made
- `apps/v4/content/docs/installation/tanstack.mdx` - Updated with complete example
- `apps/www/content/docs/installation/tanstack.mdx` - Updated with complete example  
- `examples/tanstack-start-root-route-fix.tsx` - Added working reference implementation

## Testing
- [x] Code follows project style guide
- [x] No breaking changes to existing functionality
- [x] Documentation updated with complete working example
- [x] Minimal changes focused on bug fix only

## Before/After

**Before (Broken):**
```tsx
// Missing RootComponent, incorrect title placement
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: "TanStack Start Starter" }, // Wrong placement
    ],
  }),
  component: RootComponent, // Not implemented
})
```

**After (Fixed):**
```tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    title: "TanStack Start Starter", // Correct placement
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head><Meta /></head>
      <body><Outlet /><Scripts /></body>
    </html>
  )
}
```

## Validation
- Resolves issue #8225
- Follows TanStack Start documentation patterns
- Maintains consistency with existing shadcn/ui examples
- No additional dependencies introduced

Closes #8225