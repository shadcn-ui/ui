import "@testing-library/jest-dom/vitest"

// jsdom polyfills for browser APIs that Radix overlays read.
// These do not implement real layout — tests should not assert on
// resolved coordinates. See Tooltip.test.tsx for the policy.

if (typeof globalThis.ResizeObserver === "undefined") {
  class StubResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    StubResizeObserver as unknown as typeof ResizeObserver
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  class StubIntersectionObserver {
    root = null
    rootMargin = ""
    thresholds = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  globalThis.IntersectionObserver =
    StubIntersectionObserver as unknown as typeof IntersectionObserver
}

if (
  typeof Element !== "undefined" &&
  typeof Element.prototype.hasPointerCapture !== "function"
) {
  Element.prototype.hasPointerCapture =
    (() => false) as Element["hasPointerCapture"]
}

if (
  typeof Element !== "undefined" &&
  typeof Element.prototype.scrollIntoView !== "function"
) {
  Element.prototype.scrollIntoView =
    (() => {}) as Element["scrollIntoView"]
}
