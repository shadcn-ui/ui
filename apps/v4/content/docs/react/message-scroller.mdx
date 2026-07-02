---
title: Message Scroller
description: Use the MessageScroller behavior directly from the @shadcn/react package with your own markup and styles.
---

`MessageScroller` ships as a headless primitive in the `@shadcn/react` package.
The package owns all of the scroll behavior, anchoring turns, following streamed
output, preserving the reader's place as history loads, and tracking visibility,
and renders no styles of its own.

The `message-scroller.tsx` component in the registry is a thin wrapper that adds
Tailwind classes on top. Use the package directly when you want full control over
the markup and styles, or when you are not using the registry.

For the behavior guide and live examples, see the
[Message Scroller](/docs/components/base/message-scroller) component.

## Installation

```bash
npm install @shadcn/react
```

## Usage

```tsx
import {
  MessageScroller,
  useMessageScroller,
} from "@shadcn/react/message-scroller"
```

The package exports a namespace object instead of flat components. The parts and
behavior are the same as the styled component, just unstyled.

```tsx
<MessageScroller.Provider>
  <MessageScroller.Root>
    <MessageScroller.Viewport>
      <MessageScroller.Content>
        {messages.map((message) => (
          <MessageScroller.Item
            key={message.id}
            messageId={message.id}
            scrollAnchor={message.role === "user"}
          >
            {/* your message UI */}
          </MessageScroller.Item>
        ))}
      </MessageScroller.Content>
    </MessageScroller.Viewport>
    <MessageScroller.Button />
  </MessageScroller.Root>
</MessageScroller.Provider>
```

## Parts

If you are coming from the styled component, the flat parts map to the namespace
object like this.

| Styled component          | Unstyled part              |
| ------------------------- | -------------------------- |
| `MessageScrollerProvider` | `MessageScroller.Provider` |
| `MessageScroller`         | `MessageScroller.Root`     |
| `MessageScrollerViewport` | `MessageScroller.Viewport` |
| `MessageScrollerContent`  | `MessageScroller.Content`  |
| `MessageScrollerItem`     | `MessageScroller.Item`     |
| `MessageScrollerButton`   | `MessageScroller.Button`   |

The hooks are imported the same way and behave identically, since they read from
`MessageScroller.Provider`.

```tsx
import {
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"
```

## Example

Here is a complete example that brings its own styles and wires the scroller to
the AI SDK.

```tsx showLineNumbers
"use client"

import { useChat } from "@ai-sdk/react"
import { MessageScroller } from "@shadcn/react/message-scroller"
import { DefaultChatTransport } from "ai"

import { ChatInput } from "@/components/chat-input"

export function Chat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  return (
    <div className="flex h-svh w-full flex-col">
      <MessageScroller.Provider>
        <MessageScroller.Root className="relative flex flex-1 flex-col overflow-hidden">
          <MessageScroller.Viewport className="flex flex-1 flex-col overflow-y-auto">
            <MessageScroller.Content className="flex flex-col gap-4 p-6 text-base">
              {messages.map((message, index) => (
                <MessageScroller.Item
                  key={message.id}
                  messageId={`message-${index}`}
                  scrollAnchor={message.role === "user"}
                >
                  <div className="rounded-lg bg-muted p-4">
                    {message.parts.map((part, i) =>
                      part.type === "text" ? (
                        <span key={i}>{part.text}</span>
                      ) : null
                    )}
                  </div>
                </MessageScroller.Item>
              ))}
            </MessageScroller.Content>
          </MessageScroller.Viewport>
          <MessageScroller.Button className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-background px-3 py-1 text-sm font-medium inert:opacity-0">
            Jump to latest
          </MessageScroller.Button>
        </MessageScroller.Root>
      </MessageScroller.Provider>
      <ChatInput onSend={sendMessage} disabled={status !== "ready"} />
    </div>
  )
}
```

## API Reference

### MessageScroller.Provider

The headless root. It owns scroll state and the behavior props, and provides
them to the parts and the hooks. It renders no DOM of its own.

