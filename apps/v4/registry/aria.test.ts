import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { ui } from "./bases/aria/ui/_registry"

const REGISTRY_DIR = dirname(fileURLToPath(import.meta.url))
const APP_DIR = resolve(REGISTRY_DIR, "..")

function readAppFile(path: string) {
  return readFileSync(resolve(APP_DIR, path), "utf8")
}

function getRegistryItem(name: string) {
  const item = ui.find((item) => item.name === name)
  expect(item).toBeDefined()
  return item!
}

describe("aria registry metadata", () => {
  it("publishes documentation links for every UI item", () => {
    for (const item of ui) {
      expect(item.meta?.links?.docs).toBe(
        `https://ui.shadcn.com/docs/components/aria/${item.name}`
      )
    }
  })

  it("declares complete install dependencies", () => {
    expect(getRegistryItem("calendar")).toMatchObject({
      registryDependencies: ["button", "select"],
    })
    expect(getRegistryItem("calendar").dependencies).toBeUndefined()
    expect(getRegistryItem("select").registryDependencies).toEqual([
      "input-group",
    ])
    expect(getRegistryItem("chart").dependencies).toEqual(["recharts@3.8.0"])
  })
})

describe("aria component contracts", () => {
  it("keeps Calendar and preview blocks within the Aria base", () => {
    expect(readAppFile("registry/bases/aria/ui/calendar.tsx")).not.toContain(
      "@/styles/"
    )
    expect(
      readAppFile(
        "registry/bases/aria/blocks/preview/cards/weekly-fitness-summary.tsx"
      )
    ).not.toContain("@/registry/bases/base/")
  })

  it("forwards SelectContent positioning props", () => {
    const source = readAppFile("registry/bases/aria/ui/select.tsx")
    const selectContent = source.slice(
      source.indexOf("function SelectContent"),
      source.indexOf("function SelectPopover")
    )

    for (const prop of [
      "className",
      "side",
      "sideOffset",
      "align",
      "alignOffset",
    ]) {
      expect(selectContent).toContain(`${prop}={${prop}}`)
    }
  })

  it("composes primitive render props and children", () => {
    expect(readAppFile("registry/bases/aria/ui/breadcrumb.tsx")).toContain(
      "render={render}"
    )

    for (const component of ["checkbox", "radio-group", "switch"]) {
      expect(readAppFile(`registry/bases/aria/ui/${component}.tsx`)).toMatch(
        /composeRenderProps\(\s*children,/
      )
    }
  })

  it("preserves expected dialog dismissal behavior", () => {
    const dialog = readAppFile("registry/bases/aria/ui/dialog.tsx")
    const alertDialog = readAppFile("registry/bases/aria/ui/alert-dialog.tsx")
    const action = alertDialog.slice(
      alertDialog.indexOf("function AlertDialogAction"),
      alertDialog.indexOf("function AlertDialogCancel")
    )

    expect(dialog).toContain("isDismissable = true")
    expect(action).toContain('slot="close"')
  })

  it("renders Spinner as the slotted SVG icon", () => {
    const spinner = readAppFile("registry/bases/aria/ui/spinner.tsx")

    expect(spinner).toContain('data-slot="spinner"')
    expect(spinner).toContain('React.ComponentProps<"svg">')
    expect(spinner).not.toContain("ProgressBar")
  })
})

describe("aria docs and preview integration", () => {
  it("redirects the Aria Form route", () => {
    const config = readAppFile("next.config.mjs")

    expect(config).toContain('source: "/docs/components/aria/form"')
    expect(config).toContain('destination: "/docs/forms"')
  })

  it("uses the selected preview language as the React Aria locale", () => {
    const preview = readAppFile("components/component-preview-tabs.tsx")

    expect(preview).toContain("translation.locale ?? translation.language")
  })
})
