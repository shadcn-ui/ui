# MessageScroller — performance

MessageScroller is **not virtualized** by default. It renders every message as a real DOM
node and tracks scroll position with geometry reads on the scroll, resize, and
content-change paths. The question this doc answers — with a runnable benchmark,
not assertions of faith — is whether that design holds up for long, markdown-rich
transcripts.

**Verdict: yes, with wide headroom.** A scroll commit on 1000 messages blocks the
main thread for under 1ms; the same on 600 heavy-markdown items (64k DOM nodes)
is well under 1ms with zero dropped frames; and while a heavy reply streams in,
the scroller's own per-token work is ~1–2ms — a fraction of a frame on top of the
markdown render. The limiting factor at extreme scale is the un-virtualized row
count itself, not the scroller's work.

## Running it

```bash
# from packages/react
pnpm test:browser src/message-scroller/message-scroller.perf.browser.test.tsx
```

It runs in real Chromium via Playwright (`vitest.browser.config.ts`) and prints a
numbers table per layer. **It must run in a real browser** — the entire cost here
is forced layout, and jsdom stubs `getBoundingClientRect` to a free property
read, so a jsdom "benchmark" would measure nothing real. The file matches the
`*.browser.test.tsx` glob, so it also runs in CI (`browser-tests.yml`) and
doubles as a regression guard.

**The suite runs outside React's act environment.** Both browser test files set
`IS_REACT_ACT_ENVIRONMENT = false`. This component is driven by the event loop —
`requestAnimationFrame`, `ResizeObserver`, `IntersectionObserver` — which `act()`
cannot wrap, so the tests flush the renders they time with `flushSync` and settle
async scroll work on real frames. Do not reintroduce `act()` here: it re-adds the
spurious "update not wrapped in act(...)" warnings from the rAF-driven visibility
subscriber without changing what is measured.

## Why this is the right thing to measure

The scroller's hot-path cost is not the `getBoundingClientRect` _call_ — it is the
**forced synchronous reflow** that call triggers when layout is dirty. The
benchmark is built around two facts about when layout is and isn't dirty:

- **Scrolling does not dirty layout.** Changing `scrollTop` is a scroll-offset
  change, not a layout invalidation, so during steady scroll `getBoundingClientRect`
  reads already-computed boxes. Cost tracks the _number of items iterated_ (one
  rect read per top-level row in `getContentBottom`), and is nearly blind to how
  deep each row's subtree is. This is why heavy markdown barely changes the scroll
  numbers.
- **Growth dirties layout.** When a streaming reply gets taller, the next geometry
  read pays for a real reflow. That is the only path where DOM weight can bite, so
  it gets its own layer and an A/B isolation against a plain scroll div.

## The three layers

### Layer 1 — algorithmic scaling (isolated)

Calls `getMessageScrollerScrollable` (which drives the O(n) `getContentBottom` scan) in
a tight loop against a real laid-out DOM, toggling `scrollTop` each iteration to
force the reflow that real scrolling forces. Answers: how does one scroll commit
scale with row count?

### Layer 2 — real scroll under load (the integration proof)

Mounts a large transcript with scroll-state and visibility both subscribed (a real
app), drives a top-to-bottom scroll, and times the **synchronous scroll handler**
(`handleScroll → syncAfterScroll → commitScrollState → getContentBottom` runs
inside `dispatchEvent`, so timing the dispatch is timing the exact main-thread
block a user scroll causes). Counts long tasks. Run both with trivial rows and
with heavy markdown rows.

### Layer 3 — streaming (the real-chat worst case)

Streams an assistant reply token-by-token at the bottom of a long transcript of
**memoized** heavy turns (so only the growing reply re-renders, like a real app).
Runs the identical growth inside MessageScroller (auto-follow) and inside a plain
scroll `<div>` (manual follow); the **delta** isolates the scroller's per-token
cost from the markdown's own render cost.

## Indicative numbers

> Measured on Apple Silicon, headless Chromium (Playwright), 2026-06. These are
> **indicative, not guarantees** — absolute timings drift with hardware and CI.
> The durable contract is the budget assertions below; the test is the source of
> truth. Re-run to get numbers for your machine.

**Layer 1 — per-commit cost vs. row count (trivial rows):**

