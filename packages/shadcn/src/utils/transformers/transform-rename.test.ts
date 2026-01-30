import { type Config } from "@/src/utils/get-config"
import {
  createRenameMapFromComponentName,
  transformRename,
} from "@/src/utils/transformers/transform-rename"
import { describe, expect, test } from "vitest"

import { transform } from "."

const testConfig: Config = {
  style: "new-york",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "tailwind.config.ts",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/",
    components: "/components",
    utils: "/lib/utils",
    ui: "/ui",
    lib: "/lib",
    hooks: "/hooks",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "tailwind.css",
  },
}

describe("transformRename", () => {
  describe("basic function renaming", () => {
    test("renames base component function", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function Dialog() {
  return <div>Dialog</div>
}`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "function Modal() {
          return <div>Dialog</div>
        }"
      `)
    })

    test("renames compound component functions", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function Dialog() {}
function DialogTitle() {}
function DialogContent() {}
function DialogFooter() {}`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "function Modal() {}
        function ModalTitle() {}
        function ModalContent() {}
        function ModalFooter() {}"
      `)
    })
  })

  describe("variable declarations", () => {
    test("renames const component declarations", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `const Dialog = () => <div />
const DialogTitle = () => <h1 />`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "const Modal = () => <div />
        const ModalTitle = () => <h1 />"
      `)
    })
  })

  describe("type aliases", () => {
    test("renames type aliases", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `type DialogProps = { open: boolean }
type DialogTitleProps = { children: string }`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "type ModalProps = { open: boolean }
        type ModalTitleProps = { children: string }"
      `)
    })
  })

  describe("interfaces", () => {
    test("renames interfaces", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `interface DialogProps {
  open: boolean
}
interface DialogContentProps {
  children: React.ReactNode
}`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "interface ModalProps {
          open: boolean
        }
        interface ModalContentProps {
          children: React.ReactNode
        }"
      `)
    })
  })

  describe("exports", () => {
    test("renames named exports", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function Dialog() {}
function DialogTitle() {}

export { Dialog, DialogTitle }`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "function Modal() {}
        function ModalTitle() {}

        export { Modal, ModalTitle }"
      `)
    })

    test("renames export aliases", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function MyDialog() {}

export { MyDialog as Dialog }`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "function MyDialog() {}

        export { MyDialog as Modal }"
      `)
    })
  })

  describe("no rename when map is empty", () => {
    test("returns unchanged source when renameMap is undefined", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function Dialog() {}`,
            config: testConfig,
            renameMap: undefined,
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`"function Dialog() {}"`)
    })

    test("returns unchanged source when renameMap is empty", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function Dialog() {}`,
            config: testConfig,
            renameMap: {},
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`"function Dialog() {}"`)
    })
  })

  describe("does not rename non-matching names", () => {
    test("preserves names that do not start with the base", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `function Dialog() {}
function DialogTitle() {}
function Button() {}
function useDialog() {}`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "function Modal() {}
        function ModalTitle() {}
        function Button() {}
        function useDialog() {}"
      `)
    })
  })

  describe("full component file", () => {
    test("renames all occurrences in a realistic component file", async () => {
      expect(
        await transform(
          {
            filename: "dialog.tsx",
            raw: `import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />
}

function DialogContent({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return <DialogPrimitive.Content {...props}>{children}</DialogPrimitive.Content>
}

export { Dialog, DialogTrigger, DialogContent }`,
            config: testConfig,
            renameMap: { Dialog: "Modal" },
          },
          [transformRename]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import * as DialogPrimitive from "@radix-ui/react-dialog"

        function Modal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
          return <DialogPrimitive.Root {...props} />
        }

        function ModalTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
          return <DialogPrimitive.Trigger {...props} />
        }

        function ModalContent({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
          return <DialogPrimitive.Content {...props}>{children}</DialogPrimitive.Content>
        }

        export { Modal, ModalTrigger, ModalContent }"
      `)
    })
  })
})

describe("createRenameMapFromComponentName", () => {
  test("converts lowercase to PascalCase", () => {
    expect(createRenameMapFromComponentName("dialog", "modal")).toEqual({
      Dialog: "Modal",
    })
  })

  test("converts kebab-case to PascalCase", () => {
    expect(
      createRenameMapFromComponentName("date-picker", "calendar-picker")
    ).toEqual({
      DatePicker: "CalendarPicker",
    })
  })

  test("converts snake_case to PascalCase", () => {
    expect(
      createRenameMapFromComponentName("date_picker", "calendar_picker")
    ).toEqual({
      DatePicker: "CalendarPicker",
    })
  })

  test("handles already PascalCase input", () => {
    expect(createRenameMapFromComponentName("Dialog", "Modal")).toEqual({
      Dialog: "Modal",
    })
  })

  test("handles mixed case input", () => {
    expect(createRenameMapFromComponentName("myDialog", "myModal")).toEqual({
      Mydialog: "Mymodal",
    })
  })
})
