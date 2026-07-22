---
title: Typeset
description: A styling system for HTML and rendered markdown, from blog posts to streaming chat. One CSS file you own.
---

You render markdown and get back plain unstyled HTML: headings, paragraphs, lists, and tables. So you style the elements one by one: font sizes, line heights, spacing.

You do it for your blog. Then you do it again for the docs. Then again for the chat app. Every time you're fighting the same thing: sizing and spacing.

To fix this, we created **shadcn/typeset**. It's one CSS file that styles everything inside a `typeset` container. The file lives in your project, so you can change it directly when you need to.

A typeset is just a small preset class. You can have multiple typesets in your app, for different contexts.

```css
.typeset-docs {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-geist);
  --typeset-font-mono: var(--font-geist-mono);
  --typeset-size: 15px;
  --typeset-leading: 1.75;
  --typeset-flow: 1.25em;
}
```

<Button asChild className="mt-6" size="sm">
  <Link href="/typeset">Build your typeset</Link>
</Button>

---

## Principles

We read a lot about type: scale ratios, tracking, kerning, optical sizing, measure, leading, the space above and below every element. We tried exposing all of it, and it was too much. Nobody wants to set a dozen variables to make markdown look right.

So we sat down and condensed everything into three controls: size, leading, and flow. Everything else, heading sizes, list indents, the gap under a heading, the space around a rule, derives from them. Three controls. We called it rhythm.

---

## Features

- **It fits its container.** Put it in a chat bubble and it follows the smaller type around it. Put it in an article and it scales up with the page. On smaller screens, it gets a small bump for readability.
- **It uses your theme.** Colors, fonts, and radius come from your app. Dark mode follows the same tokens.
- **It's easy to tune.** Three values control the base size, line height, and space between blocks. Change them in a preset and the whole document follows.
- **It works well with streaming.** When a new block arrives, Typeset doesn't make earlier blocks switch margins, borders, or styles.

---

## Building Your Typeset

Create your typeset in the [typeset builder](/typeset). Pick your fonts and rhythm, then preview them on docs, chat, articles, and other real content.

The panel gives you the `typeset.css` file, the font setup for your framework, a preset class with your choices, and the wrapper to add around your content.

Copy `typeset.css` next to your main CSS file and import it after Tailwind:

```css
@import "tailwindcss";
@import "./typeset.css";
```

Then wrap your rendered markdown with `typeset` and your preset class:

```tsx
<div className="typeset typeset-docs">
  <YourMarkdownRenderer>{content}</YourMarkdownRenderer>
</div>
```

`typeset` turns the styles on. `typeset-docs` is the preset you created in the builder.

---

## Custom Typesets

The file includes defaults, so you can use `typeset` by itself. Most of the reading rhythm comes from three values:

```css
.typeset {
  --typeset-font-body: inherit;
  --typeset-font-heading: var(--font-heading);
  --typeset-font-mono: var(--font-mono);

  --typeset-size: 1em; /* body font-size */
  --typeset-leading: 1.75; /* line-height */
  --typeset-flow: 1.25em; /* space between blocks */
}
```

- **`--typeset-size`** sets the base text size. `1em` follows the surrounding layout. On smaller screens, Typeset bumps it up a little.
- **`--typeset-leading`** sets the space between lines.
- **`--typeset-flow`** sets the space between blocks. Headings and other elements derive their spacing from it.

The font variables tell Typeset which families to use. Leave them alone and it follows your app. Colors and radius come from your theme too.

Typeset doesn't set a maximum width. Your layout owns that. The Measure control in the builder adds a `max-width` to the wrapper instead of hiding it in the stylesheet.

You can keep more than one preset in the same app. Here is a tighter one for chat and a roomier one for docs:

```css
.typeset-chat {
  --typeset-flow: 1em;
  --typeset-leading: 1.6;
}

.typeset-docs {
  --typeset-size: 15px;
  --typeset-flow: 1.5em;
}
```

