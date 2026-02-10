import { describe, expect, test } from "vitest"

import { transformTailwindContent } from "../../../src/utils/updaters/update-tailwind-content"

const SHARED_CONFIG = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "new-york",
  rsc: true,
  tsx: true,
  tailwind: {
    config: "tailwind.config.ts",
    css: "app/globals.css",
    baseColor: "slate",
    cssVariables: true,
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: ".",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "app/globals.css",
    components: "./components",
    utils: "./lib/utils",
    ui: "./components/ui",
  },
}

describe("transformTailwindContent -> content property", () => {
  test("should add content property if not in config", async () => {
    expect(
      await transformTailwindContent(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        ["./foo/**/*.{js,ts,jsx,tsx,mdx}", "./bar/**/*.{js,ts,jsx,tsx,mdx}"],
        {
          config: SHARED_CONFIG,
        }
      )
    ).toMatchSnapshot()
  })

  test("should NOT add content property if already in config", async () => {
    expect(
      await transformTailwindContent(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
  `,
        ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./bar/**/*.{js,ts,jsx,tsx,mdx}"],
        {
          config: SHARED_CONFIG,
        }
      )
    ).toMatchSnapshot()
  })
})

describe("transformTailwindContent -> newline preservation", () => {
  test("should preserve trailing newline when present", async () => {
    const input = `import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
}

export default config
`
    const result = await transformTailwindContent(
      input,
      ["./app/**/*.{js,ts,jsx,tsx}"],
      { config: SHARED_CONFIG }
    )

    expect(result.endsWith("\n")).toBe(true)
    expect(result.endsWith("\n\n")).toBe(false)
  })

  test("should not add trailing newline when not present", async () => {
    const input = `import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
}

export default config`

    const result = await transformTailwindContent(
      input,
      ["./app/**/*.{js,ts,jsx,tsx}"],
      { config: SHARED_CONFIG }
    )

    expect(result.endsWith("\n")).toBe(false)
  })

  test("should handle multiple trailing newlines correctly", async () => {
    const input = `import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
}

export default config


`
    const result = await transformTailwindContent(
      input,
      ["./app/**/*.{js,ts,jsx,tsx}"],
      { config: SHARED_CONFIG }
    )

    // Should normalize to single trailing newline
    expect(result.endsWith("\n")).toBe(true)
    expect(result.match(/\n+$/)?.[0]).toBe("\n")
  })

  test("should skip duplicate content entries and preserve newline", async () => {
    const input = `import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
}

export default config
`
    const result = await transformTailwindContent(
      input,
      ["./src/**/*.{js,ts,jsx,tsx}"],
      { config: SHARED_CONFIG }
    )

    // Count occurrences of the content path
    const matches = result.match(/\.\/src\/\*\*\/\*\.\{js,ts,jsx,tsx\}/g)
    expect(matches?.length).toBe(1)
    expect(result.endsWith("\n")).toBe(true)
  })
})