| messages | median | p95   | max   |
| -------- | ------ | ----- | ----- |
| 100      | 0.1ms  | 0.1ms | 0.7ms |
| 500      | 0.3ms  | 0.3ms | 1.2ms |
| 1000     | 0.5ms  | 0.6ms | 1.9ms |
| 2000     | 1.1ms  | 1.2ms | 4.6ms |

Linear in row count with a tiny constant. Extrapolated, a single commit alone
would not reach one 16ms frame until ~30,000 rendered rows.

**Layer 1 — per-commit cost vs. DOM weight (heavy markdown):**

| turns | items | DOM nodes | median | p95   |
| ----- | ----- | --------- | ------ | ----- |
| 50    | 100   | 10,509    | 0.1ms  | 0.2ms |
| 150   | 300   | 31,996    | 0.2ms  | 0.3ms |
| 300   | 600   | 64,135    | 0.4ms  | 0.5ms |

64k DOM nodes barely moves the cost — it tracks item count, not subtree depth,
because scrolling doesn't dirty layout (see above).

**Layer 2 — real top-to-bottom scroll:**

| scenario                    | handler median | handler p95 | handler max | long tasks |
| --------------------------- | -------------- | ----------- | ----------- | ---------- |
| 1000 trivial messages       | 0.9ms          | 1.2ms       | 2.1ms       | 0          |
| 300 heavy turns (64k nodes) | 0.6ms          | 0.8ms       | 0.9ms       | 0          |

**Layer 3 — streaming a heavy reply (per-token commit, `flushSync`-timed):**

| tree                   | median     | p95   | max   | long tasks |
| ---------------------- | ---------- | ----- | ----- | ---------- |
| plain `<div>` baseline | 1.2ms      | 2.2ms | 2.3ms | 0          |
| MessageScroller        | 3.2ms      | 5.7ms | 8.3ms | 0          |
| **scroller overhead**  | **~1–2ms** |       |       |            |

Each token re-renders the growing reply; `flushSync` times that commit plus the
scroller's `handleContentChange` layout effect (re-scan items, follow-bottom).
The overhead over a plain `<div>` is the scroller's synchronous content-change
work — a consistent **~1–2ms per token**, a fraction of a frame, with zero long
tasks. (An earlier `act()`-wrapped version of this layer timed the whole async
flush and spuriously reported ~0/negative overhead; the `flushSync` timing is the
honest one.) The per-token total is still dominated by the markdown render, which
is the message component's cost, not the scroller's.

## Preventing regressions

The suite runs in CI on every PR that touches `packages/react/**`
(`.github/workflows/browser-tests.yml`). It guards against regressions two
ways, in order of strength:

### 1. Deterministic guard (the real one)

`getBoundingClientRect` is spied during a single scroll commit and the call count
is asserted to be **O(items), not O(items²)** — currently ~1.0 reads per item
(2030 reads for 2000 items). This count is **machine-independent and has zero
variance**, so it can be a tight bound: the classic perf regression (a nested rect
loop, an accidental per-item `getComputedStyle`) makes the per-item ratio scale
with item count and blows past the bound deterministically, where a timing test
would just shrug. This is the assertion to trust.

### 2. Timing budgets (coarse backstop)

Wall-clock assertions catch a catastrophic slowdown, but they are
hardware-dependent, so they carry generous slack and only flag multi-× blowups:

- Layer 1: per-commit median at the largest row count `< 16ms` (one frame).
- Layer 2: scroll-handler median `< 16ms`, p95 `< 32ms`.
- Layer 3: scroller per-token median `< 16ms`, and overhead over baseline `< 16ms`.

Do not tighten the timing budgets toward the indicative numbers — CI runner noise
will make them flake. If you want an earlier warning on gradual creep, prefer
adding more invariants to the deterministic guard (more counts, scaling-ratio
checks between two row counts measured in the same run) over shrinking the ms
thresholds.

## Boundaries and non-goals

- **No virtualization.** Cost is O(rendered rows). Realistic transcripts (hundreds
  to low thousands of turns) have enormous headroom; tens of thousands of _live_
  rows would eventually make `getContentBottom`'s all-items scan matter. The fix is
  already scoped if ever needed: the last non-spacer child carries the max bottom,
  so the scan can collapse to O(1).
- **Markdown render cost is out of scope.** Layer 3 shows per-token cost is the
  content renderer's, not the scroller's. Mitigations (memoizing history, batching
  tokens, virtualizing code blocks) belong to the message components.
- **Timings are machine-relative.** Don't copy these numbers into user-facing docs
  as promises; cite the methodology and re-run.
