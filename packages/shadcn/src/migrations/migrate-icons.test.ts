import { describe, expect, it } from "vitest"

import { migrateIconsFile, migrateIconsFileWithReport } from "./migrate-icons"

// A mapping fixture with full cross-library coverage.
const FULL_MAPPING = {
  Check: {
    lucide: "Check",
    radix: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick02Icon",
    phosphor: "CheckIcon",
    remixicon: "RiCheckLine",
  },
  ChevronDown: {
    lucide: "ChevronDown",
    radix: "ChevronDownIcon",
    tabler: "IconChevronDown",
    hugeicons: "ArrowDown01Icon",
    phosphor: "CaretDownIcon",
    remixicon: "RiArrowDownSLine",
  },
}

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
                  <Check
                    className="w-4 h-4"
                    onClick={handleClick}
                    data-testid="check-icon"
                  >
                    <span>Child content</span>
                  </Check>
                  <X style={{ color: 'red' }} aria-label="Close" />
                </div>
              )
            }"
    `)
  })

  it("should leave unmapped icons untouched", async () => {
    const input = `
      import { CheckIcon, MagicWandIcon } from "@radix-ui/react-icons"

      export function Component() {
        return (
          <div>
            <CheckIcon />
            <MagicWandIcon />
          </div>
        )
      }`

    expect(
      await migrateIconsFile(input, "radix", "lucide", {
        Check: {
          lucide: "Check",
          radix: "CheckIcon",
        },
      })
    ).toMatchInlineSnapshot(`
      "import { MagicWandIcon } from "@radix-ui/react-icons"
      import { Check } from "lucide-react";

            export function Component() {
              return (
                <div>
                  <Check />
                  <MagicWandIcon />
                </div>
              )
            }"
    `)
  })

  it("should migrate from lucide to radix", async () => {
    const input = `
      import { Check, X } from "lucide-react"

      export function Component() {
        return (
          <div>
            <Check className="size-4" />
            <X />
          </div>
        )
      }`

    expect(
      await migrateIconsFile(input, "lucide", "radix", {
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
      "import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

                  export function Component() {
              return (
                <div>
                  <CheckIcon className="size-4" />
                  <Cross2Icon />
                </div>
              )
            }"
    `)
  })

  it("should handle aliased imports", async () => {
    const input = `
      import { CheckIcon as Check } from "@radix-ui/react-icons"

      export function Component() {
        return <Check />
      }`

    expect(
      await migrateIconsFile(input, "radix", "lucide", {
        Check: {
          lucide: "Check",
          radix: "CheckIcon",
        },
      })
    ).toMatchInlineSnapshot(`
      "import { Check } from "lucide-react";

                  export function Component() {
              return <Check />
            }"
    `)
  })

  it("should handle icons used as prop references", async () => {
    const input = `
      import { CheckIcon } from "@radix-ui/react-icons"

      export function Component() {
        return <Button icon={CheckIcon} />
      }`

    expect(
      await migrateIconsFile(input, "radix", "lucide", {
        Check: {
          lucide: "Check",
          radix: "CheckIcon",
        },
      })
    ).toMatchInlineSnapshot(`
      "import { Check } from "lucide-react";

                  export function Component() {
              return <Button icon={Check} />
            }"
    `)
  })
})

