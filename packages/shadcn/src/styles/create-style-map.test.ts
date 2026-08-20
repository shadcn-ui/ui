import { describe, expect, it } from "vitest"

import { createStyleMap } from "./create-style-map"

describe("parseStyle", () => {
  it("extracts tailwind classes from @apply directives", () => {
    const css = `
      .style-nova {
        .cn-alert-dialog-content {
          @apply bg-background gap-4 rounded-xl border;
        }
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-alert-dialog-content": "bg-background gap-4 rounded-xl border",
      }
    `)
  })

  it("handles multiple @apply directives", () => {
    const css = `
      .cn-button {
        @apply rounded-lg border;
        @apply text-sm;
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-button": "rounded-lg border text-sm",
      }
    `)
  })

  it("handles variant classes", () => {
    const css = `
      .cn-button-variant-default {
        @apply text-primary-foreground bg-primary;
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-button-variant-default": "text-primary-foreground bg-primary",
      }
    `)
  })

  it("handles nested selectors", () => {
    const css = `
      .cn-card {
        @apply rounded-xl border;

        .cn-card-header {
          @apply gap-2 px-6;
        }
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-card": "rounded-xl border",
        "cn-card-header": "gap-2 px-6",
      }
    `)
  })

  it("ignores rules without @apply", () => {
    const css = `
      .cn-button {
        color: red;
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`{}`)
  })

  it("handles size variants", () => {
    const css = `
      .cn-button-size-sm {
        @apply h-7 gap-1 px-2.5;
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-button-size-sm": "h-7 gap-1 px-2.5",
      }
    `)
  })

  it("handles nested variant selectors with &", () => {
    const css = `
      .cn-button {
        @apply rounded-lg;

        &.cn-button-variant-default {
          @apply bg-primary text-white;
        }
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-button": "rounded-lg",
        "cn-button-variant-default": "bg-primary text-white",
      }
    `)
  })

  it("merges duplicate class names", () => {
    const css = `
      .cn-button {
        @apply rounded-lg;
      }
      .cn-button {
        @apply border;
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-button": "border rounded-lg",
      }
    `)
  })

  it("ignores non-cn- classes", () => {
    const css = `
      .button {
        @apply rounded-lg border;
      }
      .some-other-class {
        @apply text-sm;
      }
      .cn-button {
        @apply px-4;
      }
    `

    const result = createStyleMap(css)

    expect(result).toMatchInlineSnapshot(`
      {
        "cn-button": "px-4",
      }
    `)
  })
})
