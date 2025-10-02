"use client"

import * as React from "react"
import template from "lodash/template"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useThemeConfig } from "@/components/active-theme"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york-v4/ui/drawer"
import { Label } from "@/registry/new-york-v4/ui/label"
import { ScrollArea, ScrollBar } from "@/registry/new-york-v4/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import {
  BaseColor,
  baseColors,
  baseColorsOKLCH,
} from "@/registry/registry-base-colors"

interface BaseColorOKLCH {
  light: Record<string, string>
  dark: Record<string, string>
}

const THEMES = baseColors.filter(
  (theme) => !["slate", "stone", "gray", "zinc"].includes(theme.name)
)

export function ThemeCustomizer({ className }: React.ComponentProps<"div">) {
  const { activeTheme = "neutral", setActiveTheme } = useThemeConfig()

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <ScrollArea className="hidden max-w-[96%] md:max-w-[600px] lg:flex lg:max-w-none">
        <div className="flex items-center">
          {THEMES.map((theme) => (
            <Button
              key={theme.name}
              variant="link"
              size="sm"
              data-active={activeTheme === theme.name}
              className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 cursor-pointer items-center justify-center px-4 text-center text-base font-medium capitalize transition-colors hover:no-underline"
              onClick={() => setActiveTheme(theme.name)}
            >
              {theme.name === "neutral" ? "Default" : theme.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <div className="flex items-center gap-2 lg:hidden">
        <Label htmlFor="theme-selector" className="sr-only">
          Theme
        </Label>
        <Select
          value={activeTheme === "default" ? "neutral" : activeTheme}
          onValueChange={setActiveTheme}
        >
          <SelectTrigger
            id="theme-selector"
            size="sm"
            className="justify-start capitalize shadow-none *:data-[slot=select-value]:w-12 *:data-[slot=select-value]:capitalize"
          >
            <span className="font-medium">Theme:</span>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {THEMES.map((theme) => (
                <SelectItem
                  key={theme.name}
                  value={theme.name}
                  className="capitalize data-[state=checked]:opacity-50"
                >
                  {theme.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <CopyCodeButton variant="secondary" size="sm" className="ml-auto" />
    </div>
  )
}

export function CopyCodeButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  let { activeTheme: activeThemeName = "neutral" } = useThemeConfig()
  activeThemeName = activeThemeName === "default" ? "neutral" : activeThemeName

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className={cn("sm:hidden", className)} {...props}>
            Copy Code
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-auto">
          <DrawerHeader>
            <DrawerTitle className="capitalize">
              {activeThemeName === "neutral" ? "Default" : activeThemeName}
            </DrawerTitle>
            <DrawerDescription>
              Copy and paste the following code into your CSS file.
            </DrawerDescription>
          </DrawerHeader>
          <CustomizerCode themeName={activeThemeName} />
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={cn("hidden sm:flex", className)} {...props}>
            Copy Code
          </Button>
        </DialogTrigger>
        <DialogContent className="outline-none md:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {activeThemeName === "neutral" ? "Default" : activeThemeName}
            </DialogTitle>
            <DialogDescription>
              Copy and paste the following code into your CSS file.
            </DialogDescription>
          </DialogHeader>
          <CustomizerCode themeName={activeThemeName} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function CustomizerCode({ themeName }: { themeName: string }) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const [tailwindVersion, setTailwindVersion] = React.useState("v4")
  const activeTheme = React.useMemo(
    () => baseColors.find((theme) => theme.name === themeName),
    [themeName]
  )
  const activeThemeOKLCH = React.useMemo(
    () => baseColorsOKLCH[themeName as keyof typeof baseColorsOKLCH],
    [themeName]
  )

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  }, [hasCopied])

  return (
    <>
      <Tabs
        value={tailwindVersion}
        onValueChange={setTailwindVersion}
        className="min-w-0 px-4 pb-4 md:p-0"
      >
        <TabsList>
          <TabsTrigger value="v4">Tailwind v4</TabsTrigger>
          <TabsTrigger value="v3">Tailwind v3</TabsTrigger>
        </TabsList>
        <TabsContent value="v4">
          <figure
            data-rehype-pretty-code-figure
            className="!mx-0 mt-0 rounded-lg"
          >
            <figcaption
              className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
              data-rehype-pretty-code-title=""
              data-language="css"
              data-theme="github-dark github-light-default"
            >
              <Icons.css className="fill-foreground" />
              app/globals.css
            </figcaption>
            <pre className="no-scrollbar max-h-[300px] min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 md:max-h-[450px]">
              <Button
                data-slot="copy-button"
                size="icon"
                variant="ghost"
                className="bg-code text-code-foreground absolute top-3 right-2 z-10 size-7 shadow-none hover:opacity-100 focus-visible:opacity-100"
                onClick={() => {
                  copyToClipboardWithMeta(
                    tailwindVersion === "v3"
                      ? getThemeCode(activeTheme, 0.65)
                      : getThemeCodeOKLCH(activeThemeOKLCH, 0.65),
                    {
                      name: "copy_theme_code",
                      properties: {
                        theme: themeName,
                        radius: 0.5,
                      },
                    }
                  )
                  setHasCopied(true)
                }}
              >
                <span className="sr-only">Copy</span>
                {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
              </Button>
              <code data-line-numbers data-language="css">
                <span data-line className="line text-code-foreground">
                  &nbsp;:root &#123;
                </span>
                <span data-line className="line text-code-foreground">
                  &nbsp;&nbsp;&nbsp;--radius: 0.65rem;
                </span>
                {Object.entries(activeThemeOKLCH?.light).map(([key, value]) => (
                  <span
                    data-line
                    className="line text-code-foreground"
                    key={key}
                  >
                    &nbsp;&nbsp;&nbsp;--{key}: {value};
                  </span>
                ))}
                <span data-line className="line text-code-foreground">
                  &nbsp;&#125;
                </span>
                <span data-line className="line text-code-foreground">
                  &nbsp;
                </span>
                <span data-line className="line text-code-foreground">
                  &nbsp;.dark &#123;
                </span>
                {Object.entries(activeThemeOKLCH?.dark).map(([key, value]) => (
                  <span
                    data-line
                    className="line text-code-foreground"
                    key={key}
                  >
                    &nbsp;&nbsp;&nbsp;--{key}: {value};
                  </span>
                ))}
                <span data-line className="line text-code-foreground">
                  &nbsp;&#125;
                </span>
              </code>
            </pre>
          </figure>
        </TabsContent>
        <TabsContent value="v3">
          <figure
            data-rehype-pretty-code-figure
            className="!mx-0 mt-0 rounded-lg"
          >
            <figcaption
              className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
              data-rehype-pretty-code-title=""
              data-language="css"
              data-theme="github-dark github-light-default"
            >
              <Icons.css className="fill-foreground" />
              app/globals.css
            </figcaption>
            <pre className="no-scrollbar max-h-[300px] min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 md:max-h-[450px]">
              <Button
                data-slot="copy-button"
                size="icon"
                variant="ghost"
                className="bg-code text-code-foreground absolute top-3 right-2 z-10 size-7 shadow-none hover:opacity-100 focus-visible:opacity-100"
                onClick={() => {
                  copyToClipboardWithMeta(
                    tailwindVersion === "v3"
                      ? getThemeCode(activeTheme, 0.65)
                      : getThemeCodeOKLCH(activeThemeOKLCH, 0.65),
                    {
                      name: "copy_theme_code",
                      properties: {
                        theme: themeName,
                        radius: 0.5,
                      },
                    }
                  )
                  setHasCopied(true)
                }}
              >
                <span className="sr-only">Copy</span>
                {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
              </Button>
              <code data-line-numbers data-language="css">
                <span data-line className="line">
                  @layer base &#123;
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;:root &#123;
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                  {activeTheme?.cssVars.light["background"]};
                </span>
                <span data-line className="line">
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
                  <React.Fragment key={prefix}>
                    <span data-line className="line">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {
                        activeTheme?.cssVars.light[
                          prefix as keyof typeof activeTheme.cssVars.light
                        ]
                      }
                      ;
                    </span>
                    <span data-line className="line">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {
                        activeTheme?.cssVars.light[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                        ]
                      }
                      ;
                    </span>
                  </React.Fragment>
                ))}
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                  {activeTheme?.cssVars.light["border"]};
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                  {activeTheme?.cssVars.light["input"]};
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                  {activeTheme?.cssVars.light["ring"]};
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--radius: 0.5rem;
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                  (prefix) => (
                    <React.Fragment key={prefix}>
                      <span data-line className="line">
                        &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                        {
                          activeTheme?.cssVars.light[
                            prefix as keyof typeof activeTheme.cssVars.light
                          ]
                        }
                        ;
                      </span>
                    </React.Fragment>
                  )
                )}
                <span data-line className="line">
                  &nbsp;&nbsp;&#125;
                </span>
                <span data-line className="line">
                  &nbsp;
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;.dark &#123;
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                  {activeTheme?.cssVars.dark["background"]};
                </span>
                <span data-line className="line">
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
                  <React.Fragment key={prefix}>
                    <span data-line className="line">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      {
                        activeTheme?.cssVars.dark[
                          prefix as keyof typeof activeTheme.cssVars.dark
                        ]
                      }
                      ;
                    </span>
                    <span data-line className="line">
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                      {
                        activeTheme?.cssVars.dark[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                        ]
                      }
                      ;
                    </span>
                  </React.Fragment>
                ))}
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                  {activeTheme?.cssVars.dark["border"]};
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                  {activeTheme?.cssVars.dark["input"]};
                </span>
                <span data-line className="line">
                  &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                  {activeTheme?.cssVars.dark["ring"]};
                </span>
                {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                  (prefix) => (
                    <React.Fragment key={prefix}>
                      <span data-line className="line">
                        &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                        {
                          activeTheme?.cssVars.dark[
                            prefix as keyof typeof activeTheme.cssVars.dark
                          ]
                        }
                        ;
                      </span>
                    </React.Fragment>
                  )
                )}
                <span data-line className="line">
                  &nbsp;&nbsp;&#125;
                </span>
                <span data-line className="line">
                  &#125;
                </span>
              </code>
            </pre>
          </figure>
        </TabsContent>
      </Tabs>
    </>
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
