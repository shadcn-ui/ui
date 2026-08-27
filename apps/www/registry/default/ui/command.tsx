"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: React.ComponentProps<"pre"> & {
  __npm__?: string
  __yarn__?: string
  __pnpm__?: string
  __bun__?: string
}) {
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const packageManager = config.packageManager || "pnpm"
  const tabs = React.useMemo(() => ({
    pnpm: __pnpm__,
    npm: __npm__,
    yarn: __yarn__,
    bun: __bun__,
  }), [__npm__, __pnpm__, __yarn__, __bun__])

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager as keyof typeof tabs]
    if (!command) return
    copyToClipboardWithMeta(command, {
      name: "copy_npm_command",
      properties: { command, pm: packageManager },
    })
    setHasCopied(true)
  }, [packageManager, tabs])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="overflow-x-auto" onKeyDown={handleKeyDown}>
      <Tabs
        value={packageManager}
        className="gap-0"
        onValueChange={(value) => {
          setConfig({ ...config, packageManager: value as "pnpm" | "npm" | "yarn" | "bun" })
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <TabsList>
             {Object.keys(tabs).map((pm) => (
                <TabsTrigger key={pm} value={pm}>{pm}</TabsTrigger>
             ))}
          </TabsList>
          <Button variant="ghost" size="sm" onClick={copyCommand}>
            {hasCopied ? <IconCheck /> : <IconCopy />}
          </Button>
        </div>
      </Tabs>
    </div>
  )
}