"use client"

import { CheckIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import CardsDefault from "@/registry/default/example/cards"
import CardsNewYork from "@/registry/new-york/example/cards"
import { Button } from "@/registry/new-york/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"
import { themes } from "@/registry/themes"

export function ThemesTabs() {
  const { theme: mode } = useTheme()
  const [config, setConfig] = useConfig()

  return (
    <TooltipProvider delayDuration={100}>
      <Tabs defaultValue="new-york" className="space-y-8">
        <div className="flex w-full items-center">
          <div className="flex w-1/4 items-center space-x-2">
            <TabsList className="rounded-[0.5rem]">
              <TabsTrigger value="new-york" className="rounded-[0.35rem]">
                New York
              </TabsTrigger>
              <TabsTrigger value="default" className="rounded-[0.35rem]">
                Default
              </TabsTrigger>
            </TabsList>
            <Popover>
              <PopoverTrigger>
                <InfoCircledIcon className="h-4 w-4" />
                <span className="sr-only">About styles</span>
              </PopoverTrigger>
              <PopoverContent
                className="space-y-3 rounded-[0.5rem] text-sm"
                sideOffset={15}
              >
                <p className="font-medium">
                  What is the difference between the New York and Default style?
                </p>
                <p>
                  A style comes with its own set of components, animations,
                  icons and more.
                </p>
                <p>
                  The <span className="font-medium">Default</span> style has
                  larger inputs, uses lucide-react for icons and
                  tailwindcss-animate for animations.
                </p>
                <p>
                  The <span className="font-medium">New York</span> style ships
                  with smaller buttons and cards with shadows. It uses icons
                  from Radix Icons.
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mx-auto flex h-9 items-center justify-center">
            {themes.map((theme) => {
              const isActive = config.theme === theme.name

              return (
                <Tooltip key={theme.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        setConfig({
                          ...config,
                          theme: theme.name,
                        })
                      }
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs",
                        isActive
                          ? "border-[--theme-primary]"
                          : "border-transparent"
                      )}
                      style={
                        {
                          "--theme-primary": `hsl(${
                            theme?.cssVars[mode === "dark" ? "dark" : "light"]
                              .primary
                          })`,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]"
                        )}
                      >
                        {isActive && (
                          <CheckIcon className="h-4 w-4 text-white" />
                        )}
                      </span>
                      <span className="sr-only">{theme.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
                  >
                    {theme.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
          <div className="flex w-1/4 items-center justify-end space-x-2">
            <Button className="rounded-[0.5rem]">Export</Button>
          </div>
        </div>
        <div>
          <TabsContent value="new-york">
            <CardsNewYork />
          </TabsContent>
          <TabsContent value="default">
            <CardsDefault />
          </TabsContent>
        </div>
      </Tabs>
    </TooltipProvider>
  )
}
