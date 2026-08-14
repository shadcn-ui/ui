import * as React from "react"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"

import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "."

const MessageScrollerProvider = MessageScrollerPrimitive.Provider
const MessageScroller = MessageScrollerPrimitive.Root
const MessageScrollerViewport = MessageScrollerPrimitive.Viewport
const MessageScrollerContent = MessageScrollerPrimitive.Content
const MessageScrollerItem = MessageScrollerPrimitive.Item
const MessageScrollerButton = MessageScrollerPrimitive.Button

// Real-browser regression for the prepend double-compensation bug. In Chromium
// native scroll anchoring shifts scrollTop on prepend; the component's restore
// must NOT compensate again. This is invisible to jsdom: with no native
// anchoring there, the viewport-relative and content-relative measurements
// produce the same number, so the bug and the fix look identical. Only a real
// engine with scroll anchoring can tell them apart.

// This component is driven by the event loop — requestAnimationFrame,
// ResizeObserver, IntersectionObserver — none of which act() can wrap. The suite
// flushes renders synchronously with flushSync and settles the async scroll work
// on real frames via settle(), so it runs OUTSIDE the act environment that
// vitest.browser.setup.ts enables globally (vitest isolates files, so other
// suites keep it on). Without this, the rAF-driven visibility subscriber logs
// spurious "not wrapped in act" warnings even though the assertions, which read
// only after settle(), are correct.

;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = false

const ITEM_HEIGHT = 80
const VIEWPORT_HEIGHT = 200

type TestItem = {
  height?: number
  id: string
  scrollAnchor?: boolean
}

let root: Root | null = null
let container: HTMLDivElement | null = null

afterEach(() => {
  root?.unmount()
  container?.remove()
  root = null
  container = null
})

function Thread({
  autoScroll,
  defaultScrollPosition,
  items,
  scrollPreviousItemPeek,
  showButton = false,
  showJumpButton = false,
  showVisibility = false,
}: {
  autoScroll?: boolean
  defaultScrollPosition?: React.ComponentProps<
    typeof MessageScrollerProvider
  >["defaultScrollPosition"]
  items: TestItem[]
  scrollPreviousItemPeek?: number
  showButton?: boolean
  showJumpButton?: boolean
  showVisibility?: boolean
}) {
  return (
    <MessageScrollerProvider
      autoScroll={autoScroll}
      defaultScrollPosition={defaultScrollPosition}
      scrollPreviousItemPeek={scrollPreviousItemPeek}
    >
      <MessageScroller>
        <MessageScrollerViewport
          aria-label="viewport"
          style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
        >
          <MessageScrollerContent
            style={{ display: "flex", flexDirection: "column" }}
          >
            {items.map((item) => (
              <MessageScrollerItem
                key={item.id}
                messageId={item.id}
                scrollAnchor={item.scrollAnchor}
                style={{
                  height: item.height ?? ITEM_HEIGHT,
                  flex: "none",
                }}
              >
                {item.id}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        {showButton ? (
          <MessageScrollerButton behavior="auto">
            Scroll to end
          </MessageScrollerButton>
        ) : null}
        {showJumpButton ? <JumpButton messageId="m5" /> : null}
        {showVisibility ? <VisibilityProbe /> : null}
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

function VisibilityProbe() {
  const { currentAnchorId, visibleMessageIds } = useMessageScrollerVisibility()

  return (
    <div
      data-testid="visibility"
      data-current-anchor={currentAnchorId ?? ""}
      data-visible={visibleMessageIds.join(",")}
    />
  )
}

const MemoMessageItem = React.memo(function MemoMessageItem({
  id,
  anchor,
}: {
  id: string
  anchor: boolean
}) {
  return (
    <MessageScrollerItem
      messageId={id}
      scrollAnchor={anchor}
      style={{ height: ITEM_HEIGHT, flex: "none" }}
    >
      {id}
    </MessageScrollerItem>
  )
})

function JumpButton({ messageId }: { messageId: string }) {
  const { scrollToMessage } = useMessageScroller()

  return (
    <button
      type="button"
      onClick={() => {
        scrollToMessage(messageId, { align: "start", behavior: "auto" })
      }}
    >
      Jump to message
    </button>
  )
}

// Resolve after a few real animation frames so the component's rAF-scheduled
// scroll work and the browser's native anchoring both settle.
function settle(frames = 4) {
  return new Promise<void>((resolve) => {
    let remaining = frames
    const tick = () =>
      remaining-- <= 0 ? resolve() : requestAnimationFrame(tick)
    requestAnimationFrame(tick)
  })
}

function viewportOffsetOf(messageId: string, viewport: HTMLElement) {
  const item = document.querySelector(
    `[data-message-id="${messageId}"]`
  ) as HTMLElement
  return Math.round(
    item.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  )
}

function getViewport() {
  return document.querySelector('[aria-label="viewport"]') as HTMLElement
}

function getDistanceToBottom(viewport: HTMLElement) {
  return Math.round(
    viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
  )
}

function getScrollTop(viewport: HTMLElement) {
  return Math.round(viewport.scrollTop)
}

function getCurrentAnchor() {
  return document
    .querySelector('[data-testid="visibility"]')!
    .getAttribute("data-current-anchor")
}

function getVisibleIds() {
  const value =
    document
      .querySelector('[data-testid="visibility"]')!
      .getAttribute("data-visible") ?? ""
  return value ? value.split(",") : []
}

async function renderThread(props: React.ComponentProps<typeof Thread>) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  flushSync(() => {
    root!.render(<Thread {...props} />)
  })
  await settle()
}

function createItems(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `m${index}`,
  }))
}

test("keeps the visible message in place when older messages are prepended", async () => {
  const initial = createItems(8)

  await renderThread({ items: initial })

  const viewport = getViewport()

  // Scroll into the middle so there is content above and below; m3 lands at the
  // top of the viewport and becomes the preserved anchor.
  viewport.scrollTop = 3 * ITEM_HEIGHT
  await settle()

  const offsetBefore = viewportOffsetOf("m3", viewport)

  // Prepend three older rows above the current scroll position.
  flushSync(() => {
    root!.render(
      <Thread items={[{ id: "o0" }, { id: "o1" }, { id: "o2" }, ...initial]} />
    )
  })
  await settle()

  const offsetAfter = viewportOffsetOf("m3", viewport)

  // The tracked message must not move within the viewport. With the old
  // content-relative restore it jumps up by the prepended height (~240px).
  expect(Math.abs(offsetAfter - offsetBefore)).toBeLessThanOrEqual(1)
})

test("opens at the bottom by default", async () => {
  await renderThread({ items: createItems(8) })

  expect(getDistanceToBottom(getViewport())).toBeLessThanOrEqual(1)
})

test("keeps auto-scroll pinned when the final message grows", async () => {
  const initial = createItems(6)

  await renderThread({ autoScroll: true, items: initial })

  const viewport = getViewport()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)

  flushSync(() => {
    root!.render(
      <Thread
        autoScroll
        items={initial.map((item, index) =>
          index === initial.length - 1 ? { ...item, height: 240 } : item
        )}
      />
    )
  })
  await settle()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)
})

