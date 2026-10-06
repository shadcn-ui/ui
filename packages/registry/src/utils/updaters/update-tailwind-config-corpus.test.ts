import { readdirSync, readFileSync } from "fs"
import path from "path"
import { registryItemTailwindSchema } from "@/src/registry/schema"
import { countSyntaxErrors } from "@/src/utils/codemod/parse"
import type { Config } from "@/src/utils/get-config"
import { describe, expect, test } from "vitest"

import {
  transformTailwindConfig,
  type UpdaterTailwindConfig,
} from "./update-tailwind-config"

// Golden corpus: pins the exact output of the tailwind.config editor on frozen
// configs. The inputs in test/fixtures/tailwind-config-corpus are
// create-next-app templates (13 to 15), other starters' configs, configs that
// `shadcn init` already edited, the configs this repo used to have, and
// hand-written edge cases. The broken-- ones are those the editor breaks or
// throws on today. The values are copies of the tailwind.config payloads the
// CLI passes to the editor. Never edit them: change the output only on
// purpose, and review the snapshot diff.
//
// Each snapshot is a line diff from the input, so it pins the output exactly
// and shows what the editor changed. Inputs it throws on pin the error.
// Outputs with more syntax errors than their input, counted by Babel, say so
// on their first line.

const CORPUS_DIR = path.resolve(
  __dirname,
  "../../../test/fixtures/tailwind-config-corpus"
)

const FIXTURES = readdirSync(CORPUS_DIR)
  .filter((file) => /\.[cm]?[jt]s$/.test(file))
  .sort()
  .map((file) => ({
    name: file,
    raw: readFileSync(path.join(CORPUS_DIR, file), "utf8"),
  }))

// The editor parses a .ts config as TypeScript and anything else as
// JavaScript, so each fixture keeps its extension here.
function configFor(fixtureName: string) {
  return {
    resolvedPaths: {
      tailwindConfig: `tailwind.config${path.extname(fixtureName)}`,
    },
  } as Config
}

function readValue(name: string) {
  return registryItemTailwindSchema.parse({
    config: JSON.parse(
      readFileSync(path.join(CORPUS_DIR, "values", `${name}.json`), "utf8")
    ),
  }).config!
}

const VALUE_SETS = {
  // The tailwind.config of the new-york and default registry items that have
  // one: the style index (also the style item), accordion and sidebar.
  index: readValue("index"),
  accordion: readValue("accordion"),
  sidebar: readValue("sidebar"),
  // What `shadcn init` passes on Tailwind v3: the base color's theme item
  // merged with the style index. Slate has destructive-foreground and no
  // sidebar colors, neutral the other way around.
  "init-slate": readValue("init-slate"),
  "init-neutral": readValue("init-neutral"),
  // Hand-written: another plugin, and theme values with arrays, quoted keys
  // and a key outside extend.
  typography: {
    plugins: ['require("@tailwindcss/typography")'],
  },
  "font-family": {
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
          heading: ["var(--font-heading)"],
        },
      },
    },
  },
  "caret-blink": {
    theme: {
      extend: {
        keyframes: {
          "caret-blink": {
            "0%,70%,100%": { opacity: "1" },
            "20%,50%": { opacity: "0" },
          },
        },
        animation: {
          "caret-blink": "caret-blink 1.25s ease-out infinite",
        },
      },
    },
  },
  container: {
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
} satisfies Record<string, UpdaterTailwindConfig>

type ValueSetName = keyof typeof VALUE_SETS

// Every fixture runs through these sets.
const CORPUS_SETS: ValueSetName[] = ["index", "accordion", "sidebar"]

