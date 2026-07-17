---
title: Bubble
description: Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.
base: aria
component: true
---

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-demo"
  previewClassName="h-auto theme-blue"
/>

The `Bubble` component displays framed conversational content. Use it for chat text, short structured output, quoted replies, suggestions, and reactions.

For full-featured chat interfaces, use the [`Message`](/docs/components/aria/message) component. `Bubble` is intentionally scoped to the bubble surface. Place avatars, names, timestamps, metadata, and message-level actions in [`Message`](/docs/components/aria/message).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add bubble
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="bubble"
  title="components/ui/bubble.tsx"
  styleName="aria-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
```

```tsx showLineNumbers
<Bubble>
  <BubbleContent>
    I checked the registry output and removed the stale route.
  </BubbleContent>
  <BubbleReactions>
    <span>👍</span>
  </BubbleReactions>
</Bubble>
```

## Composition

Use the following composition to build a bubble:

```text
Bubble
├── BubbleContent
└── BubbleReactions
```

Use `BubbleGroup` to group consecutive bubbles from the same sender:

```text
BubbleGroup
├── Bubble
│   └── BubbleContent
└── Bubble
    └── BubbleContent
```

## Features

- Seven visual variants, from a strong primary bubble to unframed ghost content
- Start and end alignment for sender and receiver bubbles
- Reactions that anchor to the bubble edge with configurable side and alignment
- Bubbles size to their content, up to 80% of the container width
- Polymorphic content via `render` for link and button bubbles
- Customizable styling through the `className` prop on every part

## Variants

Use `variant` to change the visual treatment of the bubble.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-variants"
  previewClassName="h-auto theme-blue"
/>

| Variant       | Description                                            |
| ------------- | ------------------------------------------------------ |
| `default`     | A strong primary bubble, usually for the current user. |
| `secondary`   | The standard neutral bubble for conversation content.  |
| `muted`       | A lower-emphasis bubble for quiet supporting content.  |
| `tinted`      | A subtle primary-tinted bubble.                        |
| `outline`     | A bordered bubble for secondary or rich content.       |
| `ghost`       | Unframed content for assistant text or rich content.   |
| `destructive` | A destructive bubble for error or failed actions.      |

A bubble sizes to its content, up to 80% of the container width. The `ghost` variant removes the max-width so assistant text and rich content can span the full row.

## Alignment

Use `align` on `Bubble` to align the bubble to the start or end of the conversation.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-alignment"
  previewClassName="h-auto theme-blue"
/>

| align   | Description                                        |
| ------- | -------------------------------------------------- |
| `start` | Align the bubble to the start of the conversation. |
| `end`   | Align the bubble to the end of the conversation.   |

**Note:** When building chat interfaces, you probably want to use alignment on the `Message` component itself, not the `Bubble` component. You can use the `role` prop on the `Message` component to automatically align the bubble to the start or end of the conversation.

## Bubble Group

Use `BubbleGroup` to group consecutive bubbles from the same sender. Note the `align` prop should be set on the `Bubble` component itself, not the `BubbleGroup` component.

```text
BubbleGroup
├── Bubble
│   └── BubbleContent
└── Bubble
    └── BubbleContent
```

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-group-demo"
  previewClassName="h-auto theme-blue"
/>

## Links and Buttons

You can turn a bubble into a link or button by using the `render` prop on `BubbleContent`.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-link-button"
  previewClassName="h-auto theme-blue"
/>

```tsx showLineNumbers
import { Bubble, BubbleContent } from "@/components/ui/bubble"

