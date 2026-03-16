"use client"

import {
  Toaster as ArkToaster,
  createToaster,
  Toast,
} from "@ark-ui/react/toast"

import { cn } from "@/examples/ark/lib/utils"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon, XIcon } from "lucide-react"

const icons = {
  success: (
    <CircleCheckIcon className="size-4" />
  ),
  info: (
    <InfoIcon className="size-4" />
  ),
  warning: (
    <TriangleAlertIcon className="size-4" />
  ),
  error: (
    <OctagonXIcon className="size-4" />
  ),
  loading: (
    <Loader2Icon className="size-4 animate-spin" />
  ),
} as const

const toaster = createToaster({
  placement: "bottom-right",
  overlap: true,
  gap: 16,
})

function Toaster() {
  return (
    <ArkToaster
      toaster={toaster}
      data-slot="sonner"
      className="pointer-events-auto"
    >
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className={cn(
            "pointer-events-auto flex w-[356px] items-start gap-3 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg",
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
            <XIcon className="size-4" />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </ArkToaster>
  )
}

export { Toaster, toaster as toast }