// The other sets run only on the fixtures where they show something the
// corpus sets do not. The init payloads reprint the whole theme with all of
// the base color's colors, so on every fixture they would repeat the
// accordion and sidebar diffs at twice the size.
const SET_FIXTURES: [ValueSetName, string[]][] = [
  [
    "init-slate",
    [
      "create-next-app--15.ts",
      // Already initialized: destructive stays an object.
      "shadcn--next.js",
      "starter--t3-app.ts",
    ],
  ],
  [
    "init-neutral",
    [
      "broken--commented-out-plugins.ts",
      // The init colors replace the value the corpus sets break on.
      "broken--theme-member-access.js",
      "create-next-app--13.ts",
      "create-next-app--14.ts",
      "create-next-app--15-empty.ts",
      "create-next-app--15-js.mjs",
      "plugins--missing.js",
      // Already initialized: the string destructive replaces the object.
      "shadcn--next.js",
      "shadcn--monorepo-ui.ts",
      "starter--astro.mjs",
      "starter--laravel-breeze.js",
      "starter--vite.js",
      "text--crlf.ts",
    ],
  ],
  // Next to plugins that are already there, in every form.
  [
    "typography",
    [
      "broken--plugins-line-comment.js",
      "create-next-app--15.ts",
      "plugins--multiline.js",
      "plugins--multiline-no-trailing-comma.js",
      "plugins--single-quotes.js",
      "plugins--with-options.js",
      "repo--root.cjs",
      "shadcn--monorepo-ui.ts",
      "shadcn--next.js",
      "starter--laravel-breeze.js",
      "text--crlf-plugins.js",
    ],
  ],
  // Arrays replace arrays, so the spreads in them go.
  [
    "font-family",
    [
      "create-next-app--15.ts",
      "starter--laravel-breeze.js",
      "starter--t3-app.ts",
      "theme--spreads.mjs",
    ],
  ],
  // Quoted keys. A key the config already has in double quotes comes out
  // twice, as in repo--root.cjs.
  [
    "caret-blink",
    [
      "create-next-app--15.ts",
      "repo--root.cjs",
      "starter--vite.js",
      "theme--computed-keys.js",
    ],
  ],
  // Outside extend, next to a container that is already there.
  [
    "container",
    [
      "create-next-app--15.ts",
      "shadcn--next-app-tailwind-v3.ts",
      "theme--literals.js",
    ],
  ],
]

// A second install on a config shadcn already edited: [first, second].
const CHAINS: [ValueSetName, ValueSetName][] = [
  ["init-neutral", "accordion"],
  ["init-neutral", "sidebar"],
  ["init-slate", "init-slate"],
  ["accordion", "sidebar"],
  // The first install duplicates keys it reads with double quotes, and the
  // second one drops the duplicates again.
  ["accordion", "accordion"],
  ["index", "index"],
]

const CHAIN_FIXTURES = [
  "create-next-app--14.ts",
  "create-next-app--15-js.mjs",
  "plugins--missing.js",
  "shadcn--next.js",
  "starter--astro.mjs",
  "starter--laravel-breeze.js",
  "starter--t3-app.ts",
  "text--crlf.ts",
  "theme--root-spread-comments.js",
  "theme--spreads.mjs",
]

// Line diff (LCS) from input to output. "(unchanged)" when identical. The same
// diff as transform-corpus.test.ts.
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

// Snapshots normalize line endings, so mark carriage returns to pin them.
function showCarriageReturns(text: string) {
  return text.replace(/\r/g, "␍")
}

// Babel's syntax errors, or "unparsable" when it cannot recover from them.
function syntaxErrors(code: string) {
  const count = countSyntaxErrors(code)
  return count === Infinity ? "unparsable" : String(count)
}

async function transform(input: string, setName: ValueSetName, name: string) {
  // Each run gets its own copy, so an editor that mutates the value cannot
  // change what later runs see.
  return transformTailwindConfig(
    input,
    structuredClone(VALUE_SETS[setName]),
    configFor(name)
  )
}

async function edit(input: string, setName: ValueSetName, name: string) {
  let output: string
  try {
    output = await transform(input, setName, name)
  } catch (error) {
    // ts-morph appends the whole rejected file to its message.
    return `throws: ${String(error).split("\n")[0]}`
  }

  const diff = lineDiff(showCarriageReturns(input), showCarriageReturns(output))
  if (countSyntaxErrors(output) > countSyntaxErrors(input)) {
    return `adds syntax errors: ${syntaxErrors(input)} -> ${syntaxErrors(output)}\n${diff}`
  }
  return diff
}

function getFixture(name: string) {
  const fixture = FIXTURES.find((fixture) => fixture.name === name)
  if (!fixture) {
    throw new Error(`${name} is not in the corpus.`)
  }
  return fixture
}

for (const setName of CORPUS_SETS) {
  describe(setName, () => {
    for (const fixture of FIXTURES) {
      test(fixture.name, async () => {
        expect(await edit(fixture.raw, setName, fixture.name)).toMatchSnapshot()
      })
    }
  })
}

for (const [setName, names] of SET_FIXTURES) {
  describe(setName, () => {
    for (const name of names) {
      test(name, async () => {
        const fixture = getFixture(name)
        expect(await edit(fixture.raw, setName, name)).toMatchSnapshot()
      })
    }
  })
}

for (const [first, second] of CHAINS) {
  describe(`${first}, then ${second}`, () => {
    for (const name of CHAIN_FIXTURES) {
      test(name, async () => {
        const edited = await transform(getFixture(name).raw, first, name)
        expect(await edit(edited, second, name)).toMatchSnapshot()
      })
    }
  })
}
