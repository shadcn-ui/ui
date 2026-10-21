import { readdirSync, readFileSync } from "fs"
import path from "path"
import type { Config } from "@/src/get-config"
import { beforeEach, describe, expect, test } from "vitest"

import { transform, type Transformer, type TransformOpts } from "."
import stone from "../../test/fixtures/colors/stone.json"
import { transformAsChild } from "./transform-aschild"
import { transformCleanup } from "./transform-cleanup"
import { transformCssVars } from "./transform-css-vars"
import { transformFont } from "./transform-font"
import { transformIcons } from "./transform-icons"
import { transformImport } from "./transform-import"
import { transformMenu } from "./transform-menu"
import { transformNext } from "./transform-next"
import { transformRsc } from "./transform-rsc"
import { transformRtl } from "./transform-rtl"
import { transformTwPrefixes } from "./transform-tw-prefix"

// Golden corpus: pins the exact output of every transformer, and of the
// transformer chains the CLI runs, on frozen real-world inputs. The inputs in
// test/fixtures/transform-corpus are copies of registry payloads (radix-nova,
// base-nova, new-york-v4) plus hand-written third-party files. Never edit them:
// change the output only on purpose, and review the snapshot diff.
//
// Each snapshot is a line diff from the input, so it pins the output exactly
// and shows what the transform changed.

const CORPUS_DIR = path.resolve(
  __dirname,
  "../../test/fixtures/transform-corpus"
)
const TAILWIND_V4_PROJECT = path.resolve(
  __dirname,
  "../../test/fixtures/vite-with-tailwind"
)

const FIXTURES = readdirSync(CORPUS_DIR)
  .filter((file) => /\.tsx?$/.test(file))
  .sort()
  .map((file) => ({
    name: file,
    // radix-nova--dialog.tsx -> dialog.tsx
    filename: file.split("--")[1],
    raw: readFileSync(path.join(CORPUS_DIR, file), "utf8"),
  }))

type Case = {
  config: Config
  options?: Pick<
    TransformOpts,
    "baseColor" | "isRemote" | "supportedFontMarkers"
  >
}

function createConfig(overrides: {
  style: string
  tsx?: boolean
  rsc?: boolean
  iconLibrary: string
  menuColor?: Config["menuColor"]
  rtl?: boolean
  tailwind?: Partial<Config["tailwind"]>
  aliases: Config["aliases"]
  cwd?: string
}) {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: overrides.style,
    tsx: overrides.tsx ?? true,
    rsc: overrides.rsc ?? true,
    iconLibrary: overrides.iconLibrary,
    menuColor: overrides.menuColor,
    rtl: overrides.rtl ?? false,
    tailwind: {
      config: "",
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
      ...overrides.tailwind,
    },
    aliases: overrides.aliases,
    resolvedPaths: {
      cwd: overrides.cwd ?? "",
      tailwindConfig: "",
      tailwindCss: "",
      utils: "",
      components: "",
      lib: "",
      hooks: "",
      ui: "",
    },
  } as Config
}

