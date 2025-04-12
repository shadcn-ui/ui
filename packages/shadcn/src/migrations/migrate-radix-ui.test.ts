import { describe, expect, it } from "vitest"

import { updateFilesContent } from "./migrate-radix-ui"

describe("migrateRadixUi", () => {
  it("should migrate @radix-ui/react-* namespace and named imports", async () => {
    const input = `
      import * as DialogPrimitive from "@radix-ui/react-dialog"
      import { Slot } from "@radix-ui/react-slot"

      export function Component() {
        return (
          <Slot>
            <DialogPrimitive.Root />
          </Slot>
        )
      }
    `

    expect(await updateFilesContent(input)).toMatchInlineSnapshot(`
      "import { Dialog as DialogPrimitive, Slot as SlotPrimitive } from "radix-ui";

                        export function Component() {
              return (
                <SlotPrimitive.Root>
                  <DialogPrimitive.Root />
                </SlotPrimitive.Root>
              )
            }
          "
    `)
  })

  it("should migrate Slot JSX elements, typeof types, and conditional expressions", async () => {
    const input = `
      import { Slot } from "@radix-ui/react-slot"

      type SlotProps = React.ComponentProps<typeof Slot>

      export function Component({ asChild }: { asChild?: boolean }) {
        const Comp = asChild ? Slot : "div"
        return <Comp />
      }
    `

    expect(await updateFilesContent(input)).toMatchInlineSnapshot(`
      "import { Slot as SlotPrimitive } from "radix-ui"

            type SlotProps = React.ComponentProps<typeof SlotPrimitive.Root>

            export function Component({ asChild }: { asChild?: boolean }) {
              const Comp = asChild ? SlotPrimitive.Root : "div"
              return <Comp />
            }
          "
    `)
  })

  it("should consolidate and sort multiple radix-ui imports", async () => {
    const input = `
      import { Slot } from "@radix-ui/react-slot"
      import * as DialogPrimitive from "@radix-ui/react-dialog"
      import * as TooltipPrimitive from "@radix-ui/react-tooltip"
    `

    expect(await updateFilesContent(input)).toMatchInlineSnapshot(`
      "import { Dialog as DialogPrimitive, Slot as SlotPrimitive, Tooltip as TooltipPrimitive } from "radix-ui";
                            "
    `)
  })

  it("should leave file untouched if no @radix-ui/react-* imports", async () => {
    const input = `
      import { Something } from "some-other-library"

      export const x = 42
    `

    expect(await updateFilesContent(input)).toMatchInlineSnapshot(`
      "
            import { Something } from "some-other-library"

            export const x = 42
          "
    `)
  })

  it("should handle conditional expressions without Slot safely", async () => {
    const input = `
      export function Component({ asChild }: { asChild?: boolean }) {
        const Comp = asChild ? "button" : "div"
        return <Comp />
      }
    `

    expect(await updateFilesContent(input)).toMatchInlineSnapshot(`
      "
            export function Component({ asChild }: { asChild?: boolean }) {
              const Comp = asChild ? "button" : "div"
              return <Comp />
            }
          "
    `)
  })

  it("should handle typeof checks unrelated to Slot safely", async () => {
    const input = `
      type ButtonProps = React.ComponentProps<"button">
    `

    expect(await updateFilesContent(input)).toMatchInlineSnapshot(`
      "
            type ButtonProps = React.ComponentProps<"button">
          "
    `)
  })
})
