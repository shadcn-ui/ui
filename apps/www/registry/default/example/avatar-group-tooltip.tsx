import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"
import { AvatarGroup } from "@/registry/default/ui/avatar-group"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export default function AvatarGroupDemo() {
  return (
    <TooltipProvider delayDuration={0}>
      <AvatarGroup>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>shadcn</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/dpaulos6.png" />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>dpaulos6</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shuding.png" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>Shu Ding</TooltipContent>
        </Tooltip>
      </AvatarGroup>
    </TooltipProvider>
  )
}
