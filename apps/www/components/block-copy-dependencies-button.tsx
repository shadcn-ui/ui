"use client"

import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons"
import { CopyIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

import { CopyNpmCommandButton } from "./copy-button"

const BUTTON_STYLE =
  "inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5"

const generateCommands = (registryDependencies: string[]) => {
  /*
   * Remove any extra spaces and trim the dependencies
   * to ensure the command is formatted correctly.
   */
  const cleanedDependencies = registryDependencies.map((dep) =>
    dep.trim().replace(/\s+/g, " ")
  )

  return {
    __npmCommand__: `npx shadcn-ui@latest add ${cleanedDependencies.join(" ")}`,
    // TODO: No any examples for add shadcn-ui component with yarn so I not add the command for yarn yet.
    __yarnCommand__: `npx shadcn-ui@latest add ${cleanedDependencies.join(
      " "
    )}`,
    __pnpmCommand__: `pnpm dlx shadcn-ui@latest add ${cleanedDependencies.join(
      " "
    )}`,
    __bunCommand__: `bunx --bun shadcn-ui@latest add ${cleanedDependencies.join(
      " "
    )}`,
  }
}

export const BlockCopyDependenciesButton = ({
  registryDependencies,
}: {
  registryDependencies: string[]
}) => {
  const [hasCopied, setHasCopied] = React.useState(false)
  const commands = generateCommands(registryDependencies)

  const resetCopy = React.useCallback(() => {
    setHasCopied(false)
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(resetCopy, 2000)
    return () => clearTimeout(timer)
  }, [hasCopied, resetCopy])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <CopyNpmCommandButton
            commands={commands}
            className={BUTTON_STYLE}
            isBlockAction={true}
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? <CheckIcon /> : <CopyIcon />}
          </CopyNpmCommandButton>
        </div>
      </TooltipTrigger>
      <TooltipContent>Copy dependencies</TooltipContent>
    </Tooltip>
  )
}
