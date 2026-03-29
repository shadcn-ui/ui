import { describe, expect, it } from "vitest"

import { migrateIconsFile } from "./migrate-icons"

describe("migrateIconsFile", () => {
  it("should replace radix icons with lucide icons", async () => {
    const input = `
      import { CheckIcon, CloseIcon } from "@radix-ui/react-icons"
      import { Something } from "other-package"

      export function Component() {
        return (
          <div>
            <CheckIcon className="w-4 h-4" />
            <CloseIcon />
          </div>
        )
      }`

    expect(
      await migrateIconsFile(input, "radix", "lucide", {
        Check: {
          lucide: "Check",
          radix: "CheckIcon",
        },
        X: {
          lucide: "X",
          radix: "CloseIcon",
        },
      })
    ).toMatchInlineSnapshot(`
      "import { Something } from "other-package"
      import { Check, X } from "lucide-react";

            export function Component() {
              return (
                <div>
                  <Check className="w-4 h-4" />
                  <X />
                </div>
              )
            }"
    `)
  })

  it("should return null if no radix icons are found", async () => {
    const input = `
      import { Something } from "other-package"

      export function Component() {
        return <div>No icons here</div>
      }`

    expect(await migrateIconsFile(input, "lucide", "radix", {}))
      .toMatchInlineSnapshot(`
      "import { Something } from "other-package"

            export function Component() {
              return <div>No icons here</div>
            }"
    `)
  })

  it("should handle mixed icon imports from different packages", async () => {
    const input = `
      import { CheckIcon } from "@radix-ui/react-icons"
      import { AlertCircle } from "lucide-react"
      import { Something } from "other-package"
      import { Cross2Icon } from "@radix-ui/react-icons"

      export function Component() {
        return (
          <div>
            <CheckIcon className="w-4 h-4" />
            <AlertCircle />
            <Cross2Icon />
          </div>
        )
      }`

    expect(
      await migrateIconsFile(input, "radix", "lucide", {
        Check: {
          lucide: "Check",
          radix: "CheckIcon",
        },
        X: {
          lucide: "X",
          radix: "Cross2Icon",
        },
      })
    ).toMatchInlineSnapshot(`
      "import { AlertCircle } from "lucide-react"
            import { Something } from "other-package"
      import { Check, X } from "lucide-react";

            export function Component() {
              return (
                <div>
                  <Check className="w-4 h-4" />
                  <AlertCircle />
                  <X />
                </div>
              )
            }"
    `)
  })

  it("should preserve all props and children on icons", async () => {
    const input = `
      import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"

      export function Component() {
        return (
          <div>
            <CheckIcon
              className="w-4 h-4"
              onClick={handleClick}
              data-testid="check-icon"
            >
              <span>Child content</span>
            </CheckIcon>
            <Cross2Icon style={{ color: 'red' }} aria-label="Close" />
          </div>
        )
      }`

    expect(
      await migrateIconsFile(input, "radix", "lucide", {
        Check: {
          lucide: "Check",
          radix: "CheckIcon",
        },
        X: {
          lucide: "X",
          radix: "Cross2Icon",
        },
      })
    ).toMatchInlineSnapshot(`
      "import { Check, X } from "lucide-react";

                  export function Component() {
              return (
                <div>
                  <CheckIcon
                    className="w-4 h-4"
                    onClick={handleClick}
                    data-testid="check-icon"
                  >
                    <span>Child content</span>
                  </CheckIcon>
                  <X style={{ color: 'red' }} aria-label="Close" />
                </div>
              )
            }"
    `)
  })
})
