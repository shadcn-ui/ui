import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { FRAMEWORKS } from "@/src/utils/frameworks"
import { createConfig } from "@/src/utils/get-config"
import { afterEach, describe, expect, it } from "vitest"

import { encodePreset, type PresetConfig } from "./preset"
import { resolveProjectPreset } from "./resolve"

const tempDirs: string[] = []
const presetCssWithHeadingFont = `@import "@fontsource-variable/inter";
@import "@fontsource-variable/lora";

:root {
  --radius: 0.875rem;
  --primary: oklch(0.488 0.243 264.376);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --sidebar-primary: oklch(0.546 0.245 262.881);
  --sidebar-primary-foreground: oklch(0.97 0.014 254.604);
  --chart-1: oklch(0.845 0.143 164.978);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.596 0.145 163.225);
  --chart-4: oklch(0.508 0.118 165.612);
  --chart-5: oklch(0.432 0.095 166.913);
}

.dark {
  --primary: oklch(0.424 0.199 265.638);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --sidebar-primary: oklch(0.623 0.214 259.815);
  --sidebar-primary-foreground: oklch(0.97 0.014 254.604);
  --chart-1: oklch(0.845 0.143 164.978);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.596 0.145 163.225);
  --chart-4: oklch(0.508 0.118 165.612);
  --chart-5: oklch(0.432 0.095 166.913);
}

@theme inline {
  --font-sans: "Inter Variable", sans-serif;
  --font-heading: "Lora Variable", serif;
}`

async function createTestConfig(options: {
  css: string
  style?: string
  baseColor?: string
  iconLibrary?: string
  menuColor?: PresetConfig["menuColor"]
  menuAccent?: PresetConfig["menuAccent"]
  files?: Record<string, string>
}) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-preset-"))
  tempDirs.push(tempDir)

  const tailwindCss = path.join(tempDir, "globals.css")
  await fs.writeFile(tailwindCss, options.css, "utf8")

  for (const [relativePath, content] of Object.entries(options.files ?? {})) {
    const filePath = path.join(tempDir, relativePath)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, content, "utf8")
  }

  return createConfig({
    style: options.style ?? "base-luma",
    tailwind: {
      css: "globals.css",
      baseColor: options.baseColor ?? "mist",
      cssVariables: true,
      prefix: "",
      config: "",
    },
    iconLibrary: options.iconLibrary ?? "phosphor",
    menuColor: options.menuColor ?? "inverted",
    menuAccent: options.menuAccent ?? "bold",
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
    resolvedPaths: {
      cwd: tempDir,
      tailwindCss,
    },
  })
}

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dir) => fs.rm(dir, { recursive: true, force: true }))
  )
})

