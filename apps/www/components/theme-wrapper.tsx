"use client"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"

export function ThemeWrapper({ children }: React.ComponentProps<"div">) {
  const [config] = useConfig()

  return <div className={cn(`theme-${config.theme}`, "w-full")}>{children}</div>
}
