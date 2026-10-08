---
title: shimmer
description: Utilities for adding a shimmer effect to text elements.
---

<ComponentPreview styleName="base-rhea" name="shimmer-demo" />

## Installation

If your project was set up with `npx shadcn@latest init`, you already have `shimmer`. It ships with the `shadcn` package, which the CLI imports in your global CSS file.

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

| Class                         | Styles                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| `shimmer`                     | `background-clip: text;` <br /> `animation: tw-shimmer var(--shimmer-duration, 2s) linear infinite;` |
| `shimmer-once`                | `animation-iteration-count: 1;`                                                                      |
| `shimmer-reverse`             | `animation-direction: reverse;`                                                                      |
| `shimmer-none`                | `--shimmer-image: none;` <br /> `--shimmer-text-fill: currentColor;`                                 |
| `shimmer-color-<color>`       | `--shimmer-color: <color>;`                                                                          |
| `shimmer-color-[<value>]`     | `--shimmer-color: <value>;`                                                                          |
| `shimmer-color-<color>/<pct>` | `--shimmer-color: color-mix(in oklch, <color> <pct>, transparent);`                                  |
| `shimmer-duration-<number>`   | `--shimmer-duration: calc(<number> * 1ms);`                                                          |
| `shimmer-spread-<number>`     | `--shimmer-spread: calc(var(--spacing) * <number>);`                                                 |
| `shimmer-spread-[<value>]`    | `--shimmer-spread: <value>;`                                                                         |
| `shimmer-angle-<number>`      | `--shimmer-angle: calc(<number> * 1deg);`                                                            |

Add `shimmer` to a text element.

```tsx
<p className="shimmer text-muted-foreground">Generating response&hellip;</p>
```

The shimmer is built on `currentColor`, so it adapts to the element:

- The highlight is derived from the text color, with no configuration needed.
- It works on any color, from `text-muted-foreground` to brand colors.
- In dark mode, the highlight automatically brightens to stay visible.

The effect is pure CSS. The text is painted with `background-clip: text`, and the highlight sweeps across it in a seamless loop.

## With Marker

The shimmer composes with any component that renders text. A common pattern is a [Marker](/docs/components/marker) showing a live status while the assistant is working:

<ComponentPreview styleName="base-rhea" name="shimmer-marker" />

```tsx
<Marker role="status">
  <MarkerIcon>
    <Spinner />
  </MarkerIcon>
  <MarkerContent className="shimmer">Thinking&hellip;</MarkerContent>
</Marker>
```

## Color

Use `shimmer-color-<color>` to set the highlight color explicitly. It accepts theme colors with an optional opacity modifier, or any arbitrary color value.

<ComponentPreview styleName="base-rhea" name="shimmer-color" />

```tsx
<p className="shimmer shimmer-color-blue-500/60">Generating response&hellip;</p>
<p className="shimmer shimmer-color-[#378ADD]">Generating response&hellip;</p>
```

## Duration

Use `shimmer-duration-<number>` to set the duration of one sweep in milliseconds. The default is `2000`, i.e. `2s`.

<ComponentPreview styleName="base-rhea" name="shimmer-duration" />

```tsx
<p className="shimmer shimmer-duration-1000">Generating response&hellip;</p>
```

## Spread

Use `shimmer-spread-<number>` to set the width of the highlight band using the spacing scale. The default is `calc(3ch + 40px)`: a fixed base plus a `3ch` term that scales with the font size.

<ComponentPreview styleName="base-rhea" name="shimmer-spread" />

```tsx
<p className="shimmer shimmer-spread-24">Generating response&hellip;</p>
```

For one-off values, use an arbitrary length or percentage:

```tsx
<p className="shimmer shimmer-spread-[5rem]">Generating response&hellip;</p>
```

## Angle

Use `shimmer-angle-<number>` to set the tilt of the highlight band in degrees. The default is `20`.

<ComponentPreview styleName="base-rhea" name="shimmer-angle" />

```tsx
<p className="shimmer shimmer-angle-45">Generating response&hellip;</p>
```

## Reverse

Use `shimmer-reverse` to sweep the highlight in the opposite direction. In RTL layouts the sweep already follows the reading direction. See [RTL](#rtl).

```tsx
<p className="shimmer shimmer-reverse">Generating response&hellip;</p>
```

## Play Once

Use `shimmer-once` to play a single sweep instead of looping, useful as a reveal when streaming completes. Pair it with `shimmer-duration-<number>` to control how long the sweep takes.

<ComponentPreview styleName="base-rhea" name="shimmer-once" />

```tsx
<p className="shimmer shimmer-duration-1100 shimmer-once">
  Response generated.
</p>
```

## Disabling the Shimmer

Use `shimmer-none` to turn the effect off and render the text normally. It works in any class order, so the typical use is responsive or stateful:

<ComponentPreview styleName="base-rhea" name="shimmer-none" />

```tsx
<p className="shimmer md:shimmer-none">Generating response&hellip;</p>
```

## Fallback

The shimmer is built on modern color features, [relative color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors) and `color-mix()`, which are available in all current browsers. In older browsers without support, the highlight gradient is dropped and the text can render transparent. If you target older browsers, apply `shimmer` conditionally with a `supports-*` variant:

```tsx
<p className="supports-[color:oklch(from_white_l_c_h)]:shimmer">
  Generating response&hellip;
</p>
```

## Reduced Motion

When the user prefers reduced motion, the animation is disabled automatically and the text renders normally. There is nothing to configure.

## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl).

The sweep follows the reading direction, left to right in LTR and right to left in RTL, with no extra classes. Use `shimmer-reverse` to flip the direction manually.

<ComponentPreview styleName="base-rhea" name="shimmer-rtl" />
