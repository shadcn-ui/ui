"use client"

import * as React from "react"
import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu"
import { CheckIcon, CopyIcon, GearIcon } from "@radix-ui/react-icons"
import { NpmCommands, PackageManagerData } from "types/unist"

import { Event, trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  src?: string
  event?: Event["name"]
}

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  navigator.clipboard.writeText(value)
  if (event) {
    trackEvent(event)
  }
}

export function CopyButton({
  value,
  className,
  src,
  event,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        className
      )}
      onClick={() => {
        copyToClipboardWithMeta(
          value,
          event
            ? {
                name: event,
                properties: {
                  code: value,
                },
              }
            : undefined
        )
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <CheckIcon className="h-3 w-3" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </Button>
  )
}

interface CopyWithClassNamesProps extends DropdownMenuTriggerProps {
  value: string
  classNames: string
  className?: string
}

export function CopyWithClassNames({
  value,
  classNames,
  className,
  ...props
}: CopyWithClassNamesProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyToClipboard = React.useCallback((value: string) => {
    copyToClipboardWithMeta(value)
    setHasCopied(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
            className
          )}
        >
          {hasCopied ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <CopyIcon className="h-3 w-3" />
          )}
          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => copyToClipboard(value)}>
          Component
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipboard(classNames)}>
          Classname
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface CopyNpmCommandButtonProps extends DropdownMenuTriggerProps {
  commands: Required<NpmCommands>
}

export function CopyNpmCommandButton({
  commands,
  className,
  ...props
}: CopyNpmCommandButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const [preferredPackageManager, setPreferredPackageManager] = React.useState<
    "npm" | "pnpm" | "yarn" | "bun" | undefined
  >(undefined)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  React.useEffect(() => {
    const pmStorage = localStorage.getItem("ppm") // ppm = preferred package manager
    if (pmStorage != null) {
      const pmData = JSON.parse(pmStorage) as PackageManagerData
      if (pmData?.preferred !== undefined) {
        setPreferredPackageManager(pmData.preferred)
      }
    }
  }, [])

  const copyCommand = React.useCallback(
    (value: string, pm: "npm" | "pnpm" | "yarn" | "bun") => {
      copyToClipboardWithMeta(value, {
        name: "copy_npm_command",
        properties: {
          command: value,
          pm,
        },
      })
      setHasCopied(true)

      const pmStorage = localStorage.getItem("ppm") // ppm = preferred package manager
      if (pmStorage == null) {
        localStorage.setItem(
          "ppm",
          JSON.stringify({
            bun: pm === "bun" ? 1 : 0,
            npm: pm === "npm" ? 1 : 0,
            pnpm: pm === "pnpm" ? 1 : 0,
            yarn: pm === "yarn" ? 1 : 0,
            preferred: undefined,
          } satisfies PackageManagerData)
        )
      } else {
        const pmData = JSON.parse(pmStorage) as PackageManagerData
        pmData[pm] += 1
        if (
          (pmData.preferred === undefined && pmData[pm] >= 3) ||
          (pmData.preferred !== pm &&
            pmData.preferred !== undefined &&
            pmData[pm] > pmData[pmData.preferred] + 3)
        ) {
          pmData.preferred = pm
        }
        localStorage.setItem("ppm", JSON.stringify(pmData))
      }
    },
    []
  )
  const setPackageManager = React.useCallback(
    (pm: "npm" | "pnpm" | "yarn" | "bun") => {
      localStorage.setItem(
        "ppm",
        JSON.stringify({
          bun: pm === "bun" ? 1 : 0,
          npm: pm === "npm" ? 1 : 0,
          pnpm: pm === "pnpm" ? 1 : 0,
          yarn: pm === "yarn" ? 1 : 0,
          preferred: pm,
        } satisfies PackageManagerData)
      )
      setPreferredPackageManager(pm)
    },
    []
  )
  const settingsClicked = React.useCallback(
    (value: string, pm: "npm" | "pnpm" | "yarn" | "bun") => {
      if (preferredPackageManager !== undefined) {
        setPackageManager(pm)
      } else {
        copyCommand(value, pm)
      }
    },
    [copyCommand, preferredPackageManager, setPackageManager]
  )

  return (
    <div className={cn("relative z-10 flex gap-1", className)}>
      {/* Settings or Wildcard Package Manager Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
          >
            {preferredPackageManager === undefined ? (
              <>
                {hasCopied ? (
                  <CheckIcon className="h-3 w-3" />
                ) : (
                  <CopyIcon className="h-3 w-3" />
                )}
                <span className="sr-only">Copy</span>
              </>
            ) : (
              <GearIcon className="h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => settingsClicked(commands.__npmCommand__, "npm")}
            className="flex items-center"
          >
            {preferredPackageManager === "npm" && (
              <CheckIcon className="mr-2 h-4 w-4" />
            )}
            <span className="flex-1">npm</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => settingsClicked(commands.__yarnCommand__, "yarn")}
          >
            {preferredPackageManager === "yarn" && (
              <CheckIcon className="mr-2 h-4 w-4" />
            )}
            <span className="flex-1">yarn</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => settingsClicked(commands.__pnpmCommand__, "pnpm")}
          >
            {preferredPackageManager === "pnpm" && (
              <CheckIcon className="mr-2 h-4 w-4" />
            )}
            <span className="flex-1">pnpm</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => settingsClicked(commands.__bunCommand__, "bun")}
          >
            {preferredPackageManager === "bun" && (
              <CheckIcon className="mr-2 h-4 w-4" />
            )}
            <span className="flex-1">bun</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preferred Package Manager Quick Copy */}
      {preferredPackageManager !== undefined && (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
          onClick={() => {
            if (preferredPackageManager !== undefined) {
              copyCommand(
                commands[`__${preferredPackageManager}Command__` as const],
                preferredPackageManager
              )
            }
          }}
        >
          {hasCopied ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <CopyIcon className="h-3 w-3" />
          )}
          <span className="sr-only">Copy</span>
        </Button>
      )}
    </div>
  )
}
