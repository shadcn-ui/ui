"use client"

import * as React from "react"
import { ComputerTerminal01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"
import { toast } from "sonner"

import { useConfig } from "@/hooks/use-config"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ToolbarControls() {
  const [open, setOpen] = React.useState(false)
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  const packageManager = config.packageManager || "pnpm"

  const commands = React.useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const url = `${origin}/init?base=${params.base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}`
    const templateFlag = params.template ? ` --template ${params.template}` : ""
    return {
      pnpm: `pnpm dlx shadcn create ${url}${templateFlag} -c ~/Playground`,
      npm: `npx shadcn create ${url}${templateFlag} -c ~/Playground`,
      yarn: `yarn dlx shadcn create ${url}${templateFlag} -c ~/Playground`,
      bun: `bunx --bun shadcn create ${url}${templateFlag} -c ~/Playground`,
    }
  }, [
    params.base,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.menuAccent,
    params.menuColor,
    params.radius,
    params.template,
  ])

  const command = commands[packageManager]

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    const properties: Record<string, string> = {
      command,
    }
    if (params.template) {
      properties.template = params.template
    }
    copyToClipboardWithMeta(command, {
      name: "copy_npm_command",
      properties,
    })
    setOpen(false)
    setHasCopied(true)
    toast("Command copied to clipboard.")
  }, [command, params.template, setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="hidden h-[31px] rounded-lg pl-2 md:flex">
          <HugeiconsIcon
            icon={ComputerTerminal01Icon}
            className="hidden xl:flex"
          />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-ring max-w-sm min-w-0 rounded-xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Run this command to start a new shadcn/ui project with your selected
            configuration.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={packageManager}
          onValueChange={(value) => {
            setConfig({
              ...config,
              packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
            })
          }}
          className="min-w-0"
        >
          <TabsList>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
            <TabsTrigger value="bun">bun</TabsTrigger>
          </TabsList>
          {Object.entries(commands).map(([key, cmd]) => {
            return (
              <TabsContent key={key} value={key}>
                <div className="bg-surface text-surface-foreground relative overflow-hidden rounded-lg p-4">
                  <div className="no-scrollbar overflow-x-auto pr-10">
                    <code className="font-mono text-sm whitespace-nowrap">
                      {cmd}
                    </code>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
        <DialogFooter>
          <Button size="sm" onClick={handleCopy} className="w-full">
            Copy Command
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
