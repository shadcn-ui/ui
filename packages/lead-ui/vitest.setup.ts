import "@testing-library/jest-dom/vitest"

// jsdom polyfills for browser APIs that Radix overlays read.
// These do not implement real layout — tests should not assert on
// resolved coordinates. See Tooltip.test.tsx for the policy.

if (typeof globalThis.ResizeObserver === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class StubResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error - stub for jsdom
  globalThis.ResizeObserver = StubResizeObserver
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
  // @ts-expect-error - stub for jsdom
  globalThis.IntersectionObserver = StubIntersectionObserver
}

if (
  typeof Element !== "undefined" &&
  typeof Element.prototype.hasPointerCapture !== "function"
) {
  // @ts-expect-error - stub for jsdom
  Element.prototype.hasPointerCapture = () => false
}

if (
  typeof Element !== "undefined" &&
  typeof Element.prototype.scrollIntoView !== "function"
) {
  // @ts-expect-error - stub for jsdom
  Element.prototype.scrollIntoView = () => {}
}
