import * as React from "react"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"

import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScrollerVisibility,
} from "."
import { getMessageScrollerScrollable } from "./geometry"

const MessageScrollerProvider = MessageScrollerPrimitive.Provider
const MessageScroller = MessageScrollerPrimitive.Root
const MessageScrollerViewport = MessageScrollerPrimitive.Viewport
const MessageScrollerContent = MessageScrollerPrimitive.Content
const MessageScrollerItem = MessageScrollerPrimitive.Item

// Performance proof for MessageScroller at scale. Two layers:
//
// Layer 1 isolates the algorithm: getMessageScrollerScrollable() drives the O(n)
// getContentBottom() scan that runs on every scroll commit. We measure its cost
// against a real laid-out DOM as message count grows, forcing a reflow each
// iteration the way real scrolling does.
//
// Layer 2 is the integration proof: a real top-to-bottom scroll on a large
// transcript, timing the synchronous scroll handler (where the geometry runs)
// and the resulting frame cadence, with both scroll state and visibility
// subscribed like a real chat app.
//
// jsdom cannot run either: it stubs getBoundingClientRect to a free property
// read, so the forced layout that IS the cost here would not exist.

const ITEM_HEIGHT = 48
const VIEWPORT_HEIGHT = 480
const FRAME_BUDGET = 16 // One 60fps frame in ms.

let root: Root | null = null
let container: HTMLDivElement | null = null

// Performance benchmarks are not React act() tests: they drive real
// requestAnimationFrame / IntersectionObserver and measure wall-clock, and never
// assert on rendered output. Opt this file out of the act environment that
// vitest.browser.setup.ts enables globally — vitest isolates files, so the
// behavior tests keep it on. Renders we time are flushed synchronously with
// flushSync (which runs layout effects in-band); everything else settles on real
// frames. Without this flag, the live visibility subscriber's rAF/IO-driven store
// updates — which act() cannot wrap — would log spurious "not wrapped in act"
// warnings.
;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = false

afterEach(() => {
  root?.unmount()
  container?.remove()
  root = null
  container = null
})

function VisibilityProbe() {
  // Subscribing turns on the visibility recompute path, so Layer 2 reflects a
  // real app that reads currentAnchorId, not just the scroll-state path.
  const { currentAnchorId } = useMessageScrollerVisibility()

  return (
    <div data-testid="visibility" data-current-anchor={currentAnchorId ?? ""} />
  )
}

