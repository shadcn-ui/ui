import { Button } from "@/examples/react-aria/ui/button"
import { Tooltip, TooltipTrigger } from "@/examples/react-aria/ui/tooltip";

export function TooltipDisabled() {
  return (
    <>
      <TooltipTrigger>
        <span className="inline-block w-fit">
          <Button variant="outline" isDisabled>
            Disabled
          </Button>
        </span>
        <Tooltip>
          <p>This feature is currently unavailable</p>
        </Tooltip>
      </TooltipTrigger>
    </>
  );
}
