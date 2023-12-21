"use client"

import { useEffect, useRef, useState } from "react"

import { NpmCommands } from "@/types/unist"
import { Event } from "@/lib/events"
import { cn } from "@/lib/utils"
import { CopyButton, CopyNpmCommandButton } from "@/components/copy-button"

const __src__ = ""
const __event__: Event = {
  name: "copy_martplace_code",
}
const __style__ = "new-york"
const __rawString__ = "new-york"

/**
 * This is a custom pre specifically for serverside mdx rendering.
 *
 * It adds a copy button to the top right of the pre.
 */

export const Pre = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) => {
  const [__rawString__, setRaw] = useState<string>()
  const [cmd, setCMD] = useState<Required<NpmCommands>>()
  const pre = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const raw = getCMD(pre.current?.innerText || "")

    if (raw) setCMD(raw)
    else setRaw(pre.current?.innerText)
  }, [])

  return (
    <div className="relative mb-4 mt-6">
      <pre
        className={cn(
          "max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 p-4 dark:bg-zinc-900",
          className
        )}
        ref={pre}
        {...props}
      />
      {!cmd ? (
        __rawString__ && (
          <CopyButton
            value={__rawString__}
            event={__event__.name}
            className={cn("absolute right-4 top-4")}
          />
        )
      ) : (
        <CopyNpmCommandButton
          commands={{ ...cmd }}
          className={cn("absolute right-4 top-4")}
        />
      )}
    </div>
  )
}

export const Code = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <code
    className={cn(
      "relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm",
      className
    )}
    {...props}
  />
)

const getCMD = (cmd: string): Required<NpmCommands> | undefined => {
  let __npmCommand__ = cmd
  let __yarnCommand__
  let __pnpmCommand__
  let __bunCommand__

  // npm install.
  if (cmd.startsWith("npm install")) {
    __yarnCommand__ = cmd.replace("npm install", "yarn add")
    __pnpmCommand__ = cmd.replace("npm install", "pnpm add")
    __bunCommand__ = cmd.replace("npm install", "bun add")
  }

  // npx create.
  else if (cmd.startsWith("npx create-")) {
    __yarnCommand__ = cmd.replace("npx create-", "yarn create ")
    __pnpmCommand__ = cmd.replace("npx create-", "pnpm create ")
    __bunCommand__ = cmd.replace("npx", "bunx --bun")
  }

  // npx.
  else if (cmd.startsWith("npx") && !cmd.startsWith("npx create-")) {
    __yarnCommand__ = cmd
    __pnpmCommand__ = cmd.replace("npx", "pnpm dlx")
    __bunCommand__ = cmd.replace("npx", "bunx --bun")
  } else return undefined

  return {
    __bunCommand__,
    __npmCommand__,
    __pnpmCommand__,
    __yarnCommand__,
  }
}
