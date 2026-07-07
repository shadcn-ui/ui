"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" aria-hidden="true" />,
        info: <InfoIcon className="size-4" aria-hidden="true" />,
        warning: <TriangleAlertIcon className="size-4" aria-hidden="true" />,
        error: <OctagonXIcon className="size-4" aria-hidden="true" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
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
