"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, CopyIcon } from "lucide-react"

import { trackEvent } from "@/lib/events"
import { absoluteUrl, cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Button } from "@/styles/base-nova/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/base-nova/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/base-nova/ui/tabs"
import {
  TEMPLATES,
  type TemplateValue,
} from "@/app/(app)/(create)/lib/templates"
import { findFont, findFontDefinition } from "@/app/(app)/(typeset)/lib/fonts"
import {
  TYPESET_MEASURES,
  useTypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

export function TypesetDocsPanel() {
  return (
    <div className="hidden w-88 flex-col items-start gap-3 xl:flex 2xl:w-104">
      <div className="isolate flex max-h-[calc(100vh-16rem)] w-full flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
        <TypesetDocsContent />
      </div>
      <Button
        variant="link"
        size="sm"
        className="text-muted-foreground"
        render={<Link href="/docs/typeset" />}
        nativeButton={false}
      >
        Read the docs
      </Button>
    </div>
  )
}

export function TypesetDocsContent() {
  const [params] = useTypesetSearchParams()
  const [rawCss, setRawCss] = React.useState<string | null>(null)
  const [framework, setFramework] = React.useState<TemplateValue>("next")

  React.useEffect(() => {
    let active = true
    fetch("/typeset.css")
      .then((response) => response.text())
      .then((text) => {
        if (active) {
          setRawCss(text)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const fontPicks = [
    { token: "--typeset-font-body", id: params.body },
    { token: "--typeset-font-heading", id: params.heading },
    { token: "--typeset-font-mono", id: params.mono },
  ].filter((pick) => pick.id !== "inherit" && findFont(pick.id))

  const pickedFonts = [...new Set(fontPicks.map((pick) => pick.id))]
    .map((id) => findFontDefinition(id))
    .filter((definition) => definition !== undefined)

  const measureWidth = TYPESET_MEASURES.find(
    (option) => option.value === params.measure
  )?.width

  const presetName = `typeset-${params.item}`

  const headingId = params.heading === "inherit" ? params.body : params.heading

  const presetCss = `.${presetName} {
  --typeset-font-body: var(--font-${params.body});
  --typeset-font-heading: var(--font-${headingId});
  --typeset-font-mono: var(--font-${params.mono});
  --typeset-size: ${params.scale}px;
  --typeset-leading: ${params.leading};
  --typeset-flow: ${params.flow};
}`

  const preset = `/* globals.css */
@import "tailwindcss";
@import "./typeset.css";

${presetCss}`

  const usage = `<div className="typeset ${presetName} max-w-[${measureWidth}]">
  {content}
</div>`

  const fontStep =
    framework === "next"
      ? `Load the fonts in the root layout and update the HTML element:

${getNextFontCode(pickedFonts)}`
      : `Install the fonts:

${getFontsourceCommand(pickedFonts)}

Then import them in the main CSS file:

${getFontsourceCss(pickedFonts)}`

  const prompt = `Install shadcn/typeset in this project.

Typeset is a single stylesheet that styles rendered markdown: wrap the output in a \`typeset\` container and everything inside (headings, lists, tables, code, blockquotes, math) is styled. Everything outside is untouched.

1. Download ${absoluteUrl("/typeset.css")} and save it as typeset.css next to the project's main CSS file (where Tailwind is imported). If the file already exists, replace it with the downloaded copy.

2. Import it in the main CSS file, after the Tailwind import:

@import "./typeset.css";

3. ${fontStep}

4. Add this preset to the main CSS file, after the typeset import. If a class named .${presetName} already exists, update its values in place. Leave any other typeset-* presets untouched: they are separate surfaces:

${presetCss}

5. Do not apply the class anywhere yet. Search the project for surfaces that render markdown or rich content: react-markdown, Streamdown, or MDX components, dangerouslySetInnerHTML with parsed markdown, prose classes, CMS content renderers. Present the candidates you find as a short list and ask the user which surface should use typeset. Then wrap only the surface they pick:

${usage}

If the picked surface already has its own typography (a prose class, styled markdown components), list those styles and let the user decide what to remove before wrapping.

Notes:

- To exclude an embedded component from typeset styles, add the not-typeset class or the data-not-typeset attribute to it.
- Verify on the surface the user picked: headings, lists, tables, and code inside the container should be styled with no classes on the content itself.
- Docs: ${absoluteUrl("/docs/typeset")}`

  return (
    <Tabs defaultValue="docs" className="flex min-h-0 flex-1 flex-col gap-0">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <TabsList>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
        </TabsList>
        <FrameworkPicker value={framework} onValueChange={setFramework} />
      </div>
      <div className="min-h-0 flex-1 scroll-fade scrollbar-none overflow-y-auto p-4 md:p-6">
        <TabsContent value="docs" className="flex flex-col gap-6">
          <DocsSection step={1} title="Create typeset.css">
            <DocsProse>
              Copy the stylesheet into a{" "}
              <code className="font-mono">typeset.css</code> file next to your
              main CSS file, then import it:
            </DocsProse>
            <CopyCssButton css={rawCss} framework={framework} />
            <DocsCode>{`@import "tailwindcss";\n@import "./typeset.css";`}</DocsCode>
          </DocsSection>
          <DocsSection step={2} title="Add the fonts">
            <DocsFonts fonts={pickedFonts} framework={framework} />
          </DocsSection>
          <DocsSection step={3} title="Create your custom typeset">
            <DocsCode>{preset}</DocsCode>
          </DocsSection>
          <DocsSection step={4} title="Wrap your content">
            <DocsCode>{usage}</DocsCode>
          </DocsSection>
        </TabsContent>
        <TabsContent value="prompt" className="flex flex-col gap-2.5">
          <DocsProse>
            One prompt with your picks baked in. Copy it and paste it into your
            coding agent.
          </DocsProse>
          <DocsCode className="max-h-102 scroll-fade overflow-y-auto whitespace-pre-wrap">
            {prompt}
          </DocsCode>
          <CopyPromptButton prompt={prompt} framework={framework} />
        </TabsContent>
      </div>
    </Tabs>
  )
}

const FRAMEWORK_ITEMS = TEMPLATES.map((template) => ({
  value: template.value,
  label: template.title,
}))

function FrameworkPicker({
  value,
  onValueChange,
}: {
  value: TemplateValue
  onValueChange: (value: TemplateValue) => void
}) {
  return (
    <Select
      items={FRAMEWORK_ITEMS}
      value={value}
      onValueChange={(next) => onValueChange(next as TemplateValue)}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        <SelectGroup>
          {FRAMEWORK_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function toCamelCase(name: string) {
  return name.replace(/-(\w)/g, (_, char: string) => char.toUpperCase())
}

type PickedFonts = NonNullable<ReturnType<typeof findFontDefinition>>[]

function getNextFontCode(fonts: PickedFonts) {
  return [
    `// app/layout.tsx`,
    `import { ${fonts.map((font) => font.import).join(", ")} } from "next/font/google"`,
    "",
    ...fonts.map((font) =>
      [
        `const ${toCamelCase(font.name)} = ${font.import}({`,
        `  subsets: ${JSON.stringify(font.subsets)},`,
        ...("weight" in font
          ? [`  weight: ${JSON.stringify(font.weight)},`]
          : []),
        `  variable: "--font-${font.name}",`,
        `})`,
        "",
      ].join("\n")
    ),
    `<html className={\`${fonts.map((font) => `\${${toCamelCase(font.name)}.variable}`).join(" ")}\`}>`,
  ].join("\n")
}

function getFontsourceCommand(fonts: PickedFonts) {
  return `npm install ${fonts.map((font) => font.dependency).join(" ")}`
}

function getFontsourceCss(fonts: PickedFonts) {
  return [
    `/* globals.css */`,
    ...fonts.map((font) => `@import "${font.dependency}";`),
    "",
    ":root {",
    ...fonts.map((font) => `  --font-${font.name}: ${font.family};`),
    "}",
  ].join("\n")
}

function DocsFonts({
  fonts,
  framework,
}: {
  fonts: PickedFonts
  framework: TemplateValue
}) {
  const nextFontCode = getNextFontCode(fonts)
  const fontsourceCommand = getFontsourceCommand(fonts)
  const fontsourceCss = getFontsourceCss(fonts)

  return (
    <>
      {framework === "next" ? (
        <>
          <DocsProse>
            Load the fonts with <code className="font-mono">next/font</code> in
            your root layout:
          </DocsProse>
          <DocsCode>{nextFontCode}</DocsCode>
        </>
      ) : (
        <>
          <DocsCommand command={fontsourceCommand} />
          <DocsProse>Then import them in your CSS file:</DocsProse>
          <DocsCode>{fontsourceCss}</DocsCode>
        </>
      )}
    </>
  )
}

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const

// Same transforms the docs code pipeline uses (lib/highlight-code.ts).
function getCommandForPackageManager(
  packageManager: (typeof PACKAGE_MANAGERS)[number],
  command: string
) {
  if (packageManager === "pnpm") {
    return command.replace("npm install", "pnpm add").replace("npx", "pnpm dlx")
  }
  if (packageManager === "yarn") {
    return command.replace("npm install", "yarn add").replace("npx", "yarn dlx")
  }
  if (packageManager === "bun") {
    return command
      .replace("npm install", "bun add")
      .replace("npx", "bunx --bun")
  }
  return command
}

function DocsCommand({ command }: { command: string }) {
  const [config, setConfig] = useConfig()
  const packageManager = config.packageManager || "pnpm"

  return (
    <div className="rounded-lg bg-muted/60">
      <div className="flex items-center gap-3 px-3 pt-2">
        {PACKAGE_MANAGERS.map((pm) => (
          <button
            key={pm}
            type="button"
            data-active={pm === packageManager}
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
            onClick={() => setConfig({ ...config, packageManager: pm })}
          >
            {pm}
          </button>
        ))}
      </div>
      <pre className="scrollbar-none overflow-x-auto p-3 font-mono text-xs leading-relaxed">
        {getCommandForPackageManager(packageManager, command)}
      </pre>
    </div>
  )
}

function DocsCode({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div className="relative rounded-lg bg-muted/60">
      <pre
        className={cn(
          "scrollbar-none overflow-x-auto p-3 font-mono text-sm leading-relaxed",
          className
        )}
      >
        {children}
      </pre>
    </div>
  )
}

function CopyCssButton({
  css,
  framework,
}: {
  css: string | null
  framework: TemplateValue
}) {
  const [params] = useTypesetSearchParams()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  return (
    <Button
      variant="outline"
      className="w-fit"
      size="sm"
      disabled={!css}
      onClick={async () => {
        if (css) {
          await navigator.clipboard.writeText(css)
          setHasCopied(true)
          trackEvent({
            name: "copy_typeset_css",
            properties: {
              framework,
              body: params.body,
              heading: params.heading,
              mono: params.mono,
              scale: params.scale,
              measure: params.measure,
              leading: params.leading,
              flow: params.flow,
            },
          })
        }
      }}
    >
      {hasCopied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      Copy typeset.css
    </Button>
  )
}

function CopyPromptButton({
  prompt,
  framework,
}: {
  prompt: string
  framework: TemplateValue
}) {
  const [params] = useTypesetSearchParams()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  return (
    <Button
      variant="outline"
      className="w-fit"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(prompt)
        setHasCopied(true)
        trackEvent({
          name: "copy_typeset_prompt",
          properties: {
            framework,
            body: params.body,
            heading: params.heading,
            mono: params.mono,
            scale: params.scale,
            measure: params.measure,
            leading: params.leading,
            flow: params.flow,
          },
        })
      }}
    >
      {hasCopied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      Copy Prompt
    </Button>
  )
}

function DocsSection({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-sm font-medium">
        {step}. {title}
      </h3>
      {children}
    </section>
  )
}

function DocsProse({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
  )
}