| Prop                     | Type                                | Default | Description                                                                                                                                                                          |
| ------------------------ | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `autoScroll`             | `boolean`                           | `false` | Follow new content only while the reader is already at the live edge. Wheel, touch, keyboard scroll, and explicit jumps release it.                                                  |
| `defaultScrollPosition`  | `"start" \| "end" \| "last-anchor"` | `"end"` | Opening position on the first non-empty render, applied once. `"last-anchor"` opens at the last `scrollAnchor` row and falls back to `"end"` when the turn fits or no anchor exists. |
| `scrollEdgeThreshold`    | `number`                            | `8`     | Distance from either edge that still counts as being at the start or end. Controls state attributes and scroll button visibility.                                                    |
| `scrollMargin`           | `number`                            | `0`     | Margin applied to the aligned edge for `scrollToMessage`, visibility, and programmatic targets.                                                                                      |
| `scrollPreviousItemPeek` | `number`                            | `64`    | Extra margin added to `scrollMargin` when a newly appended `scrollAnchor` item is positioned so part of the previous item stays visible.                                             |

### MessageScroller.Root

The frame and layout container. It fills its parent, so use it inside a
height-constrained layout, within a `MessageScroller.Provider`.

| Prop       | Type                          | Default | Description                        |
| ---------- | ----------------------------- | ------- | ---------------------------------- |
| `...props` | `React.ComponentProps<"div">` | -       | Props spread to the frame element. |

The root mirrors the scroll-state attributes below (the viewport carries them
too), so you can style the container by scroll state, such as edge fades on the
frame.

| Data attribute       | Value                                             | Description                                                                                            |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data-scrollable`    | `"start"` \| `"end"` \| `"start end"` \| _absent_ | Edges the viewport can scroll toward. Query one with `[data-scrollable~="end"]`; absent means it fits. |
| `data-autoscrolling` | present                                           | Present while the viewport is programmatically scrolling to the latest message.                        |

### MessageScroller.Viewport

The scrollable viewport.

| Prop                      | Type                          | Default      | Description                                                               |
| ------------------------- | ----------------------------- | ------------ | ------------------------------------------------------------------------- |
| `preserveScrollOnPrepend` | `boolean`                     | `true`       | Keep the first visible message item stable when older rows are prepended. |
| `role`                    | `string`                      | `"region"`   | Landmark role for the labelled scrollable transcript viewport.            |
| `aria-label`              | `string`                      | `"Messages"` | Accessible name for the scrollable chat transcript.                       |
| `tabIndex`                | `number`                      | `0`          | Makes the transcript viewport keyboard-scrollable.                        |
| `...props`                | `React.ComponentProps<"div">` | -            | Props spread to the viewport element.                                     |

| Data attribute       | Value                                             | Description                                                                                            |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data-scrollable`    | `"start"` \| `"end"` \| `"start end"` \| _absent_ | Edges the viewport can scroll toward. Query one with `[data-scrollable~="end"]`; absent means it fits. |
| `data-autoscrolling` | present                                           | Present while the viewport is programmatically scrolling to the latest message.                        |

### MessageScroller.Content

The transcript content element. Every direct child should be a
`MessageScroller.Item`.

| Prop              | Type                          | Default       | Description                                                             |
| ----------------- | ----------------------------- | ------------- | ----------------------------------------------------------------------- |
| `role`            | `string`                      | `"log"`       | ARIA role applied to the message list for live announcements.           |
| `aria-relevant`   | `string`                      | `"additions"` | Live-region updates to announce. Defaults to new transcript rows only.  |
| `aria-busy`       | `boolean`                     | -             | Marks the live region busy while a turn streams, if needed.             |
| `spacerClassName` | `string`                      | -             | Class name for the internal spacer used to make room for anchored rows. |
| `...props`        | `React.ComponentProps<"div">` | -             | Props spread to the content element.                                    |

### MessageScroller.Item

One transcript row: a message, marker, typing row, separator, or load-more row.