test("keeps the end pinned when bulk appending anchored turns with autoScroll", async () => {
  const initial = createItems(6)

  await renderThread({ autoScroll: true, items: initial })

  const viewport = getViewport()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)

  flushSync(() => {
    root!.render(
      <Thread
        autoScroll
        items={[
          ...initial,
          { id: "new-user-1", scrollAnchor: true },
          { id: "new-assistant-1" },
          { id: "new-user-2", scrollAnchor: true },
          { id: "new-assistant-2" },
        ]}
      />
    )
  })
  await settle()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)
})

test("does not keep the end pinned when appending after the default bottom open", async () => {
  const initial = createItems(6)

  await renderThread({ items: initial })

  const viewport = getViewport()
  const scrollTop = getScrollTop(viewport)

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)

  flushSync(() => {
    root!.render(<Thread items={[...initial, { id: "new" }]} />)
  })
  await settle()

  expect(getScrollTop(viewport)).toBe(scrollTop)
  expect(getDistanceToBottom(viewport)).toBeGreaterThan(0)
})

test("scroll button moves the viewport to the end", async () => {
  await renderThread({
    defaultScrollPosition: "start",
    items: createItems(8),
    showButton: true,
  })

  const viewport = getViewport()

  expect(getScrollTop(viewport)).toBe(0)
  expect(getDistanceToBottom(viewport)).toBeGreaterThan(0)

  const button = document.querySelector("button") as HTMLButtonElement

  button.click()
  await settle()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)
})

test("restores the last scroll anchor when the final turn overflows", async () => {
  await renderThread({
    defaultScrollPosition: "last-anchor",
    items: [
      { id: "m0" },
      { id: "m1" },
      { id: "last-user", scrollAnchor: true },
      { id: "last-assistant", height: 360 },
    ],
    scrollPreviousItemPeek: 0,
  })

  const viewport = getViewport()

  expect(viewportOffsetOf("last-user", viewport)).toBeLessThanOrEqual(1)
  expect(getDistanceToBottom(viewport)).toBeGreaterThan(0)
})

