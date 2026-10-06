import { readdirSync, readFileSync } from "fs"
import path from "path"
import { registryItemSchema, type RegistryFontItem } from "@/src/schema"
import type { Config } from "@/src/utils/get-config"
import { describe, expect, test } from "vitest"

import { transformLayoutFonts } from "./update-fonts"

// Golden corpus: pins the exact output of the Next.js layout font editor on
// frozen layouts. The inputs in test/fixtures/layout-corpus are create-next-app
// layouts (13 to 16), text and <html> variants of them, hand-written edge
// cases, and copies of the layouts in this repo's templates and fixtures. The
// fonts are copies of new-york-v4 registry:font items. Never edit them: change
// the output only on purpose, and review the snapshot diff.
//
// Each snapshot is a line diff from the input, so it pins the output exactly
// and shows what the editor changed. Inputs it throws on pin the error.

const CORPUS_DIR = path.resolve(
  __dirname,
  "../../../test/fixtures/layout-corpus"
)

const FIXTURES = readdirSync(CORPUS_DIR)
  .filter((file) => /\.[jt]sx$/.test(file))
  .sort()
  .map((file) => ({
    name: file,
    raw: readFileSync(path.join(CORPUS_DIR, file), "utf8"),
  }))

const CONFIG = {
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
} as Config

function readFont(name: string): RegistryFontItem {
  const item = registryItemSchema.parse(
    JSON.parse(
      readFileSync(path.join(CORPUS_DIR, "fonts", `${name}.json`), "utf8")
    )
  )
  if (item.type !== "registry:font") {
    throw new Error(`${name} is not a registry:font item.`)
  }
  return item
}

const FONT_SETS = {
  inter: ["font-inter"],
  geist: ["font-geist"],
  "geist-mono": ["font-geist-mono"],
  lora: ["font-lora"],
  // The only set with a weight option.
  "instrument-serif": ["font-instrument-serif"],
  "heading-playfair-display": ["font-heading-playfair-display"],
  // The same Google font as body and heading.
  "inter + heading-inter": ["font-inter", "font-heading-inter"],
  // Two root fonts: only the last one's font-family class goes on <html>.
  "geist + geist-mono": ["font-geist", "font-geist-mono"],
  "lora + inter": ["font-lora", "font-inter"],
  "inter + heading-playfair-display + jetbrains-mono": [
    "font-inter",
    "font-heading-playfair-display",
    "font-jetbrains-mono",
  ],
  // Only used in CHAINS.
  "inter + heading-playfair-display": [
    "font-inter",
    "font-heading-playfair-display",
  ],
  "noto-serif": ["font-noto-serif"],
  "geist + heading-geist": ["font-geist", "font-heading-geist"],
  "heading-noto-serif + noto-sans": [
    "font-heading-noto-serif",
    "font-noto-sans",
  ],
} satisfies Record<string, string[]>

type FontSetName = keyof typeof FONT_SETS

const FONTS = Object.fromEntries(
  Object.entries(FONT_SETS).map(([setName, fontNames]) => [
    setName,
    fontNames.map(readFont),
  ])
) as Record<FontSetName, RegistryFontItem[]>

// Every fixture runs through these sets.
const CORPUS_SETS: FontSetName[] = [
  "inter",
  "geist",
  "geist-mono",
  "lora",
  "instrument-serif",
  "heading-playfair-display",
  "inter + heading-inter",
  "geist + geist-mono",
  "lora + inter",
  "inter + heading-playfair-display + jetbrains-mono",
]

// A second font install on a layout shadcn already edited: [first, second].
const CHAINS: [FontSetName, FontSetName][] = [
  ["inter", "lora"],
  ["geist", "geist"],
  ["lora", "inter"],
  ["inter + heading-playfair-display", "geist + heading-geist"],
  ["heading-playfair-display", "inter + heading-playfair-display"],
  ["noto-serif", "heading-noto-serif + noto-sans"],
]

const CHAIN_FIXTURES = [
  "create-next-app--15.tsx",
  "create-next-app--16.tsx",
  "html--cn-font-sans.tsx",
  "repo--templates-next-app.tsx",
  "shape--providers.tsx",
  "text--crlf.tsx",
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

async function edit(input: string, fonts: RegistryFontItem[]) {
  try {
    const output = await transformLayoutFonts(input, fonts, CONFIG)
    return lineDiff(showCarriageReturns(input), showCarriageReturns(output))
  } catch (error) {
    // ts-morph appends the whole rejected file to its message.
    return `throws: ${String(error).split("\n")[0]}`
  }
}

for (const setName of CORPUS_SETS) {
  describe(setName, () => {
    for (const fixture of FIXTURES) {
      test(fixture.name, async () => {
        expect(await edit(fixture.raw, FONTS[setName])).toMatchSnapshot()
      })
    }
  })
}

for (const [first, second] of CHAINS) {
  describe(`${first}, then ${second}`, () => {
    for (const name of CHAIN_FIXTURES) {
      test(name, async () => {
        const fixture = FIXTURES.find((fixture) => fixture.name === name)!
        const edited = await transformLayoutFonts(
          fixture.raw,
          FONTS[first],
          CONFIG
        )
        expect(await edit(edited, FONTS[second])).toMatchSnapshot()
      })
    }
  })
}
