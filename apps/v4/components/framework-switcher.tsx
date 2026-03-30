"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { hasComponentForBase } from "@/lib/framework-components"
import { cn } from "@/lib/utils"
import { useFramework } from "@/hooks/use-framework"
import {
  getDefaultBaseForFramework,
  getFrameworkForBase,
} from "@/registry/frameworks"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"

const FRAMEWORK_OPTIONS = [
  { value: "react" as const, label: "React" },
  { value: "vue" as const, label: "Vue" },
  { value: "svelte" as const, label: "Svelte" },
]

export function FrameworkSwitcher({ className }: { className?: string }) {
  const { framework, setFramework } = useFramework()
  const pathname = usePathname()
  const router = useRouter()

  // Sync framework preference from URL when on a component page.
  React.useEffect(() => {
    const match = pathname.match(
      /\/docs\/components\/(radix|base|vue|svelte)\//
    )
    if (match) {
      const urlFramework = getFrameworkForBase(match[1]).name
      if (urlFramework !== framework) {
        setFramework(urlFramework as "react" | "vue" | "svelte")
      }
    }
  }, [pathname, framework, setFramework])

  const currentLabel =
    FRAMEWORK_OPTIONS.find((o) => o.value === framework)?.label ?? "React"

  function handleSelect(value: "react" | "vue" | "svelte") {
    setFramework(value)

    const componentMatch = pathname.match(
      /\/docs\/components\/(radix|base|vue|svelte)\/(.+)/
    )
    if (componentMatch) {
      const component = componentMatch[2]
      const targetBase = getDefaultBaseForFramework(value)

      if (hasComponentForBase(targetBase, component)) {
        router.push(`/docs/components/${targetBase}/${component}`)
      } else {
        // Component doesn't exist for this framework yet.
        // Navigate to the components index page.
        router.push("/docs/components")
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 gap-1 px-2 text-sm font-medium", className)}
        >
          {currentLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3 opacity-50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="sr-only">Switch framework</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {FRAMEWORK_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            data-active={framework === option.value}
            className="data-[active=true]:font-medium"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