test("falls back to the end when the last anchored turn fits", async () => {
  await renderThread({
    defaultScrollPosition: "last-anchor",
    items: [
      ...createItems(5),
      { id: "last-user", scrollAnchor: true },
      { id: "last-assistant" },
    ],
    scrollPreviousItemPeek: 0,
  })

  expect(getDistanceToBottom(getViewport())).toBeLessThanOrEqual(1)
})

test("scrolls to a mounted message by id", async () => {
  await renderThread({
    defaultScrollPosition: "start",
    items: createItems(8),
    showJumpButton: true,
  })

  const viewport = getViewport()

  const button = document.querySelector("button") as HTMLButtonElement

  button.click()
  await settle()

  expect(viewportOffsetOf("m5", viewport)).toBeLessThanOrEqual(1)
})

test("preserves a scrolled-to turn across a prepend (command-path anchor)", async () => {
  // Characterization lock for the Phase-5 anchor-ref boundary: scrollToMessage
  // sets the preserve anchor OUTSIDE a content change (the command path), unlike
  // every other prepend test which scrolls directly. Jumping then prepending
  // must keep the jumped-to turn fixed, not lose its anchor.
  const initial = createItems(12)

  await renderThread({
    defaultScrollPosition: "start",
    items: initial,
    showJumpButton: true,
  })

  const viewport = getViewport()

  ;(document.querySelector("button") as HTMLButtonElement).click()
  await settle()

  const offsetBefore = viewportOffsetOf("m5", viewport)
  expect(offsetBefore).toBeLessThanOrEqual(1)

  flushSync(() => {
    root!.render(
      <Thread
        defaultScrollPosition="start"
        items={[{ id: "o0" }, { id: "o1" }, { id: "o2" }, ...initial]}
        showJumpButton
      />
    )
  })
  await settle()

  expect(
    Math.abs(viewportOffsetOf("m5", viewport) - offsetBefore)
  ).toBeLessThanOrEqual(1)
})

test("user scroll intent cancels follow-bottom", async () => {
  const initial = createItems(8)

  await renderThread({ autoScroll: true, items: initial })

  const viewport = getViewport()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)

  viewport.dispatchEvent(
    new WheelEvent("wheel", { bubbles: true, deltaY: -ITEM_HEIGHT })
  )
  viewport.scrollTop = 0
  viewport.dispatchEvent(new Event("scroll", { bubbles: true }))
  await settle()

  expect(getScrollTop(viewport)).toBe(0)

  flushSync(() => {
    root!.render(<Thread autoScroll items={[...initial, { id: "new" }]} />)
  })
  await settle()

  expect(getScrollTop(viewport)).toBe(0)
  expect(getDistanceToBottom(viewport)).toBeGreaterThan(0)
})

test("tracks the current anchor as it scrolls above the viewport", async () => {
  // Every tenth row is a turn-start anchor: m0, m10, m20.
  const items = Array.from({ length: 30 }, (_, index) => ({
    id: `m${index}`,
    scrollAnchor: index % 10 === 0,
  }))

  await renderThread({
    defaultScrollPosition: "start",
    items,
    showVisibility: true,
  })

  const viewport = getViewport()

  // Opened at the top → the first anchor is current. The subscribed probe
  // settles on a post-mount rAF, so the value is only correct after the settle()
  // that renderThread awaits.
  expect(getCurrentAnchor()).toBe("m0")

  // Scroll until m10 is fully above the viewport. It must stay current even
  // though it is no longer visible — the behavior the old activeMessageId (and
  // jsdom) could not express.
  viewport.scrollTop = 900
  await settle()

  expect(getCurrentAnchor()).toBe("m10")
  expect(getVisibleIds()).not.toContain("m10")

  // Scrolling past the next anchor advances the cursor.
  viewport.scrollTop = 1700
  await settle()

  expect(getCurrentAnchor()).toBe("m20")
})

test("keeps the anchor at the reading line current over lower visible anchors", async () => {
  // Every row is a turn-start anchor, so several are on screen at once — the
  // scrollToMessage case. Jumping to a turn must keep IT current even though
  // newer anchors sit below it and are still visible (the regression where the
  // lowest visible anchor wrongly stole "current").
  const items = Array.from({ length: 12 }, (_, index) => ({
    id: `m${index}`,
    scrollAnchor: true,
  }))

  await renderThread({
    defaultScrollPosition: "start",
    items,
    showVisibility: true,
  })

  const viewport = getViewport()

  // Bring m5 up to the reading line; m6 and m7 sit below it, also visible.
  viewport.scrollTop = 5 * ITEM_HEIGHT
  await settle()

  expect(getCurrentAnchor()).toBe("m5")
  // m6 is on screen but below the line — it must not steal current.
  expect(getVisibleIds()).toContain("m6")
})

