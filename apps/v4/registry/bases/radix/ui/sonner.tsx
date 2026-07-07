"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      icons={{
        success: (
          <IconPlaceholder
            lucide="CircleCheckIcon"
            materialSymbols="check_circle"
            tabler="IconCircleCheck"
            hugeicons="CheckmarkCircle02Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
            className="size-4"
            aria-hidden="true" // [FORCE-UI] decorative status icon
          />
        ),
        info: (
          <IconPlaceholder
            lucide="InfoIcon"
            materialSymbols="info"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
            className="size-4"
            aria-hidden="true" // [FORCE-UI] decorative status icon
          />
        ),
        warning: (
          <IconPlaceholder
            lucide="TriangleAlertIcon"
            materialSymbols="warning"
            tabler="IconAlertTriangle"
            hugeicons="Alert02Icon"
            phosphor="WarningIcon"
            remixicon="RiErrorWarningLine"
            className="size-4"
            aria-hidden="true" // [FORCE-UI] decorative status icon
          />
        ),
        error: (
          <IconPlaceholder
            lucide="OctagonXIcon"
            materialSymbols="dangerous"
            tabler="IconAlertOctagon"
            hugeicons="MultiplicationSignCircleIcon"
            phosphor="XCircleIcon"
            remixicon="RiCloseCircleLine"
            className="size-4"
            aria-hidden="true" // [FORCE-UI] decorative status icon
          />
        ),
        loading: (
          <IconPlaceholder
            lucide="Loader2Icon"
            materialSymbols="progress_activity"
            tabler="IconLoader"
            hugeicons="Loading03Icon"
            phosphor="SpinnerIcon"
            remixicon="RiLoaderLine"
            className="size-4 animate-spin"
            aria-hidden="true" // [FORCE-UI] decorative status icon
          />
        ),
      }}
      style={
        {
          // [FORCE-UI] surface tokens (Force toast.md spec) instead of popover; rich-colors wired to status subtle/solid tokens; explicit width per spec
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--surface-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--width": "312px",
          "--success-bg": "var(--success-subtle)",
          "--success-border": "var(--success)",
          "--success-text": "var(--success)",
          "--warning-bg": "var(--warning-subtle)",
          "--warning-border": "var(--warning)",
          "--warning-text": "var(--warning)",
          "--info-bg": "var(--info-subtle)",
          "--info-border": "var(--info)",
          "--info-text": "var(--info)",
          "--error-bg": "var(--error-subtle)",
          "--error-border": "var(--error)",
          "--error-text": "var(--error)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // [FORCE-UI] top-align icon/content on multi-line toasts; brand tokens on the action/cancel buttons instead of sonner's default neutral fill
          toast: "cn-toast !items-start",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-secondary !text-secondary-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
