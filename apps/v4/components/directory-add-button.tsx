"use client"

import * as React from "react"
import Link from "next/link"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useIsMobile } from "@/hooks/use-mobile"
import { CopyButton } from "@/components/copy-button"
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

export function DirectoryAddButton({
  registry,
}: {
  registry: {
    name: string
    url: string
  }
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const jsonValue = `{
  "registries": {
    "${registry.name}": "${registry.url}"
  }
}`

  const Trigger = (
    <Button
      size="sm"
      variant="outline"
      className="relative z-10"
      onClick={() => setOpen(true)}
    >
      {isCopied ? (
        <IconCheck />
      ) : (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Model Context Protocol</title>
          <path
            d="M13.85 0a4.16 4.16 0 0 0-2.95 1.217L1.456 10.66a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l9.442-9.442a2.49 2.49 0 0 1 3.541 0 2.49 2.49 0 0 1 0 3.541L8.59 12.97l-.1.1a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l.1-.098 7.03-7.034a2.49 2.49 0 0 1 3.542 0l.049.05a2.49 2.49 0 0 1 0 3.54l-8.54 8.54a1.96 1.96 0 0 0 0 2.755l1.753 1.753a.835.835 0 0 0 1.18 0 .835.835 0 0 0 0-1.18l-1.753-1.753a.266.266 0 0 1 0-.394l8.54-8.54a4.185 4.185 0 0 0 0-5.9l-.05-.05a4.16 4.16 0 0 0-2.95-1.218c-.2 0-.401.02-.6.048a4.17 4.17 0 0 0-1.17-3.552A4.16 4.16 0 0 0 13.85 0m0 3.333a.84.84 0 0 0-.59.245L6.275 10.56a4.186 4.186 0 0 0 0 5.902 4.186 4.186 0 0 0 5.902 0L19.16 9.48a.835.835 0 0 0 0-1.18.835.835 0 0 0-1.18 0l-6.985 6.984a2.49 2.49 0 0 1-3.54 0 2.49 2.49 0 0 1 0-3.54l6.983-6.985a.835.835 0 0 0 0-1.18.84.84 0 0 0-.59-.245"
            className="fill-foreground"
          />
        </svg>
      )}
      MCP
    </Button>
  )

  const Content = (
    <>
      <figure
        data-rehype-pretty-code-figure
        className={cn(
          "group relative mt-0",
          !isMobile &&
            "dark:bg-background dark:[&_[data-line]:not([data-highlighted-line]):before]:bg-background!"
        )}
      >
        <CopyButton
          value={jsonValue}
          className="top-3 right-2"
          tooltip="Copy Code"
        />
        <div data-rehype-pretty-code-title>components.json</div>
        <pre className="no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0">
          <code data-line-numbers data-language="json">
            <span data-line>{"{"}</span>
            <span data-line>{'  "registries": {'}</span>
            <span
              data-line
              data-highlighted-line
            >{`    "${registry.name}": "${registry.url}"`}</span>
            <span data-line>{"  }"}</span>
            <span data-line>{"}"}</span>
          </code>
        </pre>
      </figure>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configure MCP</DrawerTitle>
            <DrawerDescription>
              Copy and paste the following code into your project&apos;s
              components.json.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6">{Content}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button size="sm">Close</Button>
            </DrawerClose>
            <Button size="sm" asChild variant="outline">
              <Link href="/docs/mcp">Read the docs</Link>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent
        className="rounded-xl border-none bg-clip-padding shadow-2xl ring-4 ring-neutral-200/80 sm:max-w-[600px] dark:bg-neutral-900 dark:ring-neutral-800"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Configure MCP</DialogTitle>
          <DialogDescription>
            Copy and paste the following code into your project&apos;s
            components.json.
          </DialogDescription>
        </DialogHeader>
        {Content}
        <DialogFooter className="justify-between!">
          <Button size="sm" asChild variant="ghost">
            <Link href="/docs/mcp">Read the docs</Link>
          </Button>
          <DialogClose asChild>
            <Button size="sm">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