```tsx
<div className="typeset typeset-chat">{message}</div>
<article className="typeset typeset-docs">{page}</article>
```

For a one-off change, skip the preset and set a value on the container:

```tsx
<article className="typeset [--typeset-flow:1.75em]">...</article>
```

---

## Custom Themes

A preset can change the whole feel of the content, not just the spacing. You can give readers a serif reading mode, a compact UI mode, or any other style that fits your product.

```css
/* Reading: serif, larger type, roomy rhythm. */
.typeset-reading {
  --typeset-font-body: var(--font-lora);
  --typeset-font-heading: var(--font-lora);
  --typeset-size: 18px;
  --typeset-leading: 1.9;
  --typeset-flow: 2em;
}

/* Compact: sans, smaller type, tighter rhythm. */
.typeset-compact {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-geist);
  --typeset-size: 14px;
  --typeset-leading: 1.6;
  --typeset-flow: 1em;
}
```

---

## Accessibility and Dark Mode

For readers who prefer larger type and more space, create a roomier typeset and expose it as a setting:

```css
.typeset-large {
  --typeset-size: 16px;
  --typeset-leading: 2;
  --typeset-flow: 2em;
}
```

Dark mode already follows your theme colors. If the text feels a little tight on a dark surface, you can loosen the leading there:

```css
.dark .typeset {
  --typeset-leading: 1.9;
}
```

---

## Responsive Table

Tables stay real tables and wrap to fit. To scroll a wide one horizontally instead, wrap it in `typeset-scroll`:

```tsx
<div className="typeset-scroll">
  <table>...</table>
</div>
```

Do this in your renderer's table component or a small rehype plugin. It works for any wide block, not just tables.

---

## Overrides

Typeset lives in the `components` layer and uses `:where()` for its element selectors. Tailwind utilities on an element win without `!important`:

```tsx
<div className="typeset typeset-docs">
  <p className="text-lg">...</p>
</div>
```

Plain CSS can override Typeset with a normal selector too.

---

## Opting Out

To keep a component out of Typeset, add `not-typeset` or `data-not-typeset`:

```tsx
<div className="typeset">
  <p>Styled prose.</p>
  <Card className="not-typeset">Untouched component.</Card>
</div>
```

Both options cover the component and everything inside it. Another `typeset` container inside that subtree stays opted out too.

---

## Streaming

Typeset is written so that adding a new block does not change the styles of the blocks already on screen.

- No forward-looking selectors. `:last-child`, `:has()`, and `:empty` are left out of layout rules because their matches can change as content is added.
- Spacing flows in one direction, using `margin-block-start` only. A new block adds its own space.
- Table separators live on the cells being added, so a new row does not restyle the row above it.

Text that is still streaming can grow and wrap normally. Typeset just avoids restyling the blocks that came before it.

---

## Prior Art

The `prose` class from `@tailwindcss/typography` is excellent at what it was built for: adding beautiful typographic defaults to plain HTML, including content rendered from Markdown or a CMS.

Typeset takes a different approach with container-aware sizing, app theme tokens, presets for different contexts, and streaming stability. Here's where they differ:

|              | @tailwindcss/typography                      | Typeset                                          |
| ------------ | -------------------------------------------- | ------------------------------------------------ |
| Sizing       | Fixed `rem` scale, `prose-sm` to `prose-2xl` | Relative to the container, any size              |
| Dark mode    | `prose-invert`, a second palette             | Your tokens flip, nothing to add                 |
| Theming      | Prose color variables; scale baked in        | Your theme tokens, plus font and rhythm controls |
| Overrides    | `prose-a:`, `prose-headings:` modifier API   | Plain utilities and CSS win                      |
| Streaming    | No append-stability contract                 | Designed for stable appends                      |
| Distribution | npm plugin, generated CSS                    | One CSS file you own                             |

Typeset borrows the two best ideas from the plugin: the zero-specificity `:where()` guard pattern, and the escape-hatch class (`not-typeset`, in the spirit of `not-prose`).
