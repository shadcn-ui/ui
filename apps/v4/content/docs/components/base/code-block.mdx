---
title: Code Block
description: Displays code, terminal output and diffs with an optional header, line numbers and a copy button.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="code-block-demo"
  previewClassName="h-auto"
/>

`CodeBlock` displays code, terminal output, logs and diffs. It has a header with a title and actions, line numbers, wrapping, diff and highlighted lines, and a small size for tool output in a [Trace](/docs/components/base/trace).

Syntax highlighting is optional and lives in a separate hook, so a block that only shows plain output stays small.

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add code-block
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install shiki
```

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="code-block"
  title="components/ui/code-block.tsx"
  styleName="base-rhea"
/>

<ComponentSource
  src="/registry/bases/base/hooks/use-highlighted-code.ts"
  title="hooks/use-highlighted-code.ts"
  styleName="base-rhea"
/>

<ComponentSource
  src="/registry/bases/base/lib/highlighter.tsx"
  title="lib/highlighter.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

`code-block` also installs `useHighlightedCode` for [syntax highlighting](#syntax-highlighting).

## Usage

```tsx showLineNumbers
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
```

```tsx showLineNumbers
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>Terminal</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={output} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent>{output}</CodeBlockContent>
</CodeBlock>
```

## Composition

```text
CodeBlock
├── CodeBlockHeader
│   ├── CodeBlockTitle
│   └── CodeBlockActions
│       └── CodeBlockCopyButton
├── CodeBlockActions (floating, when there is no header)
├── CodeBlockContent
│   └── CodeBlockLine
└── CodeBlockFooter
```

`CodeBlockContent` takes a string or a list of `CodeBlockLine`. Use lines when you need line variants or highlighted tokens.

## Features

- **It streams cheaply.** A string child renders as one text node, and the highlighter tokenizes only the new lines as code arrives.
- **It copies cleanly.** Line numbers and diff markers are left out of a selection, and blank lines survive the copy.
- **It reads left to right.** The content is always `dir="ltr"`. The header follows the page direction.
- **It highlights without WASM.** `useHighlightedCode` uses Shiki's JavaScript engine, loads each language on first use and renders ANSI colors in terminal output. On the server, `highlightCode` keeps Shiki out of the client bundle.
- **It fits where code shows up.** Use it in a message, a Markdown fence, a Trace line, Tabs, a Dialog or a `typeset` container.
- **It scrolls by keyboard.** The content is focusable, and floating actions show on focus as well as on hover.

## Basic

Pass a string to `CodeBlockContent`. It renders as one text node, so it stays cheap while output streams.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-basic"
  previewClassName="h-auto"
/>

## Header

`CodeBlockHeader` holds a `CodeBlockTitle` and `CodeBlockActions`. `CodeBlockCopyButton` copies its `value`.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-header"
  previewClassName="h-auto"
/>

A long title truncates. To link the title to a file, wrap `CodeBlockTitle` in an anchor.

```tsx showLineNumbers
<CodeBlockHeader>
  <a href="/files/route.ts">
    <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
  </a>
</CodeBlockHeader>
```

## Actions

`CodeBlockActions` holds any number of buttons. For a wrap toggle, keep the state yourself and pass it to `wrap`.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-actions"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
const [wrap, setWrap] = React.useState(false)

<CodeBlockActions>
  <Button
    variant="ghost"
    size="icon-xs"
    aria-label="Wrap lines"
    aria-pressed={wrap}
    onClick={() => setWrap(!wrap)}
  >
    <WrapTextIcon />
  </Button>
  <CodeBlockCopyButton value={output} />
</CodeBlockActions>
<CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
```

## Floating Actions

Without a header, put `CodeBlockActions` directly inside `CodeBlock`. The actions float at the top end and stay hidden until the block is hovered or focused. They always show on touch screens.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-floating-actions"
  previewClassName="h-auto"
/>

## Line Numbers

Add `lineNumbers` to `CodeBlockContent`. A string child is split into lines, and the numbers are not copied with a selection.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-line-numbers"
  previewClassName="h-auto"
/>

## Start Line

Set `startLine` to number lines from a given line, for a snippet from the middle of a file. The gutter grows to fit the widest number.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-start-line"
  previewClassName="h-auto"
/>

## Wrap

