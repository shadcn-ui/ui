"use client"

import {
  Toaster as ArkToaster,
  Toast,
  createToaster,
} from "@ark-ui/react/toast"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/registry/ark-nova/lib/utils"

const icons = {
  success: (
    <IconPlaceholder
      lucide="CircleCheckIcon"
      tabler="IconCircleCheck"
      hugeicons="CheckmarkCircle02Icon"
      phosphor="CheckCircleIcon"
      remixicon="RiCheckboxCircleLine"
      className="size-4"
    />
  ),
  info: (
    <IconPlaceholder
      lucide="InfoIcon"
      tabler="IconInfoCircle"
      hugeicons="InformationCircleIcon"
      phosphor="InfoIcon"
      remixicon="RiInformationLine"
      className="size-4"
    />
  ),
  warning: (
    <IconPlaceholder
      lucide="TriangleAlertIcon"
      tabler="IconAlertTriangle"
      hugeicons="Alert02Icon"
      phosphor="WarningIcon"
      remixicon="RiErrorWarningLine"
      className="size-4"
    />
  ),
  error: (
    <IconPlaceholder
      lucide="OctagonXIcon"
      tabler="IconAlertOctagon"
      hugeicons="MultiplicationSignCircleIcon"
      phosphor="XCircleIcon"
      remixicon="RiCloseCircleLine"
      className="size-4"
    />
  ),
  loading: (
    <IconPlaceholder
      lucide="Loader2Icon"
      tabler="IconLoader"
      hugeicons="Loading03Icon"
      phosphor="SpinnerIcon"
      remixicon="RiLoaderLine"
      className="size-4 animate-spin"
    />
  ),
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
      data-slot="sonner"
      className="pointer-events-auto"
    >
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className={cn(
            "bg-popover text-popover-foreground border-border pointer-events-auto flex w-[356px] items-start gap-3 rounded-lg border p-4 shadow-lg",
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
            <Toast.Description className="text-muted-foreground text-sm" />
            <Toast.ActionTrigger className="text-primary hover:text-primary/80 mt-1 inline-flex w-fit text-sm font-medium" />
          </div>
          <Toast.CloseTrigger className="text-muted-foreground hover:text-foreground shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
              className="size-4"
            />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </ArkToaster>
  )
}

export { Toaster, toaster as toast }

export { type ToastStatus } from "@ark-ui/react/toast"