export function BubbleLinkDemo() {
  return (
    <Bubble variant="muted">
      <BubbleContent render={(props) => <button {...props} type="button" />}>
        Click here
      </BubbleContent>
    </Bubble>
  )
}
```

## Reactions

Use `BubbleReactions` for bubble reactions. You can use it to display reactions or quick action buttons. Use `side` and `align` to position the row — `side="top"` anchors it to the upper edge. Reactions overlap the bubble edge, so leave vertical space between rows — the examples below use a larger `gap` for this reason.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-reactions"
  previewClassName="h-auto theme-blue"
/>

## Show More / Collapsible

Long bubble content can be composed with [`Collapsible`](/docs/components/aria/collapsible) to allow for a show more or show less interaction. Use the `CollapsibleTrigger` component to trigger the collapsible content.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-collapsible"
  previewClassName="h-auto theme-blue"
/>

## Tooltip

Wrap a bubble in a [`Tooltip`](/docs/components/aria/tooltip) to reveal metadata on hover, such as when a message was read.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-tooltip"
  previewClassName="h-auto theme-blue"
/>

## Popover

Pair a bubble with a [`Popover`](/docs/components/aria/popover) to surface more information on demand, such as the full error message for a failed action.

<ComponentPreview
  styleName="aria-rhea"
  name="bubble-popover"
  previewClassName="h-auto theme-blue"
/>

## Accessibility

`Bubble` renders the presentational message surface. Keep conversation-level semantics on the surrounding container and follow the guidelines below.

### Labeling Reactions

Reactions render as a row of emoji. A screen reader reads each glyph with no context, and counters like `+8` are announced as "plus eight". Group the row as a single image with a descriptive `aria-label` so it announces once. `role="img"` also hides the individual emoji from assistive tech, so no `aria-hidden` is needed.

```tsx showLineNumbers
<BubbleReactions role="img" aria-label="Reactions: thumbs up, fire, and 8 more">
  <span>👍</span>
  <span>🔥</span>
  <span>+8</span>
</BubbleReactions>
```

When reactions are interactive, render buttons instead and give icon-only buttons an `aria-label`.

```tsx showLineNumbers
<BubbleReactions>
  <Button aria-label="Thumbs up" variant="secondary" size="icon-xs">
    <ThumbsUpIcon />
  </Button>
</BubbleReactions>
```

### Interactive Bubbles

When a bubble is clickable, render it as a real `<button>` or `<a>` with the `render` prop so it is focusable and exposes the correct role. `BubbleContent` ships a visible focus ring for interactive elements, and the accessible name comes from the bubble text. No extra label is needed.

```tsx showLineNumbers
<Bubble variant="muted" align="end">
  <BubbleContent
    render={(props) => <button {...props} type="button" onClick={onReply} />}
  >
    I forgot my password
  </BubbleContent>
</Bubble>
```

### Meaning Beyond Color

Bubble variants signal role and tone with color. Pair them with text, alignment, or icons so meaning is not conveyed by color alone. For a `destructive` bubble, keep the error context in the message text rather than relying on the color treatment.

## API Reference

### Bubble

The root bubble wrapper.

| Prop        | Type                                                                                       | Default     | Description                                      |
| ----------- | ------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------ |
| `variant`   | `"default" \| "secondary" \| "muted" \| "tinted" \| "outline" \| "ghost" \| "destructive"` | `"default"` | The bubble visual treatment.                     |
| `align`     | `"start" \| "end"`                                                                         | `"start"`   | The inline alignment of the bubble.              |
| `className` | `string`                                                                                   | -           | Additional classes to apply to the root element. |

### BubbleContent

The bubble content wrapper.

| Prop        | Type                       | Default | Description                                               |
| ----------- | -------------------------- | ------- | --------------------------------------------------------- |
| `render`    | `ReactElement \| function` | -       | Render the content as a different element such as a link. |
| `className` | `string`                   | -       | Additional classes to apply to the content element.       |

### BubbleReactions

Displays overlapped reactions for a bubble.

| Prop        | Type                | Default    | Description                                      |
| ----------- | ------------------- | ---------- | ------------------------------------------------ |
| `side`      | `"top" \| "bottom"` | `"bottom"` | The side of the bubble to anchor the reactions.  |
| `align`     | `"start" \| "end"`  | `"end"`    | The inline alignment of the reactions.           |
| `className` | `string`            | -          | Additional classes to apply to the reaction row. |

### BubbleGroup

Groups consecutive bubbles from the same sender.

| Prop        | Type     | Default | Description                                    |
| ----------- | -------- | ------- | ---------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the group root. |
