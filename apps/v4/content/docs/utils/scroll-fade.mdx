---
title: scroll-fade
description: Utilities for adding a fade effect to the edges of a scroll container.
---

<ComponentPreview
  styleName="base-rhea"
  name="scroll-fade-demo"
  previewClassName="h-auto"
/>

## Installation

If your project was set up with `npx shadcn@latest init`, you already have `scroll-fade`. It ships with the `shadcn` package, which the CLI imports in your global CSS file.

Otherwise, install the `shadcn` package:

```bash
npm install shadcn
```

Then import the shared utilities in your global CSS file:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
```

## Usage

| Class                             | Styles                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `scroll-fade`                     | `mask-image: var(--scroll-fade-mask, var(--scroll-fade-block));` <br /> `animation-timeline: scroll(self y);`       |
| `scroll-fade-y`                   | `mask-image: var(--scroll-fade-mask, var(--scroll-fade-block));` <br /> `animation-timeline: scroll(self y);`       |
| `scroll-fade-x`                   | `mask-image: var(--scroll-fade-mask, var(--scroll-fade-inline));` <br /> `animation-timeline: scroll(self inline);` |
| `scroll-fade-t`                   | Fade mask on the top edge. <br /> `animation-timeline: scroll(self y);`                                             |
| `scroll-fade-b`                   | Fade mask on the bottom edge. <br /> `animation-timeline: scroll(self y);`                                          |
| `scroll-fade-l`                   | Fade mask on the left edge. <br /> `animation-timeline: scroll(self x);`                                            |
| `scroll-fade-r`                   | Fade mask on the right edge. <br /> `animation-timeline: scroll(self x);`                                           |
| `scroll-fade-s`                   | Fade mask on the start edge, mirrors in RTL. <br /> `animation-timeline: scroll(self inline);`                      |
| `scroll-fade-e`                   | Fade mask on the end edge, mirrors in RTL. <br /> `animation-timeline: scroll(self inline);`                        |
| `scroll-fade-<number>`            | `--scroll-fade-size: calc(var(--spacing) * <number>);`                                                              |
| `scroll-fade-[<value>]`           | `--scroll-fade-size: <value>;`                                                                                      |
| `scroll-fade-{t,b,s,e}-<number>`  | `--scroll-fade-{t,b,s,e}-size: calc(var(--spacing) * <number>);`                                                    |
| `scroll-fade-{t,b,s,e}-[<value>]` | `--scroll-fade-{t,b,s,e}-size: <value>;`                                                                            |
| `scroll-fade-none`                | `--scroll-fade-mask: none;`                                                                                         |

Add `scroll-fade` or `scroll-fade-y` to the scroll container, i.e. the element that has `overflow-y-auto`.

```tsx
<div className="scroll-fade overflow-y-auto">{/* ... */}</div>
```

The fade is scroll-aware and tracks the scroll position:

- At rest, the top edge is crisp and the bottom edge fades to hint at more content.
- As you scroll, a fade appears at the top and both edges stay faded mid-scroll.
- At the end, the bottom edge sharpens to show you have reached the last item.

The fade is applied with `mask-image`, so it dissolves the content itself rather than overlaying a color. The mask uses a linear fade from transparent to black, so it adapts to any background without configuration. If your scroll area sits inside a card, put the background and border on a wrapper and `scroll-fade` on the inner scroller, so the fade dissolves the content and not the card.

The [`ScrollArea`](/docs/components/scroll-area) and [`MessageScroller`](/docs/components/message-scroller) components can use `scroll-fade` on their scrollable viewport.

## No Overflow, No Fade

If the content does not overflow, no fade is shown. You can apply `scroll-fade` to any list without checking whether it scrolls.

<ComponentPreview
  styleName="base-rhea"
  name="scroll-fade-overflow"
  previewClassName="h-auto"
/>

## Horizontal Scrolling

Use `scroll-fade-x` on containers that scroll horizontally, i.e. the element that has `overflow-x-auto`.

<ComponentPreview
  styleName="base-rhea"
  name="scroll-fade-horizontal"
  previewClassName="h-64"
/>

```tsx
<div className="flex scroll-fade-x overflow-x-auto">{/* ... */}</div>
```

The horizontal fade is direction-aware. In RTL layouts, the crisp edge and the fade follow the reading direction with no extra classes needed. `scroll-fade-<number>` and `scroll-fade-none` work the same for both axes.

## Edge Fades

Use edge utilities when only one edge should track the scroll position.

<ComponentPreview
  styleName="base-rhea"
  name="scroll-fade-edge"
  previewClassName="h-auto"
/>

```tsx
<div className="scroll-fade-b overflow-y-auto">{/* ... */}</div>
```

The edge utilities are scroll-aware. Start edges fade in after you scroll away from the start, and end edges fade out when you reach the end. Use `scroll-fade-t`, `scroll-fade-b`, `scroll-fade-l`, and `scroll-fade-r` for physical edges. Use `scroll-fade-s` and `scroll-fade-e` for logical inline edges that mirror in RTL.

## Fade Size

The fade depth defaults to `12%` of the container, capped at `40px` so tall scrollers stay subtle. Use `scroll-fade-<number>` to set a fixed size on the spacing scale instead, the same way `scroll-mt-<number>` works.

<ComponentPreview
  styleName="base-rhea"
  name="scroll-fade-size"
  previewClassName="h-auto"
/>

```tsx
<div className="scroll-fade overflow-y-auto scroll-fade-24">{/* ... */}</div>
```

For one-off values, use an arbitrary length or percentage:

```tsx
<div className="scroll-fade overflow-y-auto scroll-fade-[15%]">{/* ... */}</div>
```

To fade opposite edges by different amounts, use the per-edge modifiers `scroll-fade-t-<number>`, `scroll-fade-b-<number>`, `scroll-fade-s-<number>`, and `scroll-fade-e-<number>`. They override `scroll-fade-<number>` on the edge they target and accept arbitrary values too.

```tsx
<div className="scroll-fade overflow-y-auto scroll-fade-b-8 scroll-fade-t-2">
  {/* ... */}
