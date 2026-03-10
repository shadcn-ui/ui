"use client"

import * as React from "react"
import useSWR from "swr"

import { DEFAULT_CONFIG } from "@/registry/config"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const RESET_DIALOG_KEY = "create:reset-dialog-open"

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
      iconLibrary: DEFAULT_CONFIG.iconLibrary,
      font: DEFAULT_CONFIG.font,
      menuAccent: DEFAULT_CONFIG.menuAccent,
      menuColor: DEFAULT_CONFIG.menuColor,
      radius: DEFAULT_CONFIG.radius,
      template: DEFAULT_CONFIG.template,
      item: "preview",
    })
  }, [setParams, params.base])

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

  return {
    reset,
    showResetDialog,
    setShowResetDialog: handleShowResetDialogChange,
    confirmReset,
  }
}