describe("resolveProjectPreset", () => {
  it("derives preset values and code from project css", async () => {
    const config = await createTestConfig({
      css: presetCssWithHeadingFont,
    })

    const result = await resolveProjectPreset(config)

    expect(result.values).toEqual({
      style: "luma",
      baseColor: "mist",
      theme: "blue",
      chartColor: "emerald",
      iconLibrary: "phosphor",
      font: "inter",
      fontHeading: "lora",
      radius: "large",
      menuAccent: "bold",
      menuColor: "inverted",
    })
    expect(result.code).toBe(encodePreset(result.values!))
    expect(result.fallbacks).toEqual([])
  })

  it("resolves self-referential theme font vars from root vars", async () => {
    const config = await createTestConfig({
      css: `:root {
  --radius: 0.625rem;
  --primary: oklch(0.205 0 0);
  --chart-1: oklch(0.87 0 0);
  --font-sans: "Lora Variable", serif;
}

.dark {
  --primary: oklch(0.205 0 0);
  --chart-1: oklch(0.87 0 0);
}

@theme inline {
  --font-sans: var(--font-sans);
}`,
    })

    const result = await resolveProjectPreset(config)

    expect(result.values).toMatchObject({
      font: "lora",
    })
    expect(result.fallbacks).not.toContain("font")
  })

  it("matches serif font imports against the serif root variable", async () => {
    const config = await createTestConfig({
      style: "base-nova",
      css: `@import "@fontsource-variable/inter";
@import "@fontsource-variable/eb-garamond";

:root {
  --radius: 0.625rem;
  --primary: oklch(0.205 0 0);
  --chart-1: oklch(0.87 0 0);
}

.dark {
  --primary: oklch(0.205 0 0);
  --chart-1: oklch(0.87 0 0);
}`,
    })

    const result = await resolveProjectPreset(config)

    expect(result.values).toMatchObject({
      font: "inter",
    })
    expect(result.fallbacks).not.toContain("font")
  })

  it("falls back to preset defaults when css values cannot be matched", async () => {
    const config = await createTestConfig({
      css: `:root {
  --radius: 1rem;
  --primary: hotpink;
  --chart-1: tomato;
}

.dark {
  --primary: rebeccapurple;
  --chart-1: orange;
}

@theme inline {
  --font-sans: var(--font-sans);
}`,
      menuAccent: "subtle",
      menuColor: "default",
    })

    const result = await resolveProjectPreset(config)

    expect(result.values).toEqual({
      style: "luma",
      baseColor: "mist",
      theme: "neutral",
      chartColor: "neutral",
      iconLibrary: "phosphor",
      font: "inter",
      fontHeading: "inherit",
      radius: "default",
      menuAccent: "subtle",
      menuColor: "default",
    })
    expect(result.code).toBe(encodePreset(result.values!))
    expect(result.fallbacks).toEqual([
      "theme",
      "chartColor",
      "font",
      "fontHeading",
      "radius",
    ])
  })

  it("derives body and heading fonts from next/font declarations in layout.tsx", async () => {
    const config = await createTestConfig({
      css: `:root {
  --radius: 0.875rem;
  --primary: oklch(0.623 0.214 259.815);
  --chart-1: oklch(0.696 0.17 162.48);
}

.dark {
  --primary: oklch(0.623 0.214 259.815);
  --chart-1: oklch(0.696 0.17 162.48);
}

@theme inline {
  --font-sans: var(--font-sans);
  --font-heading: var(--font-heading);
}`,
      files: {
        "src/app/layout.tsx": `import { Inter, Lora } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={\`font-sans \${inter.variable} \${loraHeading.variable}\`}>
      <body>{children}</body>
    </html>
  )
}`,
      },
    })

    const result = await resolveProjectPreset(config, {
      framework: FRAMEWORKS["next-app"],
      isSrcDir: true,
      isRSC: true,
      isTsx: true,
      tailwindConfigFile: null,
      tailwindCssFile: config.resolvedPaths.tailwindCss,
      tailwindVersion: "v4",
      frameworkVersion: "16.0.0",
      aliasPrefix: "@",
    })

    expect(result.values).toMatchObject({
      style: "luma",
      theme: "blue",
      chartColor: "emerald",
      font: "inter",
      fontHeading: "lora",
      radius: "large",
    })
    expect(result.code).toBe(encodePreset(result.values!))
  })

  it("derives body font from next-pages _app when only one root font is defined", async () => {
    const config = await createTestConfig({
      css: `:root {
  --radius: 0.625rem;
  --primary: oklch(0.205 0 0);
  --chart-1: oklch(0.87 0 0);
}

.dark {
  --primary: oklch(0.205 0 0);
  --chart-1: oklch(0.87 0 0);
}

@theme inline {
  --font-sans: var(--font-sans);
}`,
      files: {
        "src/pages/_app.tsx": `import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export default function App({ Component, pageProps }) {
  return <main className={inter.variable}><Component {...pageProps} /></main>
}`,
      },
    })

    const result = await resolveProjectPreset(config, {
      framework: FRAMEWORKS["next-pages"],
      isSrcDir: true,
      isRSC: false,
      isTsx: true,
      tailwindConfigFile: null,
      tailwindCssFile: config.resolvedPaths.tailwindCss,
      tailwindVersion: "v4",
      frameworkVersion: "16.0.0",
      aliasPrefix: "@",
    })

    expect(result.values).toMatchObject({
      style: "luma",
      font: "inter",
      fontHeading: "inherit",
    })
    expect(result.code).toBe(encodePreset(result.values!))
  })

  it("returns an empty preset for unsupported legacy styles", async () => {
    const config = await createTestConfig({
      style: "new-york",
      css: `:root { --radius: 0.625rem; }`,
    })

    await expect(resolveProjectPreset(config)).resolves.toEqual({
      code: null,
      fallbacks: [],
      values: null,
    })
  })
})