</div>
```

Use the logical `s`/`e` modifiers for horizontal scrollers so the sizes mirror in RTL.

The fade eases in and out over a fixed scroll distance rather than appearing instantly. That distance is the `--scroll-fade-reveal` variable, `96px` by default and independent of the fade depth. Lower it for a snappier reveal or raise it for a more gradual one:

```tsx
<div className="scroll-fade overflow-y-auto [--scroll-fade-reveal:64px]">
  {/* ... */}
</div>
```

## Disabling the Fade

Use `scroll-fade-none` to remove the fade. It works in any class order, so the typical use is responsive or stateful:

```tsx
<div className="scroll-fade overflow-y-auto md:scroll-fade-none">
  {/* ... */}
</div>
```

<ComponentPreview
  styleName="base-rhea"
  name="scroll-fade-none"
  previewClassName="h-auto"
/>

## Fallback

The scroll-aware behavior is implemented with [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations), with no JavaScript and no scroll listeners. In browsers that do not support scroll-driven animations, `scroll-fade` falls back to a static fade on both edges, and edge utilities fall back to a static fade on the selected edge.

Since the mask is applied to the scroll container itself, a visible scrollbar fades with the content at the edges. Pair `scroll-fade` with `no-scrollbar`, which ships in the same package, if you want to hide the scrollbar entirely.

## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl).

`scroll-fade-x` follows the reading direction. At rest, the start edge is crisp and the end edge fades. In RTL layouts that means a crisp right edge and a fade on the left, mirrored from LTR.

<ComponentPreview
  styleName="base-nova"
  name="scroll-fade-rtl"
  direction="rtl"
/>
