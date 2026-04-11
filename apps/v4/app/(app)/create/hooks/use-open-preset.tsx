"use client"

import * as React from "react"
import useSWR from "swr"

const OPEN_PRESET_KEY = "create:open-preset-open"
export const OPEN_PRESET_FORWARD_TYPE = "open-preset-forward"

function isEditableTarget(target: EventTarget | null) {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function useOpenPreset() {
  const { data: open = false, mutate: setOpenData } = useSWR<boolean>(
    OPEN_PRESET_KEY,
    {
      fallbackData: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      void setOpenData(nextOpen, { revalidate: false })
    },
    [setOpenData]
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "o" &&
        !e.shiftKey &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        if (isEditableTarget(e.target)) {
          return
        }

        e.preventDefault()
        void setOpenData(true, { revalidate: false })
      }
    }

    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [setOpenData])

  return {
    open,
    setOpen: handleOpenChange,
  }
}

export function useOpenPresetTrigger() {
  const { mutate: setOpenData } = useSWR<boolean>(OPEN_PRESET_KEY, {
    fallbackData: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  })

  const openPreset = React.useCallback(() => {
    void setOpenData(true, { revalidate: false })
  }, [setOpenData])

  return {
    openPreset,
  }
}
