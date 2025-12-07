"use client"

import * as React from "react"
import { useParams, useSearchParams } from "next/navigation"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function CreateProjectDialog() {
  const [open, setOpen] = React.useState(false)
  const { base } = useParams()
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })
  const [hasCopied, setHasCopied] = React.useState(false)

  const command = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const url = `${origin}/init?base=${base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}`
    return `pnpm shadcn create --preset ${url} -c ~/Playground`
  }, [
    base,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.menuAccent,
    params.menuColor,
    params.radius,
  ])

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    copyToClipboardWithMeta(command, {
      name: "copy_npm_command",
      properties: {
        command,
      },
    })
    setOpen(false)
    setHasCopied(true)
  }, [command, setOpen])

  return (
    <div className="bg-background sticky bottom-0 flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-[31px] flex-1 rounded-lg">
            Create Project
          </Button>
        </DialogTrigger>
        <DialogContent className="dialog-ring sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Install shadcn/ui</DialogTitle>
            <DialogDescription>
              Run this command to start a new shadcn/ui project with your
              selected configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-surface text-surface-foreground relative overflow-hidden rounded-lg p-4">
            <div className="no-scrollbar overflow-x-auto pr-10">
              <code className="font-mono text-sm whitespace-nowrap">
                {command}
              </code>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Open in <Icons.v0 className="size-5" />
            </Button>
            <Button size="sm" onClick={handleCopy}>
              Copy Command
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
