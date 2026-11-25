import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import postcss from "postcss"
import { compile } from "tailwindcss"
import { Node, Project, SyntaxKind } from "ts-morph"
import { describe, expect, it } from "vitest"

const registryDir = dirname(fileURLToPath(import.meta.url))
const project = new Project({ useInMemoryFileSystem: true })

function classNames(file: string, component: string) {
  const source = project.createSourceFile(file, readFileSync(file, "utf8"), {
    overwrite: true,
  })
  const call = source
    .getFunctionOrThrow(component)
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((call) => call.getExpression().getText() === "cn")
  const classes = call?.getArguments()[0]

  if (!classes || !Node.isStringLiteral(classes)) {
    throw new Error(`Missing class names for ${component} in ${file}`)
  }

  return classes.getLiteralValue()
}

async function fontSizes(classes: string, inheritedClasses = "") {
  function utilities(value: string) {
    return value
      .split(/\s+/)
      .filter((value) =>
        /^(?:md:)?text-(?:base|sm|xs)(?:\/relaxed)?$/.test(value)
      )
      .join(" ")
  }
  const field = utilities(classes)
  const wrapper = utilities(inheritedClasses)
  const compiled = await compile(`
    @theme {
      --text-base: 1rem;
      --text-sm: 0.875rem;
      --text-xs: 0.75rem;
      --leading-relaxed: 1.625;
      --breakpoint-md: 48rem;
    }
    #wrapper { ${wrapper ? `@apply ${wrapper};` : ""} }
    .field { ${field ? `@apply ${field};` : ""} }
  `)
  const sizes: Record<string, { mobile?: string; desktop?: string }> = {
    "#wrapper": {},
    ".field": {},
  }

  postcss.parse(compiled.build([])).walkDecls((declaration) => {
    if (declaration.prop !== "font-size") {
      return
    }

    let selector = ""
    let desktop = false
    let parent = declaration.parent
    while (parent && parent.type !== "root") {
      if (parent.type === "rule") {
        selector = parent.selector
      } else if (parent.type === "atrule" && parent.name === "media") {
        desktop = true
      }
      parent = parent.parent
    }

    sizes[selector][desktop ? "desktop" : "mobile"] = declaration.value
  })

  return {
    mobile: sizes[".field"].mobile ?? sizes["#wrapper"].mobile,
    desktop:
      sizes[".field"].desktop ??
      sizes[".field"].mobile ??
      sizes["#wrapper"].desktop ??
      sizes["#wrapper"].mobile,
  }
}

const styles = readdirSync(join(registryDir, "styles")).filter((file) =>
  /^style-.*\.css$/.test(file)
)

describe("ComboboxChipsInput font sizes", () => {
  for (const base of ["base", "radix", "aria"]) {
    for (const style of styles) {
      it(`${base}/${style} matches Input on mobile and desktop`, async () => {
        const baseDir = join(registryDir, "bases", base, "ui")
        const css = postcss.parse(
          readFileSync(join(registryDir, "styles", style), "utf8")
        )
        function styleClasses(selector: string) {
          let classes = ""
          css.walkRules(selector, (rule) => {
            rule.walkAtRules("apply", (rule) => {
              classes += ` ${rule.params}`
            })
          })
          return classes
        }

        const input = await fontSizes(
          `${classNames(join(baseDir, "input.tsx"), "Input")} ${styleClasses(".cn-input")}`
        )
        expect(input.mobile).toBeDefined()
        expect(input.desktop).toBeDefined()
        expect(
          await fontSizes(
            `${classNames(join(baseDir, "combobox.tsx"), "ComboboxChipsInput")} ${styleClasses(".cn-combobox-chip-input")}`,
            `${classNames(join(baseDir, "combobox.tsx"), "ComboboxChips")} ${styleClasses(".cn-combobox-chips")}`
          )
        ).toEqual(input)
      })
    }
  }

  it("new-york-v4 matches Input on mobile and desktop", async () => {
    const uiDir = join(registryDir, "new-york-v4", "ui")
    expect(
      await fontSizes(
        classNames(join(uiDir, "combobox.tsx"), "ComboboxChipsInput"),
        classNames(join(uiDir, "combobox.tsx"), "ComboboxChips")
      )
    ).toEqual(await fontSizes(classNames(join(uiDir, "input.tsx"), "Input")))
  })
})
