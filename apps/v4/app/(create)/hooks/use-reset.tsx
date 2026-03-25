"use client"

import * as React from "react"
import useSWR from "swr"

import { DEFAULT_CONFIG } from "@/registry/config"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const RESET_DIALOG_KEY = "create:reset-dialog-open"
export const RESET_FORWARD_TYPE = "reset-forward"

export function useReset() {
  const [params, setParams] = useDesignSystemSearchParams()
  const { data: showResetDialog = false, mutate: setShowResetDialogData } =
    useSWR<boolean>(RESET_DIALOG_KEY, {
      fallbackData: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    })

  const reset = React.useCallback(() => {
    setParams({
      base: params.base,
      style: DEFAULT_CONFIG.style,
      baseColor: DEFAULT_CONFIG.baseColor,
      theme: DEFAULT_CONFIG.theme,
      chartColor: DEFAULT_CONFIG.chartColor,
      iconLibrary: DEFAULT_CONFIG.iconLibrary,
      font: DEFAULT_CONFIG.font,
      fontHeading: DEFAULT_CONFIG.fontHeading,
      menuAccent: DEFAULT_CONFIG.menuAccent,
      menuColor: DEFAULT_CONFIG.menuColor,
      radius: DEFAULT_CONFIG.radius,
      template: DEFAULT_CONFIG.template,
      item: params.item,
    })
  }, [setParams, params.base, params.item])

  const handleShowResetDialogChange = React.useCallback(
    (open: boolean) => {
      void setShowResetDialogData(open, { revalidate: false })
    },
    [setShowResetDialogData]
  )

  const confirmReset = React.useCallback(() => {
    reset()
    void setShowResetDialogData(false, { revalidate: false })
  }, [reset, setShowResetDialogData])

  const showResetDialogRef = React.useRef(showResetDialog)
  React.useEffect(() => {
    showResetDialogRef.current = showResetDialog
  }, [showResetDialog])

  const confirmResetRef = React.useRef(confirmReset)
  React.useEffect(() => {
    confirmResetRef.current = confirmReset
  }, [confirmReset])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "R" && e.shiftKey && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()

        // If the dialog is already open, confirm the reset.
        if (showResetDialogRef.current) {
          confirmResetRef.current()
          return
        }

        handleShowResetDialogChange(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [handleShowResetDialogChange])

  return {
    reset,
    showResetDialog,
    setShowResetDialog: handleShowResetDialogChange,
    confirmReset,
  }
}
