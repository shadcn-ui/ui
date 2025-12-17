# Fix clipped focus outlines & improve accessibility (Issue #9010)

## Summary

Fixes clipped keyboard focus rings across the UI by using inset focus rings and switching visually-noisy `:focus` styles to `:focus-visible` on key interactive controls. Also adds safe fallbacks for `NEXT_PUBLIC_APP_URL` to avoid an `Invalid URL` runtime error during dev.

## Why

Focus rings were being partially clipped by containers with `overflow: hidden`, reducing keyboard visibility and accessibility. The `NEXT_PUBLIC_APP_URL` fallback prevents Next.js from throwing `ERR_INVALID_URL` when the env var is missing in local development.

## Files changed (high level)

- `apps/v4/registry/new-york-v4/ui/item.tsx` — draw focus ring inset for item variants
- `apps/v4/registry/new-york-v4/ui/sidebar.tsx` — make sidebar menu buttons use inset focus rings
- `apps/v4/registry/new-york-v4/ui/dialog.tsx` — switch close button to `focus-visible` + inset ring
- `apps/v4/registry/new-york-v4/ui/sheet.tsx` — switch sheet close button to `focus-visible` + inset ring
- `apps/v4/app/layout.tsx` — fallback for `metadataBase` URL
- `apps/v4/lib/utils.ts` — fallback for `absoluteUrl`
- `apps/v4/.env.local` — example local env added (dev-only)

## What I changed technically

- Use `focus-visible` for keyboard-only focus rings to avoid showing the ring on mouse interaction.
- Add `focus-visible:ring-inset` (Tailwind `ring-inset`) so the ring is drawn inside the element box (prevents clipping by overflow).
- Provide `process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"` fallbacks to prevent `new URL(undefined)` errors during dev.

## Testing / How to verify

1. Checkout the branch and run dev:

```bash
pnpm --filter ./apps/v4 dev
```

2. Navigate the app with keyboard (Tab / Shift+Tab) and confirm:
   - Focus ring appears on keyboard focus only (not on mouse click).
   - Focus rings are fully visible for sidebar items, dialog/sheet close buttons, and similar controls near container edges.

3. Confirm the `Invalid URL` error no longer occurs when `NEXT_PUBLIC_APP_URL` is not set.

## Accessibility impact

- Improved keyboard focus visibility and adherence to `:focus-visible` best practices. This helps users who rely on keyboard navigation and aligns with accessibility expectations.

## Risk / Notes

- Visual appearance of focus rings is preserved; ring is now inset so it may appear slightly different near rounded corners — design can be adjusted if you want a larger offset or color change.
- The `.env.local` file added is for local development only; make sure to set `NEXT_PUBLIC_APP_URL` in your production environment instead of relying on the fallback.

## Related issue

- Closes / addresses: #9010

---

If you want, I can also:
- Add a short screenshot/GIF before & after to the PR.
- Extend the inset-ring change to more components across the repo.
- Open the pull request for you (requires network connectivity to GitHub).