test("visibility populates under StrictMode (frame ref + lifecycle survive remount)", async () => {
  const ids = Array.from({ length: 8 }, (_, index) => `m${index}`)

  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  // StrictMode double-invokes mount → unmount → remount on the same refs, which
  // is what wedges the rAF scheduler and tears the subscription in Next dev.
  flushSync(() => {
    root!.render(
      <React.StrictMode>
        <MessageScrollerProvider defaultScrollPosition="start">
          <MessageScroller>
            <MessageScrollerViewport
              aria-label="viewport"
              style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
            >
              <MessageScrollerContent
                style={{ display: "flex", flexDirection: "column" }}
              >
                {ids.map((id, index) => (
                  <MemoMessageItem key={id} id={id} anchor={index % 2 === 0} />
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <VisibilityProbe />
          </MessageScroller>
        </MessageScrollerProvider>
      </React.StrictMode>
    )
  })
  await settle()

  // Force a recompute after StrictMode's mount churn.
  getViewport().scrollTop = 0
  getViewport().dispatchEvent(new Event("scroll", { bubbles: true }))
  await settle()

  expect(getCurrentAnchor()).toBe("m0")
  expect(getVisibleIds().length).toBeGreaterThan(0)
})

test("tracks visibility through memoized item components", async () => {
  const ids = Array.from({ length: 8 }, (_, index) => `m${index}`)

  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  flushSync(() => {
    root!.render(
      <MessageScrollerProvider defaultScrollPosition="start">
        <MessageScroller>
          <MessageScrollerViewport
            aria-label="viewport"
            style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
          >
            <MessageScrollerContent
              style={{ display: "flex", flexDirection: "column" }}
            >
              {ids.map((id, index) => (
                <MemoMessageItem key={id} id={id} anchor={index % 2 === 0} />
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <VisibilityProbe />
        </MessageScroller>
      </MessageScrollerProvider>
    )
  })
  await settle()

  // currentAnchorId scans the DOM (memo-independent). visibleMessageIds rides
  // registration + the real IntersectionObserver — the path memo could break.
  expect(getCurrentAnchor()).toBe("m0")
  expect(getVisibleIds().length).toBeGreaterThan(0)
  expect(getVisibleIds()).toContain("m0")
})

test("an anchored turn holds at the top when content below it collapses", async () => {
  const peek = 32
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)

  const base = [
    { id: "m0", height: 300 },
    { id: "m1", height: 300 },
    { id: "m2", height: 300 },
  ]

  flushSync(() => {
    root!.render(<Thread items={base} scrollPreviousItemPeek={peek} />)
  })
  await settle()

  // A new turn (anchor) arrives with a transient marker below it — like the
  // demo's "Thinking..." placeholder — so it has content below to reach the top.
  flushSync(() => {
    root!.render(
      <Thread
        scrollPreviousItemPeek={peek}
        items={[
          ...base,
          { id: "turn", height: 80, scrollAnchor: true },
          { id: "marker", height: 100 },
        ]}
      />
    )
  })
  await settle()

  expect(viewportOffsetOf("turn", getViewport())).toBeLessThanOrEqual(peek + 4)

  // The marker is replaced by an empty reply that will stream in: the content
  // below the turn collapses. The turn must stay pinned at the top, not drop as
  // the browser clamps scrollTop to the shorter content.
  flushSync(() => {
    root!.render(
      <Thread
        scrollPreviousItemPeek={peek}
        items={[
          ...base,
          { id: "turn", height: 80, scrollAnchor: true },
          { id: "reply", height: 0 },
        ]}
      />
    )
  })
  await settle()
  await settle()

  expect(viewportOffsetOf("turn", getViewport())).toBeLessThanOrEqual(peek + 4)
})

test("auto-scroll and content updates survive a StrictMode remount", async () => {
  // StrictMode mounts, unmounts, then remounts on the same refs. The existing
  // StrictMode test covers the visibility frame; this one covers the rest of the
  // machinery — the state + scroll frame refs must reset on the remount so
  // follow-bottom keeps working, not just on first mount.
  const items = createItems(6)

  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)

  flushSync(() => {
    root!.render(
      <React.StrictMode>
        <Thread autoScroll items={items} showVisibility />
      </React.StrictMode>
    )
  })
  await settle()

  const viewport = getViewport()
  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)

  // A new message after the remount still drives the content-change + scroll path.
  flushSync(() => {
    root!.render(
      <React.StrictMode>
        <Thread autoScroll items={[...items, { id: "new" }]} showVisibility />
      </React.StrictMode>
    )
  })
  await settle()

  expect(getDistanceToBottom(viewport)).toBeLessThanOrEqual(1)
  expect(getVisibleIds().length).toBeGreaterThan(0)
})
