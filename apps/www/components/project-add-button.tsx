"use client"

import { Check, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useProject } from "@/hooks/use-project"
import { Button } from "@/registry/new-york/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export function ProjectAddButton({
  name,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { name: string }) {
  const { addBlock, isAdded } = useProject()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("rounded-sm", className)}
          onClick={() => {
            addBlock(name)
          }}
          {...props}
        >
          {isAdded ? <Check /> : <PlusCircle />}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={10}>Add to Project</TooltipContent>
    </Tooltip>
  )
}
