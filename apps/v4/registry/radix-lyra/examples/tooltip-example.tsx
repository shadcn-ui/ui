import { Button } from "@/registry/bases/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { CanvaFrame } from "@/app/(design)/design/components/canva"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function TooltipDemo() {
  return (
    <CanvaFrame>
      <div className="flex flex-wrap items-start gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex gap-2">
          {["top", "right", "bottom", "left"].map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side={side as "top" | "right" | "bottom" | "left"}
              >
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconPlaceholder icon="PlaceholderIcon" />
              <span className="sr-only">Info</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            To learn more about how this works, check out the docs. If you have
            any questions, please reach out to us.
          </TooltipContent>
        </Tooltip>
      </div>
    </CanvaFrame>
  )
}
