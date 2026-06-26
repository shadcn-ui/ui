# MessageScroller

Headless scroll container for chat transcripts. Owns scroll position, anchoring,
auto-follow, and visibility tracking so message components can stay presentational.

## Usage

```tsx
import {
  MessageScroller,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"

;<MessageScroller.Provider autoScroll>
  <MessageScroller.Root>
    <MessageScroller.Viewport>
      <MessageScroller.Content>
        <MessageScroller.Item messageId="m1" scrollAnchor>
          …
        </MessageScroller.Item>
      </MessageScroller.Content>
    </MessageScroller.Viewport>
    <MessageScroller.Button />
  </MessageScroller.Root>
</MessageScroller.Provider>
```

## Exports

All from `@shadcn/react/message-scroller`.

### Parts

| Part                       | Role                                                                       | Notable props                                                                                          |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `MessageScroller.Provider` | Headless root; owns scroll state, anchoring, auto-follow, and visibility   | `autoScroll`, `defaultScrollPosition`, `scrollPreviousItemPeek`, `scrollMargin`, `scrollEdgeThreshold` |
| `MessageScroller.Root`     | Styled frame; lays out the viewport, content, and controls in the provider | —                                                                                                      |
| `MessageScroller.Viewport` | Scrollable frame                                                           | `preserveScrollOnPrepend`                                                                              |
| `MessageScroller.Content`  | Message list; defaults `role="log"` + `aria-relevant="additions"`          | —                                                                                                      |
| `MessageScroller.Item`     | One message wrapper                                                        | `messageId`, `scrollAnchor`                                                                            |
| `MessageScroller.Button`   | Scroll-to-end/start affordance; auto-hides when caught up                  | `direction`                                                                                            |

### Hooks (flat siblings)

| Hook                             | Returns                                                                     |
| -------------------------------- | --------------------------------------------------------------------------- |
| `useMessageScroller()`           | `{ scrollToMessage, scrollToStart, scrollToEnd }`                           |
| `useMessageScrollerScrollable()` | `MessageScrollerScrollable` — `{ start, end }`, the edges the viewport can scroll toward |
| `useMessageScrollerVisibility()` | `MessageScrollerVisibilityState` — `currentAnchorId`, `visibleMessageIds`   |

### Types

| Type                                   | Meaning                                                               |
| -------------------------------------- | --------------------------------------------------------------------- |
| `MessageScrollerScrollable`            | result of `useMessageScrollerScrollable()`                            |
| `MessageScrollerVisibilityState`       | result of `useMessageScrollerVisibility()`                            |
| `MessageScrollerScrollOptions`         | options for the scroll commands (`align`, `behavior`, `scrollMargin`) |
| `MessageScrollerScrollAlign`           | `"start" \| "center" \| "end" \| "nearest"`                           |
| `MessageScrollerDefaultScrollPosition` | `"start" \| "end" \| "last-anchor"`                                   |

## Tests

| File                                     | Environment | Covers                                                                     |
| ---------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `geometry.test.ts`                       | jsdom       | Geometry math with stubbed rects.                                          |
| `message-scroller.browser.test.tsx`      | chromium    | Behavior jsdom can't model (native scroll anchoring, prepend, visibility). |
| `message-scroller.perf.browser.test.tsx` | chromium    | Performance benchmark + regression guard.                                  |

```bash
pnpm test            # unit (jsdom)
pnpm test:browser    # behavior + performance (chromium)
```
