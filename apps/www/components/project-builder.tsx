"use client"

import * as React from "react"
import { Check, Clipboard, FolderClosed } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useProject } from "@/hooks/use-project"
import { BlockImage } from "@/components/block-image"
import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"

export function ProjectBuilder({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { project } = useProject()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const command = React.useMemo(() => {
    return `pnpm dlx shadcn@latest add ${project.blocks.join(" ")}`
  }, [project.blocks])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("relative h-8 w-8 px-0", className)}
          {...props}
        >
          <FolderClosed className="h-4 w-4" />
          {project.blocks.length ? (
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-medium tabular-nums text-primary-foreground">
              {project.blocks.length > 9 ? "9+" : project.blocks.length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col overflow-hidden rounded-xl p-0 w-full gap-0 max-w-3xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Project Builder</DialogTitle>
          <DialogDescription>
            Build your project by adding blocks to your project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-2 gap-4">
            {project.blocks.map((block) => (
              <div className="flex flex-col gap-2">
                <div className="aspect-[1440/900] flex items-center justify-center rounded-lg bg-muted p-4 shrink-0">
                  <BlockImage
                    key={block}
                    name={block}
                    width={375}
                    height={250}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-sm font-mono">{block}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 pt-0 flex items-center gap-2">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-lg">
            <div className="whitespace-nowrap bg-muted p-2 font-mono text-sm">
              {command.replace("@latest", "")}
            </div>
          </div>
          <Button
            size="sm"
            className="ml-auto rounded-lg shadow-none"
            onClick={() => copyToClipboard(command)}
          >
            {isCopied ? <Check /> : <Clipboard />}
            Copy Command
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
