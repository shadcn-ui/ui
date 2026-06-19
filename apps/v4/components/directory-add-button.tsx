"use client"

import * as React from "react"
import { IconCheck, IconCopy, IconPlus } from "@tabler/icons-react"

import { useConfig } from "@/hooks/use-config"
import { useIsMobile } from "@/hooks/use-mobile"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/styles/base-nova/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/styles/base-nova/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/styles/base-nova/ui/drawer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/base-nova/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/base-nova/ui/tooltip"

const DirectoryAddContext = React.createContext<{
  open: (registry: { name: string }) => void
}>({
  open: () => {},
})

export function useDirectoryAdd() {
  return React.useContext(DirectoryAddContext)
}

export function DirectoryAddButton({
  registry,
}: {
  registry: { name: string }
}) {
  const { open } = useDirectoryAdd()

  return (
    <Button
      size="sm"
      variant="outline"
      className="relative z-10"
      onClick={() => open(registry)}
    >
      Add <IconPlus />
    </Button>
  )
}

export function DirectoryAddProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedRegistry, setSelectedRegistry] = React.useState<{
    name: string
  } | null>(null)
  const isMobile = useIsMobile()

  const packageManager = config.packageManager || "pnpm"

  const commands = React.useMemo(() => {
    if (!selectedRegistry) return null
    return {
      pnpm: `pnpm dlx shadcn@latest registry add ${selectedRegistry.name}`,
      npm: `npx shadcn@latest registry add ${selectedRegistry.name}`,
      yarn: `yarn dlx shadcn@latest registry add ${selectedRegistry.name}`,
      bun: `bunx --bun shadcn@latest registry add ${selectedRegistry.name}`,
    }
  }, [selectedRegistry])

  const command = commands?.[packageManager] ?? ""

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
        registry: selectedRegistry?.name ?? "",
      },
    })
    setHasCopied(true)
  }, [command, selectedRegistry?.name])

  const contextValue = React.useMemo(
    () => ({
      open: (registry: { name: string }) => {
        setSelectedRegistry(registry)
        setIsOpen(true)
      },
    }),
    []
  )

  const Content = commands ? (
    <Tabs
      value={packageManager}
      onValueChange={(value) => {
        setConfig({
          ...config,
          packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
        })
      }}
      className="gap-0 overflow-hidden rounded-xl border"
    >
      <div className="flex items-center gap-2 border-b p-1.5">
        <TabsList className="h-auto *:data-[slot=tabs-trigger]:pt-0">
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
          <TabsTrigger value="bun">bun</TabsTrigger>
        </TabsList>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="ghost"
                className="ml-auto"
                onClick={handleCopy}
              />
            }
          >
            {hasCopied ? <IconCheck /> : <IconCopy />}
            <span className="sr-only">Copy command</span>
          </TooltipTrigger>
          <TooltipContent>
            {hasCopied ? "Copied!" : "Copy command"}
          </TooltipContent>
        </Tooltip>
      </div>
      {Object.entries(commands).map(([key, cmd]) => (
        <TabsContent key={key} value={key} className="mt-0">
          <div className="bg-surface px-3 py-3 text-surface-foreground">
            <div className="no-scrollbar overflow-x-auto">
              <code className="font-mono text-sm whitespace-nowrap">{cmd}</code>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  ) : null

  return (
    <DirectoryAddContext value={contextValue}>
      {children}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Registry</DrawerTitle>
              <DrawerDescription>
                Run this command to add {selectedRegistry?.name} to your
                project.
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
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="animate-none! sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Registry</DialogTitle>
              <DialogDescription>
                Run this command to add {selectedRegistry?.name} to your
                project.
              </DialogDescription>
            </DialogHeader>
            {Content}
            <DialogFooter>
              <DialogClose render={<Button size="sm" variant="outline" />}>
                Done
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DirectoryAddContext>
  )
}
