"use client"

import * as React from "react"
import template from "lodash/template"
import { Check, ClipboardIcon, Copy } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer"
import { Label } from "@/registry/new-york/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { Separator } from "@/registry/new-york/ui/separator"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import {
  BaseColor,
  baseColors,
  baseColorsOKLCH,
} from "@/registry/registry-base-colors"

import "@/styles/mdx.css"
import { toast } from "sonner"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"

interface BaseColorOKLCH {
  light: Record<string, string>
  dark: Record<string, string>
}

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="sm" className="md:hidden">
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6 pt-0">
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden items-center md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">Customize</Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="z-40 w-[340px] rounded-[12px] bg-white p-6 dark:bg-zinc-950"
          >
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
      <CopyCodeButton variant="ghost" size="sm" className="[&_svg]:hidden" />
    </div>
  )
}

export function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme: mode } = useTheme()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeWrapper defaultTheme="zinc">
      <div className="grid w-full flex-1 grid-cols-2 flex-wrap items-start gap-2 sm:flex sm:items-center md:gap-6">
        <div className="flex flex-col gap-2">
          <Label className="sr-only text-xs">Color</Label>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {baseColors
              .filter(
                (theme) =>
                  !["slate", "stone", "gray", "neutral"].includes(theme.name)
              )
              .map((theme) => {
                const isActive = config.theme === theme.name

                return mounted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    key={theme.name}
                    onClick={() => {
                      setConfig({
                        ...config,
                        theme: theme.name,
                      })
                    }}
                    className={cn(
                      "w-[32px] rounded-lg lg:px-2.5 xl:w-[86px]",
                      isActive && "border-primary/50 ring-[2px] ring-primary/30"
                    )}
                    style={
                      {
                        "--theme-primary": `hsl(${
                          theme?.activeColor[mode === "dark" ? "dark" : "light"]
                        })`,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[--theme-primary]"
                      )}
                    >
                      {isActive && <Check className="!size-2.5 text-white" />}
                    </span>
                    <span className="hidden xl:block">
                      {theme.label === "Zinc" ? "Default" : theme.label}
                    </span>
                  </Button>
                ) : (
                  <Skeleton
                    className="h-8 w-[32px] xl:w-[86px]"
                    key={theme.name}
                  />
                )
              })}
          </div>
        </div>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <div className="flex flex-col gap-2">
          <Label className="sr-only text-xs">Radius</Label>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
              return (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={value}
                  onClick={() => {
                    setConfig({
                      ...config,
                      radius: parseFloat(value),
                    })
                  }}
                  className={cn(
                    "w-[40px] rounded-lg",
                    config.radius === parseFloat(value) &&
                      "border-primary/50 ring-[2px] ring-primary/30"
                  )}
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <CopyCodeButton />
        </div>
      </div>
    </ThemeWrapper>
  )
}

