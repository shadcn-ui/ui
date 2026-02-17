import { NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"
import dedent from "dedent"
import {
  registryItemFileSchema,
  registryItemSchema,
  type configSchema,
  type RegistryItem,
} from "shadcn/schema"
import { transformIcons, transformMenu, transformRender } from "shadcn/utils"
import { Project, ScriptKind } from "ts-morph"
import { z } from "zod"

import {
  buildRegistryBase,
  designSystemConfigSchema,
  fonts,
  type DesignSystemConfig,
} from "@/registry/config"

const { Index } = await import("@/registry/bases/__index__")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const parseResult = designSystemConfigSchema.safeParse({
      base: searchParams.get("base"),
      style: searchParams.get("style"),
      iconLibrary: searchParams.get("iconLibrary"),
      baseColor: searchParams.get("baseColor"),
      theme: searchParams.get("theme"),
      font: searchParams.get("font"),
      item: searchParams.get("item"),
      menuAccent: searchParams.get("menuAccent"),
      menuColor: searchParams.get("menuColor"),
      radius: searchParams.get("radius"),
    })

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const designSystemConfig = parseResult.data

    track("create_open_in_v0", designSystemConfig)

    const payload = await buildV0Payload(designSystemConfig)

    return NextResponse.json(payload)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
}

async function buildV0Payload(designSystemConfig: DesignSystemConfig) {
  const registryBase = buildRegistryBase(designSystemConfig)

  // Build all files in parallel.
  const [globalsCss, layoutFile, componentFiles] = await Promise.all([
    buildGlobalsCss(registryBase),
    buildLayoutFile(designSystemConfig),
    buildComponentFiles(designSystemConfig),
  ])

  return registryItemSchema.parse({
    name: designSystemConfig.item ?? "Item",
    type: "registry:item",
    files: [globalsCss, layoutFile, ...componentFiles],
  })
}

function buildGlobalsCss(registryBase: RegistryItem) {
  const lightVars = Object.entries(registryBase.cssVars?.light ?? {})
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  const darkVars = Object.entries(registryBase.cssVars?.dark ?? {})
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  const content = dedent`@import "tailwindcss";
@import "tw-animate-css";
/* @import "shadcn/tailwind.css"; */

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
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
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
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

function buildLayoutFile(designSystemConfig: DesignSystemConfig) {
  const font = fonts.find(
    (font) => font.name === `font-${designSystemConfig.font}`
  )
  if (!font) {
    throw new Error(`Font "${designSystemConfig.font}" not found`)
  }

  const content = dedent`
    import type { Metadata } from "next";
    import { ${font.font.import} } from "next/font/google";
    import "./globals.css";

    const fontSans = ${font.font.import}({subsets:['latin'],variable:'--font-sans'});

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
        <html lang="en" className={fontSans.variable}>
          <body
            className="antialiased"
          >
            {children}
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
  const files = []
  const allItemsForBase = Object.values(Index[designSystemConfig.base])
    .filter(
      (item: RegistryItem) =>
        item.type === "registry:ui" || item.name === "example"
    )
    .map((item) => item.name)

  const registryItemFiles = await Promise.all(
    allItemsForBase.map(async (name) => {
      const file = await getRegistryItemFile(name, designSystemConfig)
      return file
    })
  )
  files.push(...registryItemFiles)

  const pageFile = {
    path: "app/page.tsx",
    type: "registry:page",
    target: "app/page.tsx",
    content: dedent`
      import { Button } from "@/components/ui/button";
      export default function Page() {
        return <Button>Click me</Button>
      }
    `,
  }

  // Build the actual item component.
  if (designSystemConfig.item) {
    const itemComponentFile = await getRegistryItemFile(
      designSystemConfig.item,
      designSystemConfig
    )
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
  }

  files.push(pageFile)

  return z.array(registryItemFileSchema).parse(files)
}

async function getRegistryItemFile(
  name: string,
  designSystemConfig: DesignSystemConfig
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/r/styles/${designSystemConfig.base}-${designSystemConfig.style}/${name}.json`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch registry item: ${response.statusText}`)
  }

  const json = await response.json()
  const item = registryItemSchema.parse(json)

  // Build a v0 config i.e components.json
  const config = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: `${designSystemConfig.base}-${designSystemConfig.style}`,
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
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
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

const transformers = [transformIcons, transformMenu, transformRender]

async function transformFileContent(
  content: string,
  config: z.infer<typeof configSchema>
) {
  const project = new Project({
    compilerOptions: {},
  })

  const sourceFile = project.createSourceFile("component.tsx", content, {
    scriptKind: ScriptKind.TSX,
  })

  for (const transformer of transformers) {
    await transformer({
      filename: "component.tsx",
      raw: content,
      sourceFile,
      config,
    })
  }

  return sourceFile.getText()
}
