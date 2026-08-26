"use client"

import * as React from "react"

export function PreviewFontVariables({ className }: { className: string }) {
  React.useLayoutEffect(() => {
    const classNames = className.split(/\s+/).filter(Boolean)

    if (!classNames.length) {
      return
    }

    document.documentElement.classList.add(...classNames)

    return () => {
      document.documentElement.classList.remove(...classNames)
    }
  }, [className])

  return null
}
