"use client"

import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = useConfig()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"

  return (
    <div
      className={cn(
        `theme-${defaultTheme || config.theme}`,
        "w-full",
        className
      )}
      style={
        {
          "--background": isLight
            ? config.light.background
            : config.dark.background,
          "--foreground": isLight
            ? config.light.foreground
            : config.dark.foreground,
          "--card": isLight ? config.light.card : config.dark.card,
          "--card-foreground": isLight
            ? config.light["card-foreground"]
            : config.dark["card-foreground"],
          "--primary": isLight ? config.light.primary : config.dark.primary,
          "--primary-foreground": isLight
            ? config.light["primary-foreground"]
            : config.dark["primary-foreground"],
          "--secondary": isLight
            ? config.light.secondary
            : config.dark.secondary,
          "--secondary-foreground": isLight
            ? config.light["secondary-foreground"]
            : config.dark["secondary-foreground"],

          "--popover": isLight ? config.light.popover : config.dark.popover,
          "--popover-foreground": isLight
            ? config.light["popover-foreground"]
            : config.dark["popover-foreground"],
          "--muted": isLight ? config.light.muted : config.dark.muted,
          "--muted-foreground": isLight
            ? config.light["muted-foreground"]
            : config.dark["muted-foreground"],
          "--destructive": isLight
            ? config.light.destructive
            : config.dark.destructive,
          "--destructive-foreground": isLight
            ? config.light["destructive-foreground"]
            : config.dark["destructive-foreground"],
          "--accent": isLight ? config.light.accent : config.dark.accent,
          "--accent-foreground": isLight
            ? config.light["accent-foreground"]
            : config.dark["accent-foreground"],
          "--border": isLight ? config.light.border : config.dark.border,
          "--ring": isLight ? config.light.ring : config.dark.ring,
          "--input": isLight ? config.light.input : config.dark.input,
          "--radius": `${defaultTheme ? 0.5 : config.radius}rem`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
