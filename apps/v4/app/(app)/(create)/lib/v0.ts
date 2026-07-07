import dedent from "dedent"
import {
  registryItemFileSchema,
  registryItemSchema,
  type configSchema,
  type RegistryItem,
} from "shadcn/schema"
import {
  transformFont,
  transformIcons,
  transformMenu,
  transformRender,
} from "shadcn/utils"
import { Project, ScriptKind, type SourceFile } from "ts-morph"
import { z } from "zod"

import {
  buildRegistryBase,
  getBodyFont,
  getHeadingFont,
  getInheritedHeadingFontValue,
  type DesignSystemConfig,
} from "@/registry/config"

const { Index } = await import("@/registry/bases/__index__")

function buildThemeInline(fontHeadingValue: string) {
  return `--font-sans: var(--font-sans);
  --font-heading: ${fontHeadingValue};
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);`
}

// Static file — parsed once at module level.
const themeProviderFile = registryItemFileSchema.parse({
  path: "components/theme-provider.tsx",
  type: "registry:component",
  target: "components/theme-provider.tsx",
  content: dedent`
    "use client"

    import * as React from "react"
    import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

    function ThemeProvider({
      children,
      ...props
    }: React.ComponentProps<typeof NextThemesProvider>) {
      return (
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          {...props}
        >
          <ThemeHotkey />
          {children}
        </NextThemesProvider>
      )
    }

    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) {
        return false
      }

      return (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      )
    }

    function ThemeHotkey() {
      const { resolvedTheme, setTheme } = useTheme()

      React.useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
          if (event.defaultPrevented || event.repeat) {
            return
          }

          if (event.metaKey || event.ctrlKey || event.altKey) {
            return
          }

          if (event.key.toLowerCase() !== "d") {
            return
          }

          if (isTypingTarget(event.target)) {
            return
          }

          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }

        window.addEventListener("keydown", onKeyDown)

        return () => {
          window.removeEventListener("keydown", onKeyDown)
        }
      }, [resolvedTheme, setTheme])

      return null
    }

    export { ThemeProvider }
  `,
})

const ALIASES = {
  components: "@/components",
  utils: "@/lib/utils",
  ui: "@/components/ui",
  lib: "@/lib",
  hooks: "@/hooks",
} as const

type V0Transformer = (opts: {
  filename: string
  raw: string
  sourceFile: SourceFile
  config: z.infer<typeof configSchema>
  supportedFontMarkers?: string[]
}) => Promise<unknown>

const transformers: V0Transformer[] = [
  transformIcons as V0Transformer,
  transformMenu as V0Transformer,
  transformRender as V0Transformer,
  transformFont as V0Transformer,
]

function getStyle(designSystemConfig: DesignSystemConfig) {
  return `${designSystemConfig.base}-${designSystemConfig.style}`
}

export async function buildV0Payload(designSystemConfig: DesignSystemConfig) {
  const registryBase = buildRegistryBase(designSystemConfig)
  const normalizedFontHeading =
    designSystemConfig.fontHeading === designSystemConfig.font
      ? "inherit"
      : designSystemConfig.fontHeading

  // Only buildComponentFiles is async — run sync builders directly.
  const globalsCss = buildGlobalsCss(
    registryBase,
    designSystemConfig.font,
    normalizedFontHeading
  )
  const layoutFile = buildLayoutFile(designSystemConfig, normalizedFontHeading)
  const componentFiles = await buildComponentFiles(designSystemConfig)

  const dependencies = [...(registryBase.dependencies ?? []), "next-themes"]
  const componentsJson = buildComponentsJson(designSystemConfig)
  const packageJson = buildPackageJson(dependencies)

  return registryItemSchema.parse({
    name: designSystemConfig.item ?? "open-in-v0",
    type: "registry:item",
    dependencies,
    files: [
      globalsCss,
      layoutFile,
      themeProviderFile,
      componentsJson,
      packageJson,
      ...componentFiles,
    ],
  })
}

function buildGlobalsCss(
  registryBase: RegistryItem,
  font: DesignSystemConfig["font"],
  fontHeading: DesignSystemConfig["fontHeading"]
) {
  const lightVars = Object.entries(registryBase.cssVars?.light ?? {})
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  const darkVars = Object.entries(registryBase.cssVars?.dark ?? {})
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  const content = dedent`@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

  @custom-variant dark (&:is(.dark *));

  @theme inline {
  ${buildThemeInline(
    fontHeading === "inherit"
      ? getInheritedHeadingFontValue(font)
      : "var(--font-heading)"
  )}
  }

:root {
  ${lightVars}
}

.dark {
  ${darkVars}
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
  `

  return registryItemFileSchema.parse({
    path: "app/globals.css",
    type: "registry:file",
    target: "app/globals.css",
    content,
  })
}

function buildComponentsJson(designSystemConfig: DesignSystemConfig) {
  const content = JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema.json",
      style: getStyle(designSystemConfig),
      rsc: true,
      tsx: true,
      tailwind: {
        config: "",
        css: "app/globals.css",
        baseColor: designSystemConfig.baseColor,
        cssVariables: true,
        prefix: "",
      },
      aliases: ALIASES,
      iconLibrary: designSystemConfig.iconLibrary,
    },
    null,
    2
  )

  return registryItemFileSchema.parse({
    path: "components.json",
    type: "registry:file",
    target: "components.json",
    content,
  })
}

function buildPackageJson(dependencies: string[]) {
  // Base package.json matching templates/next-app/package.json + component peer deps.
  const baseDependencies: Record<string, string> = {
    next: "16.1.6",
    "next-themes": "^0.4.6",
    react: "^19.2.4",
    "react-dom": "^19.2.4",
    // Utility deps.
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    "tailwind-merge": "^3.3.1",
    // Component peer deps.
    "date-fns": "4.1.0",
    "embla-carousel-react": "8.5.1",
    "input-otp": "1.4.1",
    "react-day-picker": "9.8.0",
    "react-resizable-panels": "^2.1.7",
    recharts: "2.15.4",
    sonner: "^1.7.4",
    vaul: "^1.1.2",
    "@vercel/analytics": "1.3.1",
  }

  // Merge dynamic dependencies.
  for (const dep of dependencies) {
    const atIndex = dep.lastIndexOf("@")
    if (atIndex > 0) {
      // Has version: e.g. "shadcn@latest".
      baseDependencies[dep.slice(0, atIndex)] = dep.slice(atIndex + 1)
    } else {
      baseDependencies[dep] = "latest"
    }
  }

  const content = JSON.stringify(
    {
      name: "next-app",
      version: "0.0.1",
      type: "module",
      private: true,
      scripts: {
        dev: "next dev --turbopack",
        build: "next build",
        start: "next start",
        lint: "eslint",
        format: 'prettier --write "**/*.{ts,tsx}"',
        typecheck: "tsc --noEmit",
      },
      dependencies: baseDependencies,
      devDependencies: {
        "@eslint/eslintrc": "^3",
        "@tailwindcss/postcss": "^4.1.18",
        "@types/node": "^25.1.0",
        "@types/react": "^19.2.10",
        "@types/react-dom": "^19.2.3",
        eslint: "^9.39.2",
        "eslint-config-next": "16.1.6",
        prettier: "^3.8.1",
        "prettier-plugin-tailwindcss": "^0.7.2",
        postcss: "^8",
        tailwindcss: "^4.1.18",
        "tw-animate-css": "^1.3.4",
        typescript: "^5.9.3",
      },
    },
    null,
    2
  )

  return registryItemFileSchema.parse({
    path: "package.json",
    type: "registry:file",
    target: "package.json",
    content,
  })
}

function buildLayoutFile(
  designSystemConfig: DesignSystemConfig,
  fontHeading: DesignSystemConfig["fontHeading"]
) {
  const font = getBodyFont(designSystemConfig.font)
  if (!font) {
    throw new Error(`Font "${designSystemConfig.font}" not found`)
  }

  const headingFont =
    fontHeading === "inherit" ? undefined : getHeadingFont(fontHeading)

  // Derive const name from the font's CSS variable (e.g. --font-sans → fontSans).
  const constName = font.font.variable
    .replace(/^--/, "")
    .replace(/-./g, (m) => m[1].toUpperCase())
  const headingConstName = "fontHeading"

  // Add font-serif or font-mono class to body when needed. Sans is the default.
  const fontClass =
    font.font.variable === "--font-serif"
      ? "font-serif"
      : font.font.variable === "--font-mono"
        ? "font-mono"
        : ""

  const bodyClassName = fontClass ? `antialiased ${fontClass}` : "antialiased"
  const imports = headingFont
    ? Array.from(new Set([font.font.import, headingFont.font.import])).join(
        ", "
      )
    : font.font.import
  const headingDeclaration = headingFont
    ? `\nconst ${headingConstName} = ${headingFont.font.import}({subsets:['latin'],variable:'${headingFont.font.variable}'});\n`
    : ""
  const htmlClassName = headingFont
    ? `{${constName}.variable + " " + ${headingConstName}.variable}`
    : `{${constName}.variable}`

  const content = dedent`
    import type { Metadata } from "next";
    import { ${imports} } from "next/font/google";
    import "./globals.css";
    import { ThemeProvider } from "@/components/theme-provider";

    const ${constName} = ${font.font.import}({subsets:['latin'],variable:'${font.font.variable}'});
    ${headingDeclaration}

    export const metadata: Metadata = {
      title: "Create Next App",
      description: "Generated by create next app",
    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en" suppressHydrationWarning className=${htmlClassName}>
          <body
            className="${bodyClassName}"
          >
            <ThemeProvider>{children}</ThemeProvider>
          </body>
        </html>
      );
    }
  `

  return registryItemFileSchema.parse({
    path: "app/layout.tsx",
    type: "registry:page",
    target: "app/layout.tsx",
    content,
  })
}

