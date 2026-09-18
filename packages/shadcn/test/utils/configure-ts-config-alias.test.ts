import path from "path"
import fs from "fs-extra"
import { afterEach, describe, expect, test } from "vitest"

import { configureTsConfigAlias } from "../../src/utils/get-project-info"

const tmpDirs: string[] = []

async function createTmpDir() {
  const dir = path.resolve(
    __dirname,
    `../fixtures/.tmp-alias-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )
  await fs.ensureDir(dir)
  tmpDirs.push(dir)
  return dir
}

afterEach(async () => {
  for (const dir of tmpDirs) {
    await fs.remove(dir)
  }
  tmpDirs.length = 0
})

describe("configureTsConfigAlias", () => {
  test("adds alias to tsconfig.json with references only", async () => {
    const cwd = await createTmpDir()
    await fs.ensureDir(path.resolve(cwd, "src"))

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      JSON.stringify(
        {
          files: [],
          references: [
            { path: "./tsconfig.app.json" },
            { path: "./tsconfig.node.json" },
          ],
        },
        null,
        2
      )
    )

    const result = await configureTsConfigAlias(cwd, true)

    expect(result).toBe("@")

    const tsconfig = await fs.readJSON(path.resolve(cwd, "tsconfig.json"))
    expect(tsconfig.compilerOptions.baseUrl).toBe(".")
    expect(tsconfig.compilerOptions.paths).toEqual({ "@/*": ["./src/*"] })
    expect(tsconfig.files).toEqual([])
    expect(tsconfig.references).toHaveLength(2)
  })

  test("updates both tsconfig.json and tsconfig.app.json", async () => {
    const cwd = await createTmpDir()
    await fs.ensureDir(path.resolve(cwd, "src"))

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      JSON.stringify(
        {
          files: [],
          references: [{ path: "./tsconfig.app.json" }],
        },
        null,
        2
      )
    )

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.app.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            module: "ESNext",
          },
          include: ["src"],
        },
        null,
        2
      )
    )

    const result = await configureTsConfigAlias(cwd, true)

    expect(result).toBe("@")

    const tsconfig = await fs.readJSON(path.resolve(cwd, "tsconfig.json"))
    expect(tsconfig.compilerOptions.baseUrl).toBe(".")
    expect(tsconfig.compilerOptions.paths).toEqual({ "@/*": ["./src/*"] })

    const tsconfigApp = await fs.readJSON(
      path.resolve(cwd, "tsconfig.app.json")
    )
    expect(tsconfigApp.compilerOptions.baseUrl).toBe(".")
    expect(tsconfigApp.compilerOptions.paths).toEqual({ "@/*": ["./src/*"] })
    expect(tsconfigApp.compilerOptions.target).toBe("ES2020")
    expect(tsconfigApp.include).toEqual(["src"])
  })

  test("uses ./* when isSrcDir is false", async () => {
    const cwd = await createTmpDir()

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      JSON.stringify({ compilerOptions: {} }, null, 2)
    )

    const result = await configureTsConfigAlias(cwd, false)

    expect(result).toBe("@")

    const tsconfig = await fs.readJSON(path.resolve(cwd, "tsconfig.json"))
    expect(tsconfig.compilerOptions.paths).toEqual({ "@/*": ["./*"] })
  })

  test("does not clobber existing paths", async () => {
    const cwd = await createTmpDir()
    await fs.ensureDir(path.resolve(cwd, "src"))

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: ".",
            paths: { "~/*": ["./lib/*"] },
          },
        },
        null,
        2
      )
    )

    await configureTsConfigAlias(cwd, true)

    const tsconfig = await fs.readJSON(path.resolve(cwd, "tsconfig.json"))
    expect(tsconfig.compilerOptions.paths["~/*"]).toEqual(["./lib/*"])
    expect(tsconfig.compilerOptions.paths["@/*"]).toEqual(["./src/*"])
  })

  test("handles stock Vite tsconfig.app.json with block comments", async () => {
    const cwd = await createTmpDir()
    await fs.ensureDir(path.resolve(cwd, "src"))

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      JSON.stringify(
        {
          files: [],
          references: [
            { path: "./tsconfig.app.json" },
            { path: "./tsconfig.node.json" },
          ],
        },
        null,
        2
      )
    )

    // Exact content from `npm create vite@latest --template react-ts`
    await fs.writeFile(
      path.resolve(cwd, "tsconfig.app.json"),
      `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
`
    )

    const result = await configureTsConfigAlias(cwd, true)

    expect(result).toBe("@")

    const tsconfigApp = await fs.readJSON(
      path.resolve(cwd, "tsconfig.app.json")
    )
    expect(tsconfigApp.compilerOptions.baseUrl).toBe(".")
    expect(tsconfigApp.compilerOptions.paths).toEqual({ "@/*": ["./src/*"] })
    expect(tsconfigApp.compilerOptions.target).toBe("ES2023")
    expect(tsconfigApp.compilerOptions.moduleResolution).toBe("bundler")
    expect(tsconfigApp.compilerOptions.jsx).toBe("react-jsx")
  })

  test("handles block comments in tsconfig.json", async () => {
    const cwd = await createTmpDir()
    await fs.ensureDir(path.resolve(cwd, "src"))

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      `{
  /* Project references */
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
`
    )

    const result = await configureTsConfigAlias(cwd, true)

    expect(result).toBe("@")

    const tsconfig = await fs.readJSON(path.resolve(cwd, "tsconfig.json"))
    expect(tsconfig.compilerOptions.baseUrl).toBe(".")
    expect(tsconfig.compilerOptions.paths).toEqual({ "@/*": ["./src/*"] })
  })

  test("returns null on malformed json", async () => {
    const cwd = await createTmpDir()

    await fs.writeFile(
      path.resolve(cwd, "tsconfig.json"),
      "{ this is not valid json }"
    )

    const result = await configureTsConfigAlias(cwd, true)

    expect(result).toBeNull()
  })
})