describe("migrateIconsFile (cross-library)", () => {
  it("should migrate from lucide to tabler", async () => {
    const input = `
      import { Check, ChevronDown } from "lucide-react"

      export function Component() {
        return (
          <div>
            <Check className="size-4" />
            <ChevronDown />
          </div>
        )
      }`

    expect(await migrateIconsFile(input, "lucide", "tabler", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { IconCheck, IconChevronDown } from "@tabler/icons-react";

                  export function Component() {
              return (
                <div>
                  <IconCheck className="size-4" />
                  <IconChevronDown />
                </div>
              )
            }"
    `)
  })

  it("should migrate lucide suffixed aliases (CheckIcon)", async () => {
    const input = `
      import { CheckIcon } from "lucide-react"

      export function Component() {
        return <CheckIcon className="size-4" />
      }`

    expect(await migrateIconsFile(input, "lucide", "remixicon", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { RiCheckLine } from "@remixicon/react";

                  export function Component() {
              return <RiCheckLine className="size-4" />
            }"
    `)
  })

  it("should migrate from lucide to hugeicons (wrapper target)", async () => {
    const input = `
      import { Check, ChevronDown } from "lucide-react"

      export function Component() {
        return (
          <div>
            <Check className="size-4" />
            <ChevronDown />
          </div>
        )
      }`

    expect(await migrateIconsFile(input, "lucide", "hugeicons", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { HugeiconsIcon } from "@hugeicons/react";
      import { Tick02Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

                  export function Component() {
              return (
                <div>
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
                  <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
                </div>
              )
            }"
    `)
  })

  it("should migrate from hugeicons to lucide (wrapper source)", async () => {
    const input = `
      import { HugeiconsIcon } from "@hugeicons/react"
      import { Tick02Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"

      export function Component() {
        return (
          <div>
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={1.5} />
          </div>
        )
      }`

    expect(await migrateIconsFile(input, "hugeicons", "lucide", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { Check, ChevronDown } from "lucide-react";

                  export function Component() {
              return (
                <div>
                  <Check className="size-4" />
                  <ChevronDown strokeWidth={1.5} />
                </div>
              )
            }"
    `)
  })

  it("should migrate from lucide to phosphor with default props", async () => {
    const input = `
      import { Check } from "lucide-react"

      export function Component() {
        return <Check className="size-4" strokeWidth={3} />
      }`

    expect(await migrateIconsFile(input, "lucide", "phosphor", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { CheckIcon } from "@phosphor-icons/react";

                  export function Component() {
              return <CheckIcon className="size-4" strokeWidth={3} />
            }"
    `)
  })

  it("should migrate from phosphor to lucide stripping template defaults", async () => {
    const input = `
      import { CheckIcon, CaretDownIcon } from "@phosphor-icons/react"

      export function Component() {
        return (
          <div>
            <CheckIcon strokeWidth={2} className="size-4" />
            <CaretDownIcon strokeWidth={3} />
          </div>
        )
      }`

    expect(await migrateIconsFile(input, "phosphor", "lucide", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { Check, ChevronDown } from "lucide-react";

                  export function Component() {
              return (
                <div>
                  <Check className="size-4" />
                  <ChevronDown strokeWidth={3} />
                </div>
              )
            }"
    `)
  })

  it("should migrate from radix to phosphor via the canonical name", async () => {
    const input = `
      import { CheckIcon } from "@radix-ui/react-icons"

      export function Component() {
        return <CheckIcon />
      }`

    expect(await migrateIconsFile(input, "radix", "phosphor", FULL_MAPPING))
      .toMatchInlineSnapshot(`
      "import { CheckIcon } from "@phosphor-icons/react";

                  export function Component() {
              return <CheckIcon strokeWidth={2} />
            }"
    `)
  })

  it("should ignore type-only imports", async () => {
    const input = `
      import { Check, type LucideIcon } from "lucide-react"

      export function Component({ icon }: { icon: LucideIcon }) {
        return <Check />
      }`

    expect(
      await migrateIconsFileWithReport(input, "lucide", "tabler", FULL_MAPPING)
    ).toMatchInlineSnapshot(`
        {
          "content": "import { type LucideIcon } from "lucide-react"
        import { IconCheck } from "@tabler/icons-react";

              export function Component({ icon }: { icon: LucideIcon }) {
                return <IconCheck />
              }",
          "skipped": [],
        }
      `)
  })

  it("should report skipped icons", async () => {
    const input = `
      import { Check, Banana } from "lucide-react"

      export function Component() {
        return (
          <div>
            <Check>
              <title>Done</title>
            </Check>
            <Banana />
          </div>
        )
      }`

    const result = await migrateIconsFileWithReport(
      input,
      "lucide",
      "hugeicons",
      FULL_MAPPING
    )

    expect(result.skipped).toMatchInlineSnapshot(`
      [
        {
          "icon": "Check",
          "reason": "cannot be wrapped in <HugeiconsIcon />",
        },
        {
          "icon": "Banana",
          "reason": "no HugeIcons equivalent found",
        },
      ]
    `)
    expect(result.content).toMatchInlineSnapshot(`
      "import { Check, Banana } from "lucide-react"

            export function Component() {
              return (
                <div>
                  <Check>
                    <title>Done</title>
                  </Check>
                  <Banana />
                </div>
              )
            }"
    `)
  })
})
