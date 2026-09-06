"use client"

import * as React from "react"

import { findFont } from "@/app/(app)/(typeset)/lib/fonts"
import {
  TYPESET_MEASURES,
  TYPESET_PARAMS_MESSAGE,
  useTypesetSearchParams,
  type TypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

function previewValues(params: TypesetSearchParams) {
  const bodyFont = findFont(params.body)?.value

  return {
    "--preview-size": `${params.scale}px`,
    "--preview-leading": params.leading,
    "--preview-flow": params.flow,
    "--preview-measure": TYPESET_MEASURES.find(
      (option) => option.value === params.measure
    )?.width,
    "--preview-font": bodyFont,
    "--preview-font-heading":
      params.heading === "inherit" ? bodyFont : findFont(params.heading)?.value,
    "--preview-font-mono": findFont(params.mono)?.value,
  }
}

export function TypesetPreviewProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [params, setParams] = useTypesetSearchParams()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === TYPESET_PARAMS_MESSAGE && event.data.data) {
        setParams(event.data.data)
      }
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [setParams])

  // Applies the vars before paint so the gate below never reveals unstyled
  // content (same pattern as create's DesignSystemProvider).
  React.useLayoutEffect(() => {
    const style = document.documentElement.style

    for (const [name, value] of Object.entries(previewValues(params))) {
      if (value) {
        style.setProperty(name, value)
      } else {
        style.removeProperty(name)
      }
    }

    setIsReady(true)
  }, [params])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
