"use client"

import * as React from "react"
import template from "lodash/template"
import { Check, Copy, Moon, Repeat, Sun } from "lucide-react"
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
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer"
import { Label } from "@/registry/new-york/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"
import { BaseColor, baseColors } from "@/registry/registry-base-colors"

import "@/styles/mdx.css"

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

function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme: setMode, resolvedTheme: mode } = useTheme()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeWrapper
      defaultTheme="zinc"
      className="flex flex-col space-y-4 md:space-y-6"
    >
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            Theme Customizer
          </div>
          <div className="text-xs text-muted-foreground">
            Customize your components colors.
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setConfig({
              ...config,
              theme: "zinc",
              radius: 0.5,
            })
          }}
        >
          <Repeat />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {baseColors
              .filter(
                (theme) =>
                  !["slate", "stone", "gray", "neutral"].includes(theme.name)
              )
              .map((theme) => {
                const isActive = config.theme === theme.name

                return mounted ? (
                  <Button
                    variant={"outline"}
                    size="sm"
                    key={theme.name}
                    onClick={() => {
                      setConfig({
                        ...config,
                        theme: theme.name,
                      })
                    }}
                    className={cn(
                      "justify-start",
                      isActive && "border-2 border-primary"
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
                        "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                      )}
                    >
                      {isActive && <Check className="h-4 w-4 text-white" />}
                    </span>
                    {theme.label}
                  </Button>
                ) : (
                  <Skeleton className="h-8 w-full" key={theme.name} />
                )
              })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Radius</Label>
          <div className="grid grid-cols-5 gap-2">
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
                    config.radius === parseFloat(value) &&
                      "border-2 border-primary"
                  )}
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("light")}
                  className={cn(mode === "light" && "border-2 border-primary")}
                >
                  <Sun className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("dark")}
                  className={cn(mode === "dark" && "border-2 border-primary")}
                >
                  <Moon className="mr-1 -translate-x-1" />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeWrapper>
  )
}

function CopyCodeButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const [config] = useConfig()
  const activeTheme = baseColors.find((theme) => theme.name === config.theme)
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <>
      {activeTheme && (
        <Button
          onClick={() => {
            copyToClipboardWithMeta(getThemeCode(activeTheme, config.radius), {
              name: "copy_theme_code",
              properties: {
                theme: activeTheme.name,
                radius: config.radius,
              },
            })
            setHasCopied(true)
          }}
          className={cn("md:hidden", className)}
          {...props}
        >
          {hasCopied ? <Check /> : <Copy />}
          Copy code
        </Button>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button className={cn("hidden md:flex", className)} {...props}>
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
            {activeTheme && (
              <Button
                size="sm"
                onClick={() => {
                  copyToClipboardWithMeta(
                    getThemeCode(activeTheme, config.radius),
                    {
                      name: "copy_theme_code",
                      properties: {
                        theme: activeTheme.name,
                        radius: config.radius,
                      },
                    }
                  )
                  setHasCopied(true)
                }}
                className="absolute right-4 top-4 bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                {hasCopied ? <Check /> : <Copy />}
                Copy
              </Button>
            )}
          </ThemeWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CustomizerCode() {
  const [config] = useConfig()
  const activeTheme = baseColors.find((theme) => theme.name === config.theme)

  return (
    <ThemeWrapper defaultTheme="zinc" className="relative space-y-4">
      <div data-rehype-pretty-code-fragment="">
        <pre className="max-h-[450px] max-w-[622px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            <span className="line text-white">:root &#123;</span>
            <span className="line text-white">
              &nbsp;&nbsp;--background: light-dark(
              {activeTheme?.cssVars.light["background"]},{" "}
              {activeTheme?.cssVars.dark["background"]});
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;--foreground: light-dark(
              {activeTheme?.cssVars.light["foreground"]},{" "}
              {activeTheme?.cssVars.dark["foreground"]});
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
                  &nbsp;&nbsp;--{prefix}: light-dark(
                  {
                    activeTheme?.cssVars.light[
                      prefix as keyof typeof activeTheme.cssVars.light
                    ]
                  }
                  ,{" "}
                  {
                    activeTheme?.cssVars.dark[
                      prefix as keyof typeof activeTheme.cssVars.dark
                    ]
                  }
                  );
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;--{prefix}-foreground: light-dark(
                  {
                    activeTheme?.cssVars.light[
                      `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                    ]
                  }
                  ,
                  {
                    activeTheme?.cssVars.dark[
                      `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                    ]
                  }
                  );
                </span>
              </>
            ))}
            <span className="line text-white">
              &nbsp;&nbsp;--border: light-dark(
              {activeTheme?.cssVars.light["border"]},{" "}
              {activeTheme?.cssVars.dark["border"]});
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;--input: light-dark(
              {activeTheme?.cssVars.light["input"]},{" "}
              {activeTheme?.cssVars.dark["input"]});
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;--ring: light-dark(
              {activeTheme?.cssVars.light["ring"]},{" "}
              {activeTheme?.cssVars.dark["ring"]});
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;--radius: {config.radius}rem;
            </span>
            {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
              (prefix) => (
                <>
                  <span className="line text-white">
                    &nbsp;&nbsp;--{prefix}: light-dark(
                    {
                      activeTheme?.cssVars.light[
                        prefix as keyof typeof activeTheme.cssVars.light
                      ]
                    }
                    ,{" "}
                    {
                      activeTheme?.cssVars.dark[
                        prefix as keyof typeof activeTheme.cssVars.dark
                      ]
                    }
                    );
                  </span>
                </>
              )
            )}
            <span className="line text-white">&#125;</span>
          </code>
        </pre>
      </div>
    </ThemeWrapper>
  )
}

