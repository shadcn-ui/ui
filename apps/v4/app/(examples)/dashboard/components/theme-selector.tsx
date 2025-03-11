"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { THEMES } from "@/lib/themes"
import { useThemeConfig } from "@/components/active-theme"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/new-york-v4/ui/sidebar"

export function ThemeSelector() {
  const { resolvedTheme } = useTheme()
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Theme</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {THEMES.map((theme) => (
            <SidebarMenuItem key={theme.name}>
              <SidebarMenuButton
                isActive={activeTheme === theme.value}
                onClick={() => setActiveTheme(theme.value)}
              >
                <div
                  className={`flex size-4 items-center gap-2 theme-${theme.value}`}
                >
                  <div
                    className="size-3.5 rounded-full bg-(--color)"
                    style={
                      isMounted
                        ? ({
                            "--color":
                              theme.colors[
                                resolvedTheme as keyof typeof theme.colors
                              ],
                          } as React.CSSProperties)
                        : undefined
                    }
                  />
                </div>
                {theme.name}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