function Thread({
  count,
  showVisibility = false,
}: {
  count: number
  showVisibility?: boolean
}) {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller>
        <MessageScrollerViewport
          aria-label="viewport"
          style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
        >
          <MessageScrollerContent
            style={{ display: "flex", flexDirection: "column" }}
          >
            {Array.from({ length: count }, (_, index) => (
              <MessageScrollerItem
                key={index}
                messageId={`m${index}`}
                // Every eighth row is a turn-start anchor, like real transcripts.
                scrollAnchor={index % 8 === 0}
                style={{ height: ITEM_HEIGHT, flex: "none" }}
              >
                {`m${index}`}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        {showVisibility ? <VisibilityProbe /> : null}
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

async function mountThread(count: number, showVisibility = false) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  flushSync(() => {
    root!.render(<Thread count={count} showVisibility={showVisibility} />)
  })
  // Let the component's mount-time scroll work settle before measuring.
  await nextFrame()
  await nextFrame()
  await nextFrame()

  const viewport = document.querySelector(
    '[aria-label="viewport"]'
  ) as HTMLElement
  const content = viewport.querySelector('[role="log"]') as HTMLElement
  const spacer = content.querySelector(
    "[data-message-scroller-spacer]"
  ) as HTMLElement

  return { content, spacer, viewport }
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function percentile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[
    Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))
  ]
}

function round(value: number) {
  return Math.round(value * 1000) / 1000
}

test("Layer 1 — getContentBottom scan stays sub-frame as message count grows", async () => {
  const counts = [100, 500, 1000, 2000]
  const iterations = 200
  const rows: Array<{
    n: number
    medianMs: number
    p95Ms: number
    maxMs: number
  }> = []

  for (const n of counts) {
    const { content, spacer, viewport } = await mountThread(n)
    const samples: number[] = []

    // Warm up so JIT and first-layout costs do not pollute the samples.
    for (let i = 0; i < 20; i++) {
      getMessageScrollerScrollable({
        content,
        scrollEdgeThreshold: 8,
        spacer,
        viewport,
      })
    }

    for (let i = 0; i < iterations; i++) {
      // Toggle scrollTop to dirty layout, so the getBoundingClientRect calls
      // inside getMessageScrollerScrollable force a real reflow — exactly what
      // happens frame-to-frame during a real scroll. Without this the browser
      // would serve cached rects and the benchmark would measure nothing.
      viewport.scrollTop = 1000 + (i % 2)

      const start = performance.now()
      getMessageScrollerScrollable({
        content,
        scrollEdgeThreshold: 8,
        spacer,
        viewport,
      })
      samples.push(performance.now() - start)
    }

    rows.push({
      n,
      medianMs: round(median(samples)),
      p95Ms: round(percentile(samples, 95)),
      maxMs: round(Math.max(...samples)),
    })

    root?.unmount()
    container?.remove()
    root = null
    container = null
  }

  // eslint-disable-next-line no-console
  console.log(
    "\n[Layer 1] getMessageScrollerScrollable cost per scroll commit (real reflow):\n" +
      rows
        .map(
          (r) =>
            `  n=${String(r.n).padStart(4)}  median ${String(
              r.medianMs
            ).padStart(
              6
            )}ms  p95 ${String(r.p95Ms).padStart(6)}ms  max ${String(
              r.maxMs
            ).padStart(6)}ms`
        )
        .join("\n") +
      "\n"
  )

  // Proof: even at 2000 rendered rows a single commit stays under one frame,
  // with generous CI slack. The logged median is the real headline number.
  const worst = rows[rows.length - 1]
  expect(worst.medianMs).toBeLessThan(FRAME_BUDGET)
})

test("Layer 2 — real top-to-bottom scroll on 1000 messages holds frame budget", async () => {
  const COUNT = 1000
  const STEPS = 120

  const { viewport } = await mountThread(COUNT, true)

  // Capture any main-thread long task (>50ms by spec) during the scroll.
  const longTasks: number[] = []
  let observer: PerformanceObserver | null = null
  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks.push(entry.duration)
      }
    })
    observer.observe({ entryTypes: ["longtask"] })
  } catch {
    // longtask not supported — frame timing below is still the primary proof.
  }

  const max = viewport.scrollHeight - viewport.clientHeight
  const handlerCosts: number[] = []
  const frameDeltas: number[] = []

  let last = performance.now()

  for (let i = 1; i <= STEPS; i++) {
    viewport.scrollTop = Math.round((max * i) / STEPS)

    // The scroll handler runs synchronously inside dispatch:
    // syncAfterScroll -> commitScrollState -> getContentBottom. Timing the
    // dispatch is timing the exact main-thread block a user scroll causes.
    const start = performance.now()
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }))
    handlerCosts.push(performance.now() - start)

    await nextFrame()
    const now = performance.now()
    frameDeltas.push(now - last)
    last = now
  }

  observer?.disconnect()

  const stats = {
    handlerMedianMs: round(median(handlerCosts)),
    handlerP95Ms: round(percentile(handlerCosts, 95)),
    handlerMaxMs: round(Math.max(...handlerCosts)),
    frameMedianMs: round(median(frameDeltas)),
    frameP95Ms: round(percentile(frameDeltas, 95)),
    frameMaxMs: round(Math.max(...frameDeltas)),
    longTasks: longTasks.length,
    longTaskMaxMs: longTasks.length ? round(Math.max(...longTasks)) : 0,
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n[Layer 2] scrolling ${COUNT} messages top-to-bottom over ${STEPS} steps` +
      " (scroll state + visibility live):\n" +
      `  scroll handler   median ${stats.handlerMedianMs}ms  p95 ${stats.handlerP95Ms}ms  max ${stats.handlerMaxMs}ms\n` +
      `  frame interval   median ${stats.frameMedianMs}ms  p95 ${stats.frameP95Ms}ms  max ${stats.frameMaxMs}ms\n` +
      `  long tasks       ${stats.longTasks}${
        stats.longTasks ? ` (worst ${stats.longTaskMaxMs}ms)` : ""
      }\n`
  )

  // Proof: the synchronous scroll handler never spends a whole frame, so it
  // cannot drop one. Median is the headline; p95 carries generous CI slack.
  expect(stats.handlerMedianMs).toBeLessThan(FRAME_BUDGET)
  expect(stats.handlerP95Ms).toBeLessThan(FRAME_BUDGET * 2)
})

test("Regression guard — one scroll commit does O(items) layout reads, not O(items^2)", async () => {
  // Timing budgets are a coarse, hardware-dependent backstop. THIS is the real
  // regression guard: the number of forced layout reads per scroll commit is
  // deterministic and machine-independent. getContentBottom reads one rect per
  // item (plus a small constant), so the ratio stays ~O(1) per item. An O(n^2)
  // regression — e.g. a nested rect loop — would push it far past the bound.
  const ITEMS = 2000
  const { viewport } = await mountThread(ITEMS)

  const originalRect = Element.prototype.getBoundingClientRect
  let calls = 0
  Element.prototype.getBoundingClientRect = function getBoundingClientRectSpy(
    this: Element
  ) {
    calls++
    return originalRect.call(this)
  }

  try {
    // One synchronous scroll commit (handleScroll runs inside dispatch).
    viewport.scrollTop = 1234
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }))
  } finally {
    Element.prototype.getBoundingClientRect = originalRect
  }

  const perItem = round(calls / ITEMS)

  // eslint-disable-next-line no-console
  console.log(
    `\n[Regression guard] ${calls} getBoundingClientRect calls for ${ITEMS} items` +
      ` (${perItem}/item) in one scroll commit\n`
  )

  // A handful of rect reads per item is fine; anything that scales with item
  // count (O(n) per item -> O(n^2) total) blows past this at 2000 items.
  expect(perItem).toBeLessThan(4)
})

// ===========================================================================
// Layer 3 — streaming. The one path where heavy DOM should actually bite: an
// assistant reply GROWS token-by-token at the bottom of a long transcript.
// Growth dirties layout, so handleContentChange + the ResizeObserver-driven
// handleResize run while a full reflow is genuinely required — unlike steady
// scroll, which never dirties layout.
//
// To isolate the SCROLLER's cost from the markdown's own render cost (they
// interleave in one React commit), we run the identical growth twice: once
// inside MessageScroller (auto-follow) and once inside a plain scroll div
// (manual follow). Prior history is memoized in both, like a real app, so only
// the growing reply re-renders. The delta is what the scroller adds per token.
// ===========================================================================

const PRIOR_TURNS = 150
const STREAM_CHUNKS = 60

function StreamingReplyBody({ chunks }: { chunks: number }) {
  // Each token batch appends a block, so the reply grows and dirties layout.
  return (
    <div style={{ padding: "12px 16px", fontSize: 14, lineHeight: 1.6 }}>
      {Array.from({ length: chunks }, (_, index) =>
        index % 5 === 4 ? (
          <CodeBlock key={index} lines={6} />
        ) : (
          <p key={index} style={{ margin: "0 0 8px" }}>
            {`Streaming sentence ${index} that adds height to the reply as it grows. `.repeat(
              2
            )}
          </p>
        )
      )}
    </div>
  )
}

// Memoized prior history — stable across token renders, so streaming only
// re-renders the growing reply, exactly like a real memoized message list.
const PriorTurnsScroller = React.memo(function PriorTurnsScroller() {
  return (
    <>
      {Array.from({ length: PRIOR_TURNS }, (_, index) => (
        <React.Fragment key={index}>
          <MessageScrollerItem
            messageId={`u${index}`}
            scrollAnchor
            style={{
              flex: "none",
              padding: "12px 16px",
              background: "#fafafa",
            }}
          >
            {`Question ${index}`}
          </MessageScrollerItem>
          <MessageScrollerItem messageId={`a${index}`} style={{ flex: "none" }}>
            <HeavyAssistantMessage seed={index} />
          </MessageScrollerItem>
        </React.Fragment>
      ))}
    </>
  )
})

const PriorTurnsPlain = React.memo(function PriorTurnsPlain() {
  return (
    <>
      {Array.from({ length: PRIOR_TURNS }, (_, index) => (
        <React.Fragment key={index}>
          <div style={{ padding: "12px 16px", background: "#fafafa" }}>
            {`Question ${index}`}
          </div>
          <div>
            <HeavyAssistantMessage seed={index} />
          </div>
        </React.Fragment>
      ))}
    </>
  )
})

function ScrollerStream({ chunks }: { chunks: number }) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller>
        <MessageScrollerViewport
          aria-label="viewport"
          style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
        >
          <MessageScrollerContent
            style={{ display: "flex", flexDirection: "column" }}
          >
            <PriorTurnsScroller />
            <MessageScrollerItem messageId="streaming" style={{ flex: "none" }}>
              <StreamingReplyBody chunks={chunks} />
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

function PlainStream({ chunks }: { chunks: number }) {
  return (
    <div
      data-testid="plain-viewport"
      style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <PriorTurnsPlain />
        <div>
          <StreamingReplyBody chunks={chunks} />
        </div>
      </div>
    </div>
  )
}

async function runStream(
  renderTree: (chunks: number) => React.ReactElement,
  follow?: (viewport: HTMLElement) => void
) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)

  flushSync(() => {
    root!.render(renderTree(1))
  })
  await nextFrame()
  await nextFrame()
  await nextFrame()

  const viewport = (container.querySelector('[aria-label="viewport"]') ??
    container.querySelector('[data-testid="plain-viewport"]')) as HTMLElement

  const longTasks: number[] = []
  let observer: PerformanceObserver | null = null
  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks.push(entry.duration)
      }
    })
    observer.observe({ entryTypes: ["longtask"] })
  } catch {
    // longtask unsupported.
  }

  const commits: number[] = []

  for (let chunk = 2; chunk <= STREAM_CHUNKS; chunk++) {
    // Time the synchronous React commit: render + layout effects, where the
    // scroller's handleContentChange runs. The reply is one chunk taller, so
    // layout is dirty going in.
    const start = performance.now()
    flushSync(() => {
      root!.render(renderTree(chunk))
    })
    commits.push(performance.now() - start)

    follow?.(viewport)
    await nextFrame()
  }

  observer?.disconnect()

  root?.unmount()
  container?.remove()
  root = null
  container = null

  return {
    commitMedianMs: round(median(commits)),
    commitP95Ms: round(percentile(commits, 95)),
    commitMaxMs: round(Math.max(...commits)),
    longTasks: longTasks.length,
    longTaskMaxMs: longTasks.length ? round(Math.max(...longTasks)) : 0,
  }
}

test("Layer 3 — streaming a heavy reply: scroller overhead vs plain baseline", async () => {
  // Baseline: same growth in a plain scroll div, manually following the bottom.
  const baseline = await runStream(
    (chunks) => <PlainStream chunks={chunks} />,
    (viewport) => {
      viewport.scrollTop = viewport.scrollHeight
    }
  )

  // Scroller: identical growth, auto-follow does the work.
  const scroller = await runStream((chunks) => (
    <ScrollerStream chunks={chunks} />
  ))

  const overheadMedian = round(
    scroller.commitMedianMs - baseline.commitMedianMs
  )

  // eslint-disable-next-line no-console
  console.log(
    `\n[Layer 3] streaming a reply to ${STREAM_CHUNKS} chunks below ${PRIOR_TURNS} memoized heavy turns,` +
      " per-token commit (render + scroller content-change handling):\n" +
      `  plain div baseline   median ${baseline.commitMedianMs}ms  p95 ${baseline.commitP95Ms}ms  max ${baseline.commitMaxMs}ms  longTasks ${baseline.longTasks}\n` +
      `  MessageScroller      median ${scroller.commitMedianMs}ms  p95 ${scroller.commitP95Ms}ms  max ${scroller.commitMaxMs}ms  longTasks ${scroller.longTasks}\n` +
      `  scroller overhead    median ${overheadMedian}ms per token\n`
  )

  // Proof: the scroller's per-token streaming work fits in a frame, and the
  // overhead it adds over a plain scroll div is a small fraction of one.
  expect(scroller.commitMedianMs).toBeLessThan(FRAME_BUDGET)
  expect(overheadMedian).toBeLessThan(FRAME_BUDGET)
})

// ---------------------------------------------------------------------------
// Heavy-content variant. Real chat turns are not one text node — they are full
// markdown subtrees: headings, paragraphs, tokenized code blocks, tables and
// lists, hundreds of DOM nodes each. The scroller's forced reflow recomputes
// layout over that whole subtree, so this is the honest stress for the geometry
// hot path. (This does NOT measure the markdown library's own render cost —
// that is the content's concern, not the scroller's.)
// ---------------------------------------------------------------------------

function CodeBlock({ lines }: { lines: number }) {
  return (
    <pre
      style={{
        whiteSpace: "pre",
        overflowX: "auto",
        background: "#f5f5f5",
        padding: 12,
        margin: "8px 0",
        fontFamily: "monospace",
        fontSize: 13,
      }}
    >
      <code>
        {Array.from({ length: lines }, (_, line) => (
          <div key={line}>
            {Array.from({ length: 8 }, (_, token) => (
              <span key={token} style={{ color: token % 2 ? "#07a" : "#905" }}>
                {`tok${token} `}
              </span>
            ))}
          </div>
        ))}
      </code>
    </pre>
  )
}

function MarkdownTable({ rows }: { rows: number }) {
  return (
    <table
      style={{ borderCollapse: "collapse", margin: "8px 0", width: "100%" }}
    >
      <thead>
        <tr>
          {["Name", "Type", "Default", "Description"].map((header) => (
            <th key={header} style={{ border: "1px solid #ddd", padding: 6 }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, row) => (
          <tr key={row}>
            {Array.from({ length: 4 }, (_, cell) => (
              <td key={cell} style={{ border: "1px solid #ddd", padding: 6 }}>
                {`r${row}c${cell}`}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function HeavyAssistantMessage({ seed }: { seed: number }) {
  // Vary the sizes by turn so heights are non-uniform like real replies.
  const paragraphs = 2 + (seed % 3)
  const codeLines = 12 + (seed % 14)
  const tableRows = 3 + (seed % 5)

  return (
    <div style={{ padding: "12px 16px", fontSize: 14, lineHeight: 1.6 }}>
      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>{`Reply ${seed}`}</h2>
      {Array.from({ length: paragraphs }, (_, index) => (
        <p key={index} style={{ margin: "0 0 8px" }}>
          {`This is paragraph ${index} of a fairly long assistant reply that wraps across multiple lines so the layout engine has real flow work to do when the surrounding scroll position changes during a scroll. `.repeat(
            2
          )}
        </p>
      ))}
      <ul style={{ margin: "0 0 8px", paddingLeft: 20 }}>
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index}>{`List item ${index} with some inline text.`}</li>
        ))}
      </ul>
      <CodeBlock lines={codeLines} />
      <MarkdownTable rows={tableRows} />
    </div>
  )
}

function HeavyThread({ turns }: { turns: number }) {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller>
        <MessageScrollerViewport
          aria-label="viewport"
          style={{ height: VIEWPORT_HEIGHT, overflowY: "auto" }}
        >
          <MessageScrollerContent
            style={{ display: "flex", flexDirection: "column" }}
          >
            {Array.from({ length: turns }, (_, index) => (
              <React.Fragment key={index}>
                {/* User turn: short, and the scroll anchor. */}
                <MessageScrollerItem
                  messageId={`u${index}`}
                  scrollAnchor
                  style={{
                    flex: "none",
                    padding: "12px 16px",
                    background: "#fafafa",
                  }}
                >
                  {`Question ${index}: how does this work?`}
                </MessageScrollerItem>
                {/* Assistant turn: heavy markdown subtree. */}
                <MessageScrollerItem
                  messageId={`a${index}`}
                  style={{ flex: "none" }}
                >
                  <HeavyAssistantMessage seed={index} />
                </MessageScrollerItem>
              </React.Fragment>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <VisibilityProbe />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

async function mountHeavyThread(turns: number) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  flushSync(() => {
    root!.render(<HeavyThread turns={turns} />)
  })
  await nextFrame()
  await nextFrame()
  await nextFrame()

  const viewport = document.querySelector(
    '[aria-label="viewport"]'
  ) as HTMLElement
  const content = viewport.querySelector('[role="log"]') as HTMLElement
  const spacer = content.querySelector(
    "[data-message-scroller-spacer]"
  ) as HTMLElement
  const nodeCount = content.querySelectorAll("*").length

  return { content, nodeCount, spacer, viewport }
}

test("Layer 1 (heavy markdown) — commit cost over full markdown subtrees", async () => {
  const turnCounts = [50, 150, 300]
  const iterations = 150
  const rows: Array<{
    turns: number
    items: number
    nodes: number
    medianMs: number
    p95Ms: number
    maxMs: number
  }> = []

  for (const turns of turnCounts) {
    const { content, nodeCount, spacer, viewport } =
      await mountHeavyThread(turns)
    const samples: number[] = []

    for (let i = 0; i < 20; i++) {
      getMessageScrollerScrollable({
        content,
        scrollEdgeThreshold: 8,
        spacer,
        viewport,
      })
    }

    for (let i = 0; i < iterations; i++) {
      viewport.scrollTop = 1000 + (i % 2)

      const start = performance.now()
      getMessageScrollerScrollable({
        content,
        scrollEdgeThreshold: 8,
        spacer,
        viewport,
      })
      samples.push(performance.now() - start)
    }

    rows.push({
      turns,
      items: turns * 2,
      nodes: nodeCount,
      medianMs: round(median(samples)),
      p95Ms: round(percentile(samples, 95)),
      maxMs: round(Math.max(...samples)),
    })

    root?.unmount()
    container?.remove()
    root = null
    container = null
  }

  // eslint-disable-next-line no-console
  console.log(
    "\n[Layer 1 · heavy markdown] getMessageScrollerScrollable cost per commit:\n" +
      rows
        .map(
          (r) =>
            `  turns=${String(r.turns).padStart(3)}  items=${String(
              r.items
            ).padStart(3)}  domNodes=${String(r.nodes).padStart(
              6
            )}  median ${String(r.medianMs).padStart(6)}ms  p95 ${String(
              r.p95Ms
            ).padStart(6)}ms  max ${String(r.maxMs).padStart(6)}ms`
        )
        .join("\n") +
      "\n"
  )

  const worst = rows[rows.length - 1]
  expect(worst.medianMs).toBeLessThan(FRAME_BUDGET)
})

test("Layer 2 (heavy markdown) — real scroll over 300 markdown turns", async () => {
  const TURNS = 300
  const STEPS = 120

  const { nodeCount, viewport } = await mountHeavyThread(TURNS)

  const longTasks: number[] = []
  let observer: PerformanceObserver | null = null
  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks.push(entry.duration)
      }
    })
    observer.observe({ entryTypes: ["longtask"] })
  } catch {
    // longtask unsupported — handler timing below is still the proof.
  }

  const max = viewport.scrollHeight - viewport.clientHeight
  const handlerCosts: number[] = []

  for (let i = 1; i <= STEPS; i++) {
    viewport.scrollTop = Math.round((max * i) / STEPS)

    const start = performance.now()
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }))
    handlerCosts.push(performance.now() - start)

    await nextFrame()
  }

  observer?.disconnect()

  const stats = {
    handlerMedianMs: round(median(handlerCosts)),
    handlerP95Ms: round(percentile(handlerCosts, 95)),
    handlerMaxMs: round(Math.max(...handlerCosts)),
    longTasks: longTasks.length,
    longTaskMaxMs: longTasks.length ? round(Math.max(...longTasks)) : 0,
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n[Layer 2 · heavy markdown] scrolling ${TURNS} turns (${
      TURNS * 2
    } messages, ${nodeCount} DOM nodes) top-to-bottom:\n` +
      `  scroll handler   median ${stats.handlerMedianMs}ms  p95 ${stats.handlerP95Ms}ms  max ${stats.handlerMaxMs}ms\n` +
      `  long tasks       ${stats.longTasks}${
        stats.longTasks ? ` (worst ${stats.longTaskMaxMs}ms)` : ""
      }\n`
  )

  expect(stats.handlerMedianMs).toBeLessThan(FRAME_BUDGET)
  expect(stats.handlerP95Ms).toBeLessThan(FRAME_BUDGET * 2)
})
