import { Button } from "@/registry/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export default function TooltipDemo() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-background w-full max-w-[1500px] rounded-xl p-8">
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
              To learn more about how this works, check out the docs. If you
              have any questions, please reach out to us.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