export function CopyCodeButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            className={cn("h-8 rounded-lg shadow-none sm:hidden", className)}
            {...props}
          >
            Copy
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Theme</DrawerTitle>
            <DrawerDescription>
              Copy and paste the following code into your CSS file.
            </DrawerDescription>
          </DrawerHeader>
          <ThemeWrapper defaultTheme="zinc" className="relative px-6">
            <CustomizerCode />
          </ThemeWrapper>
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "hidden h-8 rounded-lg shadow-none sm:flex",
              className
            )}
            {...props}
          >
            Copy code
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl outline-none">
          <DialogHeader>
            <DialogTitle>Theme</DialogTitle>
            <DialogDescription>
              Copy and paste the following code into your CSS file.
            </DialogDescription>
          </DialogHeader>
          <ThemeWrapper defaultTheme="zinc" className="relative">
            <CustomizerCode />
          </ThemeWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CustomizerCode() {
  const [config] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [themeVersion, setThemeVersion] = React.useState("v4")
  const activeTheme = React.useMemo(
    () => baseColors.find((theme) => theme.name === config.theme),
    [config.theme]
  )
  const activeThemeOKLCH = React.useMemo(
    () => baseColorsOKLCH[config.theme as keyof typeof baseColorsOKLCH],
    [config.theme]
  )

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  }, [hasCopied])

  return (
    <ThemeWrapper defaultTheme="zinc" className="relative space-y-4">
      <Tabs value={themeVersion} onValueChange={setThemeVersion}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="v4">Tailwind v4</TabsTrigger>
            <TabsTrigger value="v3">v3</TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              copyToClipboardWithMeta(
                themeVersion === "v3"
                  ? getThemeCode(activeTheme, config.radius)
                  : getThemeCodeOKLCH(activeThemeOKLCH, config.radius),
                {
                  name: "copy_theme_code",
                  properties: {
                    theme: config.theme,
                    radius: config.radius,
                  },
                }
              )
              setHasCopied(true)
            }}
            className="absolute right-0 top-0 shadow-none"
          >
            {hasCopied ? <Check /> : <ClipboardIcon />}
            Copy
          </Button>
        </div>
        <TabsContent value="v4">
          <div data-rehype-pretty-code-fragment="">
            <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-white">&nbsp;:root &#123;</span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;
                </span>
                {Object.entries(activeThemeOKLCH?.light).map(([key, value]) => (
                  <span className="line text-white" key={key}>
                    &nbsp;&nbsp;&nbsp;--{key}: {value};
                  </span>
                ))}
                <span className="line text-white">&nbsp;&#125;</span>
                <span className="line text-white">&nbsp;</span>
                <span className="line text-white">&nbsp;.dark &#123;</span>
                {Object.entries(activeThemeOKLCH?.dark).map(([key, value]) => (
                  <span className="line text-white" key={key}>
                    &nbsp;&nbsp;&nbsp;--{key}: {value};
                  </span>
                ))}
                <span className="line text-white">&nbsp;&#125;</span>
              </code>
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="v3">
          <div data-rehype-pretty-code-fragment="">
            <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-white">@layer base &#123;</span>
                <span className="line text-white">
                  &nbsp;&nbsp;:root &#123;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                  {activeTheme?.cssVars.light["background"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
                  {activeTheme?.cssVars.light["foreground"]};
                </span>
                {[
                  "card",
                  "popover",
                  "primary",
                  "secondary",
                  "muted",
                  "accent",
                  "destructive",
                ].map((prefix) => (
                  <>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {
                        activeTheme?.cssVars.light[
                          prefix as keyof typeof activeTheme.cssVars.light
                        ]
                      }
                      ;
                    </span>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {
                        activeTheme?.cssVars.light[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                        ]
                      }
                      ;
                    </span>
                  </>
                ))}
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                  {activeTheme?.cssVars.light["border"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                  {activeTheme?.cssVars.light["input"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                  {activeTheme?.cssVars.light["ring"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                  (prefix) => (
                    <>
                      <span className="line text-white">
                        &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                        {
                          activeTheme?.cssVars.light[
                            prefix as keyof typeof activeTheme.cssVars.light
                          ]
                        }
                        ;
                      </span>
                    </>
                  )
                )}
                <span className="line text-white">&nbsp;&nbsp;&#125;</span>
                <span className="line text-white">&nbsp;</span>
                <span className="line text-white">
                  &nbsp;&nbsp;.dark &#123;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                  {activeTheme?.cssVars.dark["background"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
                  {activeTheme?.cssVars.dark["foreground"]};
                </span>
                {[
                  "card",
                  "popover",
                  "primary",
                  "secondary",
                  "muted",
                  "accent",
                  "destructive",
                ].map((prefix) => (
                  <>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {
                        activeTheme?.cssVars.dark[
                          prefix as keyof typeof activeTheme.cssVars.dark
                        ]
                      }
                      ;
                    </span>
                    <span className="line text-white">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {
                        activeTheme?.cssVars.dark[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                        ]
                      }
                      ;
                    </span>
                  </>
                ))}
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                  {activeTheme?.cssVars.dark["border"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                  {activeTheme?.cssVars.dark["input"]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                  {activeTheme?.cssVars.dark["ring"]};
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                  (prefix) => (
                    <>
                      <span className="line text-white">
                        &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                        {
                          activeTheme?.cssVars.dark[
                            prefix as keyof typeof activeTheme.cssVars.dark
                          ]
                        }
                        ;
                      </span>
                    </>
                  )
                )}
                <span className="line text-white">&nbsp;&nbsp;&#125;</span>
                <span className="line text-white">&#125;</span>
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </ThemeWrapper>
  )
}

function getThemeCodeOKLCH(theme: BaseColorOKLCH | undefined, radius: number) {
  if (!theme) {
    return ""
  }

  const rootSection =
    ":root {\n  --radius: " +
    radius +
    "rem;\n" +
    Object.entries(theme.light)
      .map((entry) => "  --" + entry[0] + ": " + entry[1] + ";")
      .join("\n") +
    "\n}\n\n.dark {\n" +
    Object.entries(theme.dark)
      .map((entry) => "  --" + entry[0] + ": " + entry[1] + ";")
      .join("\n") +
    "\n}\n"

  return rootSection
}

function getThemeCode(theme: BaseColor | undefined, radius: number) {
  if (!theme) {
    return ""
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    radius: radius.toString(),
  })
}

const BASE_STYLES_WITH_VARIABLES = `
@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: <%- radius %>rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}
`