async function buildComponentFiles(designSystemConfig: DesignSystemConfig) {
  const allItemsForBase = Object.values(Index[designSystemConfig.base])
    .filter((item: RegistryItem) => item.type === "registry:ui")
    .map((item) => item.name)

  // Build config once for all components.
  const config = buildTransformConfig(designSystemConfig)

  // Fetch UI components, the demo, and the item component in parallel.
  const [registryItemFiles, demoFile, itemComponentFile] = await Promise.all([
    Promise.all(
      allItemsForBase.map((name) =>
        getRegistryItemFile(name, designSystemConfig, config)
      )
    ),
    getRegistryItemFile("demo", designSystemConfig, config),
    designSystemConfig.item
      ? getRegistryItemFile(designSystemConfig.item, designSystemConfig, config)
      : null,
  ])

  const files = [...registryItemFiles.filter(Boolean)]

  // Include the demo component.
  if (demoFile) {
    files.push({
      ...demoFile,
      target: "components/demo.tsx",
      type: "registry:component",
    })
  }

  const pageFile = {
    path: "app/page.tsx",
    type: "registry:page",
    target: "app/page.tsx",
    content: dedent`
      import { Demo } from "@/components/demo"

      export default function Page() {
        return <Demo />
      }
    `,
  }

  // Build the actual item component.
  if (itemComponentFile) {
    // Find the export default function from the component file.
    const exportDefault = itemComponentFile.content.match(
      /export default function (\w+)/
    )
    if (exportDefault) {
      const functionName = exportDefault[1]

      // Replace the export default function with a named export.
      itemComponentFile.content = itemComponentFile.content.replace(
        /export default function (\w+)/,
        `export function ${functionName}`
      )

      // Import and render the item on the page.
      pageFile.content = dedent`import { ${functionName} } from "@/components/${designSystemConfig.item}";

      export default function Page() {
        return <${functionName} />
      }`
    }

    files.push({
      ...itemComponentFile,
      target: `components/${designSystemConfig.item}.tsx`,
      type: "registry:component",
    })
  }

  files.push(pageFile)

  return z.array(registryItemFileSchema).parse(files)
}

function buildTransformConfig(designSystemConfig: DesignSystemConfig) {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: getStyle(designSystemConfig),
    rsc: true,
    tsx: true,
    tailwind: {
      config: "",
      css: "app/globals.css",
      baseColor: designSystemConfig.baseColor,
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: designSystemConfig.iconLibrary,
    aliases: ALIASES,
    menuAccent: designSystemConfig.menuAccent,
    menuColor: designSystemConfig.menuColor,
    resolvedPaths: {
      cwd: "/",
      tailwindConfig: "./tailwind.config.js",
      tailwindCss: "./globals.css",
      utils: "./lib/utils",
      components: "./components",
      lib: "./lib",
      hooks: "./hooks",
      ui: "./components/ui",
    },
  } satisfies z.infer<typeof configSchema>
}

async function getRegistryItemFile(
  name: string,
  designSystemConfig: DesignSystemConfig,
  config: z.infer<typeof configSchema>
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/r/styles/${getStyle(designSystemConfig)}/${name}.json`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch registry item: ${response.statusText}`)
  }

  const json = await response.json()
  const item = registryItemSchema.parse(json)

  const file = item.files?.[0]
  if (!file?.content) {
    return null
  }

  const content = await transformFileContent(file.content, config)

  return {
    ...file,
    target:
      name === "example"
        ? "components/example.tsx"
        : `components/ui/${name}.tsx`,
    type: name === "example" ? "registry:component" : "registry:ui",
    content,
  }
}

async function transformFileContent(
  content: string,
  config: z.infer<typeof configSchema>
) {
  const project = new Project({ compilerOptions: {} })
  const sourceFile = project.createSourceFile("component.tsx", content, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  for (const transformer of transformers) {
    await transformer({
      filename: "component.tsx",
      raw: content,
      sourceFile,
      config,
      supportedFontMarkers: ["cn-font-heading"],
    })
  }

  return sourceFile.getText()
}
