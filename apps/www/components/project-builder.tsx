"use client"

import { FolderClosed } from "lucide-react"

import { cn } from "@/lib/utils"
import { useProject } from "@/hooks/use-project"
import { Button } from "@/registry/new-york/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

export function ProjectBuilder({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { project } = useProject()

  return (
    <Popover>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="flex flex-col overflow-hidden rounded-xl p-0"
      >
        <div className="flex-1 p-4">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-lg">
            <div className="whitespace-nowrap bg-muted p-2 font-mono text-sm">
              pnpm dlx shadcn@latest add {project.blocks.join(" ")}
            </div>
          </div>
        </div>
        <div className="border-t p-4">
          <Button size="sm" className="w-full rounded-lg shadow-none">
            Copy Command
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
