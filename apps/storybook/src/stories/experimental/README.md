# Storybook — Experimental Figma Exports

Storybook-only previews generated from Figma component nodes for visual review.

## What this is

This directory holds Storybook stories that **preview** Figma component surfaces against Lead's existing React components. Each story documents:

- The source Figma node URL.
- Which Figma variants/properties **map cleanly** to Lead's React API.
- Which Figma variants are **approximated** with Storybook-only wrappers (because Lead has no equivalent React prop today).
- Which Figma surface is **deferred** (no React equivalent and no API decision yet).

## What this is NOT

- **Not Code Connect.** Code Connect pushes Lead React snippets *into* Figma Dev Mode. That's a separate lane and currently parked behind a Figma org scope blocker (see `docs/code-connect-publish-readiness.md`).
- **Not a production code generator.** These previews never modify `packages/lead-ui/src/components/*` source. If a Figma surface change should drive a Lead React API change, that's a separate, deliberate decision made *after* reviewing the preview here.
- **Not a unilateral source of truth.** Figma describes the visual contract; Lead's React components encode the behavioral contract (focus, ARIA, form integration, polymorphism). The two surfaces are aligned by deliberate human decisions — see `packages/lead-ui/API-CONSISTENCY.md`.

## How to add a new export

1. Pick a low-risk visual primitive (Badge, Separator, Skeleton, Alert).
2. Open a draft PR adding `apps/storybook/src/stories/experimental/<Component>.figma-export.stories.tsx`.
3. The story's title should be `"Experimental/Figma Export/<Component>"` so it lands under a clearly-marked sidebar section.
4. Document mapped vs. approximated vs. deferred variants inline.
5. Include the source Figma node URL prominently in the story body.
6. Verify Storybook builds and existing lead-ui tests stay green.

## Tracking

- **JES-82** — first prototype (Badge).
- Future exports get their own Linear issues; reference the milestone "Figma to Storybook export."
