"use client"

import * as React from "react"
import { IconCheck, IconCopy, IconPlus } from "@tabler/icons-react"

import { useConfig } from "@/hooks/use-config"
import { useIsMobile } from "@/hooks/use-mobile"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york-v4/ui/drawer"
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

export function DirectoryAddButton({
  registry,
}: {
  registry: { name: string }
}) {
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  const packageManager = config.packageManager || "pnpm"

  const commands = React.useMemo(() => {
    return {
      pnpm: `pnpm dlx shadcn@latest registry add ${registry.name}`,
      npm: `npx shadcn@latest registry add ${registry.name}`,
      yarn: `yarn dlx shadcn@latest registry add ${registry.name}`,
      bun: `bunx --bun shadcn@latest registry add ${registry.name}`,
    }
  }, [registry.name])

  const command = commands[packageManager]

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const handleCopy = React.useCallback(() => {
    copyToClipboardWithMeta(command, {
      name: "copy_registry_add_command",
      properties: {
        command,
        registry: registry.name,
      },
    })
    setHasCopied(true)
  }, [command, registry.name])

  const Trigger = (
    <Button size="sm" variant="outline" className="relative z-10">
      Add <IconPlus />
    </Button>
  )

  const Content = (
    <Tabs
      value={packageManager}
      onValueChange={(value) => {
        setConfig({
          ...config,
          packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
        })
      }}
      className="gap-0 overflow-hidden rounded-lg border"
    >
      <div className="flex items-center gap-2 border-b p-2">
        <TabsList className="*:data-[slot=tabs-trigger]:data-[state=active]:border-input h-auto rounded-none bg-transparent p-0 font-mono *:data-[slot=tabs-trigger]:border *:data-[slot=tabs-trigger]:border-transparent *:data-[slot=tabs-trigger]:pt-0.5 *:data-[slot=tabs-trigger]:shadow-none!">
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
          <TabsTrigger value="bun">bun</TabsTrigger>
        </TabsList>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              className="ml-auto size-7 rounded-lg"
              onClick={handleCopy}
            >
              {hasCopied ? (
                <IconCheck className="size-4" />
              ) : (
                <IconCopy className="size-4" />
              )}
              <span className="sr-only">Copy command</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasCopied ? "Copied!" : "Copy command"}
          </TooltipContent>
        </Tooltip>
      </div>
      {Object.entries(commands).map(([key, cmd]) => (
        <TabsContent key={key} value={key} className="mt-0">
          <div className="bg-surface text-surface-foreground px-3 py-3">
            <div className="no-scrollbar overflow-x-auto">
              <code className="font-mono text-sm whitespace-nowrap">{cmd}</code>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Registry</DrawerTitle>
            <DrawerDescription>
              Run this command to add {registry.name} to your project.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{Content}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button size="sm">Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="dialog-ring animate-none! rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Registry</DialogTitle>
          <DialogDescription>
            Run this command to add {registry.name} to your project.
          </DialogDescription>
        </DialogHeader>
        {Content}
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
