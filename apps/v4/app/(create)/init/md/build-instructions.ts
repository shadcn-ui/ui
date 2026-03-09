import dedent from "dedent"

import { UI_COMPONENTS } from "@/lib/components"
import {
  buildRegistryBase,
  fonts,
  type DesignSystemConfig,
} from "@/registry/config"

// Builds step-by-step markdown instructions for manually setting up a project.
export function buildInstructions(config: DesignSystemConfig) {
  const registryBase = buildRegistryBase(config)

  const dependencies = [
    ...(registryBase.dependencies ?? []),
    "clsx",
    "tailwind-merge",
  ]

  const lightVars = Object.entries(registryBase.cssVars?.light ?? {})
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  const darkVars = Object.entries(registryBase.cssVars?.dark ?? {})
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  const font = fonts.find((f) => f.name === `font-${config.font}`)

  const sections = [
    buildDependenciesSection(dependencies),
    buildUtilsSection(),
    buildCssSection(lightVars, darkVars),
    buildFontSection(font),
    buildComponentsJsonSection(config),
    buildAvailableComponentsSection(config),
    config.rtl ? buildRtlSection(config) : null,
  ]

  return sections.filter(Boolean).join("\n\n---\n\n")
}

function buildDependenciesSection(dependencies: string[]) {
  const list = dependencies.map((dep) => `- ${dep}`).join("\n")

  return dedent`
    ## Step 1: Dependencies

    The following dependencies are required:

    ${list}
  `
}

function buildUtilsSection() {
  return dedent`
    ## Step 2: Create \`lib/utils.ts\`

    \`\`\`ts
    import { clsx, type ClassValue } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    \`\`\`
  `
}

function buildCssSection(lightVars: string, darkVars: string) {
  return dedent`
    ## Step 3: Set up CSS

    Add the following to your global CSS file (e.g. \`app/globals.css\`):

    \`\`\`css
    @import "tailwindcss";
    @import "tw-animate-css";
    @import "shadcn/tailwind.css";

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
      --radius-sm: calc(var(--radius) * 0.6);
      --radius-md: calc(var(--radius) * 0.8);
      --radius-lg: var(--radius);
      --radius-xl: calc(var(--radius) * 1.4);
      --radius-2xl: calc(var(--radius) * 1.8);
      --radius-3xl: calc(var(--radius) * 2.2);
      --radius-4xl: calc(var(--radius) * 2.6);
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
    \`\`\`
  `
}

function buildFontSection(font: (typeof fonts)[number] | undefined) {
  if (!font) {
    return null
  }

  const googleFontsUrl = `https://fonts.google.com/specimen/${font.font.import.replace(/_/g, "+")}`

  return dedent`
    ## Step 4: Set up the font

    This config uses **${font.title}** (\`${font.font.variable}\`).

    ### Next.js

    \`\`\`tsx
    import { ${font.font.import} } from "next/font/google"

    const fontSans = ${font.font.import}({
      subsets: ["latin"],
      variable: "${font.font.variable}",
    })

    // Add fontSans.variable to your <html> className.
    // <html className={fontSans.variable}>
    \`\`\`

    ### Other frameworks

    Add the font from [Google Fonts](${googleFontsUrl}) and set the \`${font.font.variable}\` CSS variable to the font family:

    \`\`\`css
    :root {
      ${font.font.variable}: ${font.font.family};
    }
    \`\`\`
  `
}

function buildComponentsJsonSection(config: DesignSystemConfig) {
  const componentsJson = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: `${config.base}-${config.style}`,
    tailwind: {
      css: "app/globals.css",
      baseColor: config.baseColor,
    },
    iconLibrary: config.iconLibrary,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
  }

  return dedent`
    ## Step 5: Create \`components.json\`

    Add a \`components.json\` file to the root of your project:

    \`\`\`json
    ${JSON.stringify(componentsJson, null, 2)}
    \`\`\`
  `
}

function buildAvailableComponentsSection(config: DesignSystemConfig) {
  const list = UI_COMPONENTS.join(", ")
  const style = `${config.base}-${config.style}`

  return dedent`
    ## Available Components

    ${list}

    To fetch the source for a component, use:
    \`https://ui.shadcn.com/r/styles/${style}/<component>.json\`

    For documentation and examples, visit:
    \`https://ui.shadcn.com/docs/components/${config.base}/<component>\`
  `
}

function buildRtlSection(config: DesignSystemConfig) {
  const template =
    config.template === "next-monorepo" ? "next" : (config.template ?? "next")

  return dedent`
    ## RTL Support

    Add \`dir="rtl"\` to your root \`<html>\` element:

    \`\`\`html
    <html dir="rtl">
    \`\`\`

    For full RTL setup including the \`DirectionProvider\`, see the [RTL documentation](https://ui.shadcn.com/docs/rtl/${template}).
  `
}