const CASES = {
  // Defaults: radix, RSC, lucide, CSS variables, standard aliases.
  radix: {
    config: createConfig({
      style: "radix-nova",
      iconLibrary: "lucide",
      menuColor: "default",
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    }),
  },
  // Base UI, no RSC, RTL, inverted menus, custom aliases, font markers supported.
  base: {
    config: createConfig({
      style: "base-nova",
      rsc: false,
      iconLibrary: "tabler",
      menuColor: "inverted",
      rtl: true,
      aliases: {
        components: "~/components",
        utils: "~/lib/utils",
        ui: "~/components/ui",
        lib: "~/lib",
        hooks: "~/hooks",
      },
    }),
    options: { supportedFontMarkers: ["cn-font-heading"] },
  },
  // Tailwind v4 prefix, translucent menus.
  "prefix-v4": {
    config: createConfig({
      style: "base-nova",
      iconLibrary: "hugeicons",
      menuColor: "default-translucent",
      tailwind: { prefix: "tw" },
      cwd: TAILWIND_V4_PROJECT,
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    }),
  },
  // Tailwind v3 prefix, inlined colors (no CSS variables), RTL.
  "prefix-v3": {
    config: createConfig({
      style: "radix-nova",
      rsc: false,
      iconLibrary: "phosphor",
      menuColor: "inverted-translucent",
      rtl: true,
      tailwind: {
        config: "tailwind.config.js",
        prefix: "tw-",
        cssVariables: false,
        baseColor: "stone",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    }),
    options: { baseColor: stone },
  },
  // JavaScript output, monorepo aliases, remote registry item.
  jsx: {
    config: createConfig({
      style: "base-lyra",
      tsx: false,
      rsc: false,
      iconLibrary: "remixicon",
      aliases: {
        components: "@workspace/ui/components",
        utils: "@workspace/ui/lib/utils",
        ui: "@workspace/ui/components",
        lib: "@workspace/ui/lib",
        hooks: "@workspace/ui/hooks",
      },
    }),
    options: { isRemote: true },
  },
  // Package imports (#) aliases, RTL.
  imports: {
    config: createConfig({
      style: "radix-nova",
      iconLibrary: "lucide",
      rtl: true,
      aliases: {
        components: "#components",
        utils: "#lib/utils",
        ui: "#components/ui",
        lib: "#lib",
        hooks: "#hooks",
      },
    }),
  },
} satisfies Record<string, Case>

type CaseName = keyof typeof CASES

// Chains, in the order the callers run them.
function installChain(fixture: string): Transformer[] {
  // updateFiles in update-files.ts. transformNext only runs for a root
  // middleware file in a Next.js 16+ project.
  return [
    transformImport,
    transformRsc,
    transformCssVars,
    transformTwPrefixes,
    transformIcons,
    transformMenu,
    transformAsChild,
    transformRtl,
    ...(fixture.endsWith("middleware.ts") ? [transformNext] : []),
    transformFont,
    transformCleanup,
  ]
}

// Each transformer on its own, with the cases where it does something.
const SINGLE: [string, Transformer, CaseName[]][] = [
  ["transformImport", transformImport, ["radix", "jsx", "imports"]],
  ["transformRsc", transformRsc, ["base"]],
  ["transformCssVars", transformCssVars, ["prefix-v3"]],
  ["transformTwPrefixes", transformTwPrefixes, ["prefix-v4", "prefix-v3"]],
  [
    "transformIcons",
    transformIcons,
    ["radix", "base", "prefix-v4", "prefix-v3", "jsx"],
  ],
  ["transformMenu", transformMenu, ["radix", "base", "prefix-v4", "prefix-v3"]],
  ["transformAsChild", transformAsChild, ["base"]],
  ["transformRtl", transformRtl, ["base"]],
  ["transformNext", transformNext, ["radix"]],
  ["transformFont", transformFont, ["radix", "base"]],
  ["transformCleanup", transformCleanup, ["radix"]],
]

async function run(
  fixture: (typeof FIXTURES)[number],
  caseName: CaseName,
  transformers?: Transformer[],
  transformJsx?: boolean
) {
  const { config, options } = CASES[caseName] as Case
  return transform(
    {
      filename: fixture.filename,
      raw: fixture.raw,
      config,
      transformJsx,
      ...options,
    },
    transformers
  )
}

// transformRsc tests "use client" with a module-level /g regex, so a match
// leaves state behind for the next call. A non-matching directive resets it,
// which keeps every test independent of the ones before it.
async function resetRscDirectiveState() {
  await transform(
    { filename: "reset.tsx", raw: `"use foo"\n`, config: {} as Config },
    [transformRsc]
  )
}

// Line diff (LCS) from input to output. "(unchanged)" when identical.
function lineDiff(before: string, after: string) {
  if (before === after) {
    return "(unchanged)"
  }

  const a = before.split("\n")
  const b = after.split("\n")
  const lcs = Array.from(
    { length: a.length + 1 },
    () => new Uint32Array(b.length + 1)
  )
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const out: string[] = []
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      i++
      j++
      continue
    }

    const start = [i + 1, j + 1]
    const removed: string[] = []
    const added: string[] = []
    while (
      (i < a.length || j < b.length) &&
      !(i < a.length && j < b.length && a[i] === b[j])
    ) {
      if (j < b.length && (i === a.length || lcs[i][j + 1] >= lcs[i + 1][j])) {
        added.push(b[j++])
      } else {
        removed.push(a[i++])
      }
    }
    out.push(
      `@@ -${start[0]} +${start[1]} @@`,
      ...removed.map((line) => `- ${line}`),
      ...added.map((line) => `+ ${line}`)
    )
  }

  return out.join("\n")
}

beforeEach(async () => {
  await resetRscDirectiveState()
})

describe("no transformers", () => {
  for (const fixture of FIXTURES) {
    test(fixture.name, async () => {
      expect(
        lineDiff(fixture.raw, await run(fixture, "radix", []))
      ).toMatchSnapshot()
    })
  }
})

for (const [name, transformer, caseNames] of SINGLE) {
  for (const caseName of caseNames) {
    describe(`${name} (${caseName})`, () => {
      for (const fixture of FIXTURES) {
        test(fixture.name, async () => {
          expect(
            lineDiff(fixture.raw, await run(fixture, caseName, [transformer]))
          ).toMatchSnapshot()
        })
      }
    })
  }
}

describe("transformJsx (jsx)", () => {
  for (const fixture of FIXTURES) {
    test(fixture.name, async () => {
      expect(
        lineDiff(fixture.raw, await run(fixture, "jsx", [], true))
      ).toMatchSnapshot()
    })
  }
})

for (const caseName of Object.keys(CASES) as CaseName[]) {
  describe(`install chain (${caseName})`, () => {
    for (const fixture of FIXTURES) {
      test(fixture.name, async () => {
        const { config } = CASES[caseName] as Case
        expect(
          lineDiff(
            fixture.raw,
            await run(
              fixture,
              caseName,
              installChain(fixture.name),
              !config.tsx
            )
          )
        ).toMatchSnapshot()
      })
    }
  })
}

for (const caseName of ["radix", "base"] as CaseName[]) {
  describe(`default chain (${caseName})`, () => {
    for (const fixture of FIXTURES) {
      test(fixture.name, async () => {
        expect(
          lineDiff(fixture.raw, await run(fixture, caseName))
        ).toMatchSnapshot()
      })
    }
  })
}
