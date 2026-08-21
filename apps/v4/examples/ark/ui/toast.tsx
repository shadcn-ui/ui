"use client"

import { cn } from "@/examples/ark/lib/utils"
import {
  Toaster as ArkToaster,
  createToaster,
  Toast,
} from "@ark-ui/react/toast"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

const icons = {
  success: <CircleCheckIcon className="size-4" aria-hidden="true" />,
  info: <InfoIcon className="size-4" aria-hidden="true" />,
  warning: <TriangleAlertIcon className="size-4" aria-hidden="true" />,
  error: <OctagonXIcon className="size-4" aria-hidden="true" />,
  loading: <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />,
} as const

const toaster = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 16,
})

function Toaster() {
  return (
    <ArkToaster
      toaster={toaster}
      data-slot="toast"
      className="pointer-events-auto"
    >
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className={cn(
            "pointer-events-auto z-(--z-index) flex h-(--height) w-[356px] translate-x-(--x) translate-y-(--y) scale-(--scale) items-start gap-3 rounded-lg border border-border bg-popover p-4 text-popover-foreground opacity-(--opacity) shadow-lg ease-[cubic-bezier(0.21,1.02,0.73,1)] [will-change:translate,opacity,scale] [transition:translate_400ms,scale_400ms,opacity_400ms,height_400ms,box-shadow_200ms] data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)] data-[state=closed]:[transition:translate_400ms,scale_400ms,opacity_200ms]",
            toast.type === "error" && "border-destructive/50",
            toast.type === "success" && "border-emerald-500/50"
          )}
        >
          {toast.type && toast.type in icons && (
            <span
              className={cn(
                "mt-0.5 shrink-0",
                toast.type === "error" && "text-destructive",
                toast.type === "success" && "text-emerald-500",
                toast.type === "warning" && "text-amber-500",
                toast.type === "info" && "text-blue-500",
                toast.type === "loading" && "text-muted-foreground"
              )}
            >
              {icons[toast.type as keyof typeof icons]}
            </span>
          )}
          <div className="flex flex-1 flex-col gap-1">
            <Toast.Title className="text-sm font-semibold" />
            <Toast.Description className="text-sm text-muted-foreground" />
            <Toast.ActionTrigger className="mt-1 inline-flex w-fit text-sm font-medium text-primary hover:text-primary/80" />
          </div>
          <Toast.CloseTrigger className="shrink-0 rounded-md p-0.5 text-muted-foreground opacity-70 transition-opacity hover:text-foreground hover:opacity-100">
            <XIcon className="size-4" aria-hidden="true" />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </ArkToaster>
  )
}

export { Toaster, toaster as toast }

export { type ToastStatus } from "@ark-ui/react/toast"
