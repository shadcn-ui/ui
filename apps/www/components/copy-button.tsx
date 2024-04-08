"use client"

import * as React from "react"
import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu"
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons"
import { NpmCommands } from "types/unist"

import { Event, trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useMounted } from "@/hooks/use-mounted"
import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/registry/new-york/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/new-york/ui/tooltip"

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
  const [config, setConfig] = useConfig()
  const mounted = useMounted()

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

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
      setConfig((prev) => ({
        ...prev,
        pm,
      }))
    },
    []
  )

  const getCodeForLastUsedPm = React.useCallback(() => {
    switch (config.pm ?? "npm") {
      case "npm":
        return commands.__npmCommand__
      case "pnpm":
        return commands.__pnpmCommand__
      case "yarn":
        return commands.__yarnCommand__
      case "bun":
        return commands.__bunCommand__
      default:
        return commands.__npmCommand__
    }
  }, [
    commands.__bunCommand__,
    commands.__npmCommand__,
    commands.__pnpmCommand__,
    commands.__yarnCommand__,
    config,
  ])

  return (
    <div
      className={cn("flex flex-row items-center flex-nowrap gap-1", className)}
    >
      {config.pm ? (
        mounted ? (
          <Badge className="pointer-events-none text-white bg-[rgb(63_63_70_/_0.5)]">
            {config.pm}
          </Badge>
        ) : (
          <Skeleton className="h-6 w-12 rounded-md bg-zinc-300" />
        )
      ) : null}
      <ContextMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <ContextMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
                )}
                onClick={() => {
                  copyCommand(getCodeForLastUsedPm(), config.pm ?? "npm")
                }}
              >
                {hasCopied ? (
                  <CheckIcon className="h-3 w-3" />
                ) : (
                  <CopyIcon className="h-3 w-3" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </ContextMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Right click to change package manager</TooltipContent>
        </Tooltip>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={config.pm === "npm"}
            onClick={() => copyCommand(commands.__npmCommand__, "npm")}
          >
            npm
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={config.pm === "yarn"}
            onClick={() => copyCommand(commands.__yarnCommand__, "yarn")}
          >
            yarn
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={config.pm === "pnpm"}
            onClick={() => copyCommand(commands.__pnpmCommand__, "pnpm")}
          >
            pnpm
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={config.pm === "bun"}
            onClick={() => copyCommand(commands.__bunCommand__, "bun")}
          >
            bun
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
