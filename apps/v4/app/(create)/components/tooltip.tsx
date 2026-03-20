"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"

export const createTooltipHandle = TooltipPrimitive.createHandle