Long lines scroll by default. Add `wrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, see [Actions](#actions).

<ComponentPreview
  styleName="base-rhea"
  name="code-block-wrap"
  previewClassName="h-auto"
/>

## Highlighted Lines

Render each line as a `CodeBlockLine` and set `variant="highlighted"` on the lines to call out.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-highlighted-lines"
  previewClassName="h-auto"
/>

## Diff

Set `variant="added"` or `variant="removed"` on a `CodeBlockLine`. Each one adds a `+` or `−` marker.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-diff"
  previewClassName="h-auto"
/>

## Height

Cap the height with a `max-h-*` class on `CodeBlockContent`. The content scrolls inside the block.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-height"
  previewClassName="h-auto"
/>

`CodeBlockContent` fades its edges with [`scroll-fade`](/docs/utils/scroll-fade) as it scrolls: left and right by default, top and bottom when it wraps. Add `scroll-fade-y` to a capped block that does not wrap.

## Show More

`CodeBlockFooter` is a slot below the content. For Show More, cap the content while it is collapsed and put a ghost `xs` `Button` in the footer.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-show-more"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
const [expanded, setExpanded] = React.useState(false)
const id = React.useId()

<CodeBlockContent
  id={id}
  className={expanded ? undefined : "max-h-64 overflow-y-hidden scroll-fade-y"}
>
  {code}
</CodeBlockContent>
<CodeBlockFooter className="justify-center">
  <Button
    variant="ghost"
    size="xs"
    aria-expanded={expanded}
    aria-controls={id}
    onClick={() => setExpanded(!expanded)}
  >
    {expanded ? "Show less" : "Show more"}
  </Button>
</CodeBlockFooter>
```

### Max Height

To keep a long block from taking over the page, raise the cap instead of removing it. The expanded content scrolls, and the edges fade as you scroll.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-show-more-scroll"
  previewClassName="h-auto"
/>

## Size