function getThemeCode(theme: BaseColor, radius: number) {
  if (!theme) {
    return ""
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    radius,
  })
}

const BASE_STYLES_WITH_VARIABLES = `
:root {
  --background: light-dark(<%- colors.light["background"] %>, <%- colors.dark["background"] %>);
  --foreground: light-dark(<%- colors.light["foreground"] %>, <%- colors.dark["foreground"] %>);
  --card: light-dark(<%- colors.light["card"] %>, <%- colors.dark["card"] %>);
  --card-foreground: light-dark(<%- colors.light["card-foreground"] %>, <%- colors.dark["card-foreground"] %>);
  --popover: light-dark(<%- colors.light["popover"] %>, <%- colors.dark["popover"] %>);
  --popover-foreground: light-dark(<%- colors.light["popover-foreground"] %>, <%- colors.dark["popover-foreground"] %>);
  --primary: light-dark(<%- colors.light["primary"] %>, <%- colors.dark["primary"] %>);
  --primary-foreground: light-dark(<%- colors.light["primary-foreground"] %>, <%- colors.dark["primary-foreground"] %>);
  --secondary: light-dark(<%- colors.light["secondary"] %>, <%- colors.dark["secondary"] %>);
  --secondary-foreground: light-dark(<%- colors.light["secondary-foreground"] %>, <%- colors.dark["secondary-foreground"] %>);
  --muted: light-dark(<%- colors.light["muted"] %>, <%- colors.dark["muted"] %>);
  --muted-foreground: light-dark(<%- colors.light["muted-foreground"] %>, <%- colors.dark["muted-foreground"] %>);
  --accent: light-dark(<%- colors.light["accent"] %>, <%- colors.dark["accent"] %>);
  --accent-foreground: light-dark(<%- colors.light["accent-foreground"] %>, <%- colors.dark["accent-foreground"] %>);
  --destructive: light-dark(<%- colors.light["destructive"] %>, <%- colors.dark["destructive"] %>);
  --destructive-foreground: light-dark(<%- colors.light["destructive-foreground"] %>, <%- colors.dark["destructive-foreground"] %>);
  --border: light-dark(<%- colors.light["border"] %>, <%- colors.dark["border"] %>);
  --input: light-dark(<%- colors.light["input"] %>, <%- colors.dark["input"] %>);
  --ring: light-dark(<%- colors.light["ring"] %>, <%- colors.dark["ring"] %>);
  --radius: <%- radius %>rem;
  --chart-1: light-dark(<%- colors.light["chart-1"] %>, <%- colors.dark["chart-1"] %>);
  --chart-2: light-dark(<%- colors.light["chart-2"] %>, <%- colors.dark["chart-2"] %>);
  --chart-3: light-dark(<%- colors.light["chart-3"] %>, <%- colors.dark["chart-3"] %>);
  --chart-4: light-dark(<%- colors.light["chart-4"] %>, <%- colors.dark["chart-4"] %>);
  --chart-5: light-dark(<%- colors.light["chart-5"] %>, <%- colors.dark["chart-5"] %>);
}
`
