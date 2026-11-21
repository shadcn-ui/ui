"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const SONNER_TOASTER_SELECTOR = "[data-sonner-toaster]"
// Base UI marks an open modal popup with `data-open`. Radix uses `data-state`.
const OPEN_BASE_MODAL_SELECTOR =
  '[role="dialog"][data-open], [role="alertdialog"][data-open]'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    // Base UI leaves Sonner's aria-live toaster focusable while a modal is
    // open, so Alt+T can move focus into a toast. Sonner handles Escape by
    // collapsing the stack and does not stop the event, so the dialog's
    // document listener closes the dialog. The toast then unmounts onto
    // <body> because the element Sonner would restore is gone.
    function onFocusIn(event: FocusEvent) {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const toaster = target.closest(SONNER_TOASTER_SELECTOR)
      if (toaster == null) {
        return
      }

      const previous = event.relatedTarget
      if (previous instanceof HTMLElement && !toaster.contains(previous)) {
        restoreFocusRef.current = previous
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.isComposing) {
        return
      }

      const active = document.activeElement
      if (
        !(active instanceof Element) ||
        active.closest(SONNER_TOASTER_SELECTOR) == null ||
        document.querySelector(OPEN_BASE_MODAL_SELECTOR) == null
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const restore = restoreFocusRef.current
      restoreFocusRef.current = null
      if (restore != null && restore.isConnected) {
        restore.focus({ preventScroll: true })
      }
    }

    document.addEventListener("focusin", onFocusIn)
    // Capture on window runs before Base UI's document keydown listener.
    window.addEventListener("keydown", onKeyDown, true)

    return () => {
      document.removeEventListener("focusin", onFocusIn)
      window.removeEventListener("keydown", onKeyDown, true)
    }
  }, [])

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
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
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
