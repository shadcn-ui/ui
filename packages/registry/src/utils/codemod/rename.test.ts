import { transformFromAstSync } from "@babel/core"
import { describe, expect, it } from "vitest"

import { parseModule } from "./parse"
import { renameVariable } from "./rename"

describe("renameVariable", () => {
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