| Prop           | Type                          | Default | Description                                                                    |
| -------------- | ----------------------------- | ------- | ------------------------------------------------------------------------------ |
| `messageId`    | `string`                      | -       | Stable row id used by `scrollToMessage`, visibility, and prepend preservation. |
| `scrollAnchor` | `boolean`                     | `false` | Marks this row as a turn boundary that can anchor newly appended turns.        |
| `...props`     | `React.ComponentProps<"div">` | -       | Props spread to the item element.                                              |

| Data attribute       | Value                 | Description                        |
| -------------------- | --------------------- | ---------------------------------- |
| `data-message-id`    | `string`              | Mirrors `messageId` when provided. |
| `data-scroll-anchor` | `"true"` \| `"false"` | Mirrors `scrollAnchor`.            |

### MessageScroller.Button

A button that scrolls to the start or end of the transcript. It is inert and
removed from the tab order when there is nothing to scroll toward.

| Prop        | Type                                    | Default    | Description                                                              |
| ----------- | --------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| `behavior`  | `ScrollBehavior`                        | `"smooth"` | Native scroll behavior used when the button scrolls to its target edge.  |
| `direction` | `"start" \| "end"`                      | `"end"`    | Transcript edge the button scrolls toward.                               |
| `children`  | `React.ReactNode`                       | -          | Custom button content. Defaults to the scroll icon and accessible label. |
| `render`    | `React.ReactElement \| render function` | -          | Custom render target.                                                    |
| `...props`  | `React.ComponentProps<"button">`        | -          | Props spread to the button.                                              |

| Data attribute   | Value                 | Description                               |
| ---------------- | --------------------- | ----------------------------------------- |
| `data-direction` | `"start"` \| `"end"`  | Mirrors `direction`.                      |
| `data-active`    | `"true"` \| `"false"` | Whether this button can currently scroll. |

### useMessageScroller

Imperative transcript controls.

| Method            | Type                                       | Description                     |
| ----------------- | ------------------------------------------ | ------------------------------- |
| `scrollToMessage` | `(messageId: string, options?) => boolean` | Scroll to a mounted message id. |
| `scrollToEnd`     | `(options?) => boolean`                    | Scroll to the latest message.   |
| `scrollToStart`   | `(options?) => boolean`                    | Scroll to the top.              |

All commands return `false` when the command could not be applied.
`scrollToStart` and `scrollToEnd` return `false` only when the viewport is not
mounted yet. `scrollToMessage` returns `false` when the target is not mounted and
cannot be queued.

Command options:

| Option         | Type                                              | Default                 | Description                                          |
| -------------- | ------------------------------------------------- | ----------------------- | ---------------------------------------------------- |
| `align`        | `"start"` \| `"center"` \| `"end"` \| `"nearest"` | `"start"`               | How a message target aligns in the viewport.         |
| `behavior`     | `ScrollBehavior`                                  | `"auto"`                | Native scroll behavior for the command.              |
| `scrollMargin` | `number`                                          | provider `scrollMargin` | Margin applied to the aligned edge for this command. |

### useMessageScrollerScrollable

Which edges the viewport can scroll toward, for sibling UI that needs the values
in JavaScript. Prefer the `data-scrollable` attribute for styling the scroller
itself.

| Value   | Type      | Description                                                                                            |
| ------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `start` | `boolean` | Whether the viewport can scroll toward the start. Content is hidden above (`!start` means at the top). |
| `end`   | `boolean` | Whether the viewport can scroll toward the end. Content is hidden below (`!end` means at the bottom).  |

### useMessageScrollerVisibility

Visibility state for outline, search, and active-turn UI. It subscribes
separately from `useMessageScrollerScrollable`, so visibility work is only paid for
when a consumer needs it.

| Value               | Type             | Description                                                                                    |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| `currentAnchorId`   | `string \| null` | The current anchored turn, based on the last `scrollAnchor` item at or above the reading line. |
| `visibleMessageIds` | `string[]`       | Message ids intersecting the viewport, in document order.                                      |

Filter `visibleMessageIds` in your app when you need a narrower outline, such as
user messages, anchored turns, or search hits.