Use `size="sm"` for tool and [Trace](#trace) output. It has tighter padding and `text-xs` text.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-size"
  previewClassName="h-auto"
/>

## Destructive

Use `variant="destructive"` for errors and failed output.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-destructive"
  previewClassName="h-auto"
/>

## Trace

Put a `CodeBlock` with `size="sm"` in `TraceCollapsibleContent` for tool and terminal output. Add `wrap` and a `max-h-64` class to `CodeBlockContent` so long output wraps and scrolls inside the trace. The block sets its own text color, so `TraceCollapsibleContent` does not mute it.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-trace"
  previewClassName="h-auto"
/>

## Tabs

Show several files with [Tabs](/docs/components/base/tabs), one `CodeBlock` in each `TabsContent`.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-tabs"
  previewClassName="h-auto"
/>

## Message

Put a `CodeBlock` between paragraphs inside a [Message](/docs/components/base/message).

<ComponentPreview
  styleName="base-rhea"
  name="code-block-chat"
  previewClassName="h-auto"
/>

## Typeset

A `CodeBlock` inside a [`typeset`](/docs/typeset) container keeps its own styles and gets the same space above as a paragraph.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-typeset"
  previewClassName="h-auto"
/>

## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl). Code always reads left to right. The header follows the page direction.

<ComponentPreview styleName="base-nova" name="code-block-rtl" direction="rtl" />

## Syntax Highlighting

`useHighlightedCode` highlights with [Shiki](https://shiki.style) and returns one React node per line for `CodeBlockLine`.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-highlighting"
  previewClassName="h-auto"
/>

```tsx showLineNumbers
const lines = useHighlightedCode(code, "json")

<CodeBlock>
  <CodeBlockContent>
    {lines.map((line, index) => (
      <CodeBlockLine key={index}>{line}</CodeBlockLine>
    ))}
  </CodeBlockContent>
</CodeBlock>
```

Shiki uses its JavaScript regex engine, so there is no WASM to load.

### Languages

Each language loads the first time it is used. Edit the list in `lib/highlighter.tsx`. A language that is not in the list renders as plain text.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-languages"
  previewClassName="h-auto"
/>

The list ships with `bash`, `css`, `diff`, `html`, `javascript`, `json`, `jsx`, `markdown`, `python`, `sql`, `tsx`, `typescript` and `yaml`, plus aliases such as `ts`, `js`, `sh` and `yml`.

### Terminal Output

Pass `"ansi"` as the language to render the colors in terminal output. Without it, escape codes show as text.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-ansi"
  previewClassName="h-auto"
/>

ANSI colors do not carry from one line to the next.

### Server Rendering

`highlightCode` is async and works in a Server Component, so Shiki stays out of the client bundle.

```tsx showLineNumbers
import { highlightCode } from "@/lib/highlighter"

export async function ServerCode({ code }: { code: string }) {
  const lines = (await highlightCode(code, "tsx")) ?? code.split("\n")

  return (
    <CodeBlock>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
```

### Streaming

While the code streams, the hook tokenizes only the new lines, starting where the last line left off. Lines that did not change keep the same nodes, so React skips them.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-streaming"
  previewClassName="h-auto"
/>

### Markdown

Render the message with [Streamdown](https://streamdown.ai) and route fenced code to a `CodeBlock` with `components.code`. Streamdown sets `data-block` on fenced code only, so inline code stays inline.

<ComponentPreview
  styleName="base-rhea"
  name="code-block-markdown"
  previewClassName="h-auto"
/>

`useIsCodeFenceIncomplete` returns `true` until the closing fence arrives. Use it to disable the copy button while the code is incomplete. It only works when Streamdown gets `isAnimating`, so pass `isAnimating` while the message streams.

```tsx showLineNumbers
<Streamdown components={{ code: MarkdownCode }} isAnimating={isStreaming}>
  {text}
</Streamdown>
```

## Accessibility

- `CodeBlockContent` is a `pre` with a `code` element and always sets `dir="ltr"`, so code reads left to right on an RTL page.
- `CodeBlockContent` has `tabIndex={0}`, so keyboard users can focus it and scroll it. Pass `tabIndex={-1}` to remove the tab stop.
- Floating actions show when focus is inside the block, not only on hover, so keyboard users can reach them.
- Line numbers are hidden from screen readers.
- Diff lines carry a `+` or `−` marker as well as a tint, so the change does not rely on color.
- `CodeBlockCopyButton` is labelled "Copy", and a polite live region announces "Copied" after a successful copy.
- Give a wrap toggle `aria-pressed` so its state is announced.
- Give a Show More button `aria-expanded` and point `aria-controls` at the `id` of `CodeBlockContent`.

## API Reference

### CodeBlock

The surface that holds the header, the content and the footer.

| Prop        | Type                         | Default     | Description                                                     |
| ----------- | ---------------------------- | ----------- | --------------------------------------------------------------- |
| `variant`   | `"default" \| "destructive"` | `"default"` | The tone of the block.                                          |
| `size`      | `"default" \| "sm"`          | `"default"` | `"sm"` has tighter padding and `text-xs` code, for tool output. |
| `className` | `string`                     | -           | Additional classes to apply to the block.                       |

### CodeBlockHeader

A row above the content for a title and actions.

| Prop        | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `className` | `string` | -       | Additional classes to apply to the header. |

### CodeBlockTitle

A filename or a label, with an optional icon. It truncates.

| Prop        | Type     | Default | Description                               |
| ----------- | -------- | ------- | ----------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the title. |

### CodeBlockActions

Holds buttons at the end of the header. As a direct child of `CodeBlock`, it floats.

| Prop        | Type     | Default | Description                                 |
| ----------- | -------- | ------- | ------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the actions. |

### CodeBlockCopyButton

A ghost icon button that copies `value` to the clipboard. It accepts the props of [`Button`](/docs/components/base/button).

| Prop        | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `value`     | `string` | -       | Required. The text to copy.                |
| `className` | `string` | -       | Additional classes to apply to the button. |

### CodeBlockContent

The `pre` that scrolls or wraps.

| Prop          | Type              | Default | Description                                                     |
| ------------- | ----------------- | ------- | --------------------------------------------------------------- |
| `children`    | `React.ReactNode` | -       | A string, or a list of `CodeBlockLine`.                         |
| `wrap`        | `boolean`         | `false` | Wrap long lines instead of scrolling.                           |
| `lineNumbers` | `boolean`         | `false` | Number each line. A string child is split into lines.           |
| `startLine`   | `number`          | `1`     | The number of the first line, when `lineNumbers` is set.        |
| `tabIndex`    | `number`          | `0`     | Makes the content focusable so it can be scrolled by keyboard.  |
| `className`   | `string`          | -       | Additional classes to apply to the content, such as `max-h-72`. |

### CodeBlockLine

One line of code.

| Prop        | Type                                                 | Default     | Description                              |
| ----------- | ---------------------------------------------------- | ----------- | ---------------------------------------- |
| `variant`   | `"default" \| "added" \| "removed" \| "highlighted"` | `"default"` | The state of the line.                   |
| `className` | `string`                                             | -           | Additional classes to apply to the line. |

### CodeBlockFooter

A row below the content, such as for a Show More button.

| Prop        | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `className` | `string` | -       | Additional classes to apply to the footer. |

### useHighlightedCode

```tsx
const lines = useHighlightedCode(code, language)
```

Returns one React node per line. It returns plain lines until the first pass finishes, and for a language that is not in the list.

| Argument   | Type     | Description                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| `code`     | `string` | The code to highlight. A trailing newline is ignored.        |
| `language` | `string` | A language or alias from `lib/highlighter.tsx`, or `"ansi"`. |
