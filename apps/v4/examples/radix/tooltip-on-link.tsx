import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"

export function TooltipOnLink() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href="#"
          className="text-primary w-fit text-sm underline-offset-4 hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Learn more
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to read the documentation</p>
      </TooltipContent>
    </Tooltip>
  )
}
