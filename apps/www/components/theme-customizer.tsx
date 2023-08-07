"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import {
  CheckIcon,
  ChevronDownIcon,
  Cross2Icon,
  InfoCircledIcon,
} from "@radix-ui/react-icons"
import { VariantProps, cva } from "class-variance-authority"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york/ui/sheet"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { themes } from "@/registry/themes"

export function ThemeCustomizer() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme: setMode, resolvedTheme: mode } = useTheme()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          Customize <ChevronDownIcon className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
      >
        <ThemeWrapper defaultTheme="zinc" className="flex flex-col space-y-6">
          <div className="space-y-1">
            <div className="font-semibold leading-none tracking-tight">
              Customize
            </div>
            <div className="text-xs text-muted-foreground">
              Pick a style and color for your components.
            </div>
          </div>
          <div className="flex flex-1 flex-col space-y-6">
            <div className="space-y-1.5">
              <div className="flex w-full items-center">
                <Label className="text-xs">Style</Label>
                <Popover>
                  <PopoverTrigger>
                    <InfoCircledIcon className="ml-1 h-3 w-3" />
                    <span className="sr-only">About styles</span>
                  </PopoverTrigger>
                  <PopoverContent
                    className="space-y-3 rounded-[0.5rem] text-sm"
                    side="right"
                    align="start"
                    alignOffset={-20}
                  >
                    <p className="font-medium">
                      What is the difference between the New York and Default
                      style?
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
                      The <span className="font-medium">New York</span> style
                      ships with smaller buttons and cards with shadows. It uses
                      icons from Radix Icons.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(config.style === "default" && "border-primary")}
                  onClick={() => setConfig({ ...config, style: "default" })}
                >
                  Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    config.style === "new-york" && "border-primary"
                  )}
                  onClick={() => setConfig({ ...config, style: "new-york" })}
                >
                  New York
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => {
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
                        "justify-start",
                        isActive && "border-primary"
                      )}
                      style={
                        {
                          "--theme-primary": `hsl(${
                            theme?.activeColor[
                              mode === "dark" ? "dark" : "light"
                            ]
                          })`,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className={cn(
                          "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                        )}
                      >
                        {isActive && (
                          <CheckIcon className="h-4 w-4 text-white" />
                        )}
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
                      variant="outline"
                      size="sm"
                      key={value}
                      onClick={() => {
                        setConfig({
                          ...config,
                          radius: parseFloat(value),
                        })
                      }}
                      className={cn(
                        config.radius === parseFloat(value) && "border-primary"
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
                      variant="outline"
                      size="sm"
                      className={cn(mode === "light" && "border-primary")}
                      onClick={() => setMode("light")}
                    >
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(mode === "dark" && "border-primary")}
                      onClick={() => setMode("dark")}
                    >
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
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="rounded-[0.5rem]"
              onClick={() => {
                setConfig({
                  ...config,
                  theme: "zinc",
                  radius: 0.5,
                })
              }}
            >
              Reset
            </Button>
            <Button className="ml-auto rounded-[0.5rem]">Export</Button>
          </div>
        </ThemeWrapper>
      </PopoverContent>
    </Popover>
  )
}

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName
