import { transformFromAstSync } from "@babel/core"
import { describe, expect, it } from "vitest"

import { parseModule } from "./parse"
import { renameVariable } from "./rename"

function renameToInter(code: string) {
  return renameVariable(code, code.indexOf("const ") + "const ".length, "inter")
}

describe("renameVariable", () => {
  it("renames references, shorthand properties and exports", () => {
    expect(
      renameToInter(`const roboto = Roboto()
const fonts = { roboto, variable: roboto.variable }
export { roboto }
type Font = typeof roboto
`)
    ).toMatchInlineSnapshot(`
      "const inter = Roboto()
      const fonts = { inter, variable: inter.variable }
      export { inter }
      type Font = typeof inter
      "
    `)
  })

  it("leaves a shadowing binding and a redeclaration as they are", () => {
    expect(
      renameToInter(`const roboto = Roboto()
function getFont(roboto) {
  return roboto
}
const roboto = 1
`)
    ).toMatchInlineSnapshot(`
      "const inter = Roboto()
      function getFont(roboto) {
        return roboto
      }
      const roboto = 1
      "
    `)
  })

  it("leaves #private names and property names as they are", () => {
    expect(
      renameToInter(`const roboto = Roboto()
class Fonts {
  #roboto = 1
  roboto() {
    return this.#roboto
  }
}
const fonts = { roboto: 1, [roboto]: 2 }
fonts.roboto
fonts[roboto]
`)
    ).toMatchInlineSnapshot(`
      "const inter = Roboto()
      class Fonts {
        #roboto = 1
        roboto() {
          return this.#roboto
        }
      }
      const fonts = { roboto: 1, [inter]: 2 }
      fonts.roboto
      fonts[inter]
      "
    `)
  })

  it("renames a capitalized JSX tag, but not an intrinsic one", () => {
    const code = `const Roboto = Font()
const a = <Roboto />
const b = <Roboto.Item roboto={Roboto}></Roboto.Item>
`
    expect(renameVariable(code, code.indexOf("Roboto"), "Inter"))
      .toMatchInlineSnapshot(`
        "const Inter = Font()
        const a = <Inter />
        const b = <Inter.Item roboto={Inter}></Inter.Item>
        "
      `)
    expect(
      renameToInter(`const roboto = Font()
const a = <roboto />
const b = <roboto:x roboto:y="1" />
`)
    ).toMatchInlineSnapshot(`
      "const inter = Font()
      const a = <roboto />
      const b = <roboto:x roboto:y="1" />
      "
    `)
  })

  it("throws like ts-morph for a destructured declaration", () => {
    expect(() => renameToInter(`const { roboto } = Roboto()\n`)).toThrow(
      "Not implemented renameable scenario for ObjectBindingPattern."
    )
    expect(() => renameToInter(`const [roboto] = Roboto()\n`)).toThrow(
      "Not implemented renameable scenario for ArrayBindingPattern."
    )
  })

  it("turns Babel's redeclaration check back on after renaming", () => {
    const code = `import { cn } from "@/lib/utils"
import { cn } from "@/lib/utils"

const inter = Inter()
export { inter }
`

    expect(renameVariable(code, code.indexOf("inter"), "geist"))
      .toMatchInlineSnapshot(`
        "import { cn } from "@/lib/utils"
        import { cn } from "@/lib/utils"

        const geist = Inter()
        export { geist }
        "
      `)
    expect(() =>
      transformFromAstSync(parseModule(code), code, {
        babelrc: false,
        configFile: false,
      })
    ).toThrow(/Duplicate declaration "cn"/)
  })
})
