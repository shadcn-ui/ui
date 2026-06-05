"use client"

import * as React from "react"

import {
  PREVIEW_WHEEL_MESSAGE,
  WHEEL_FORWARD_PARAM,
} from "@/components/preview-wheel-message"

function canScrollElementInDirection(
  element: Element,
  axis: "x" | "y",
  delta: number
) {
  if (delta === 0) {
    return false
  }

  const clientSize = axis === "y" ? element.clientHeight : element.clientWidth
  const scrollOffset = axis === "y" ? element.scrollTop : element.scrollLeft
  const scrollSize = axis === "y" ? element.scrollHeight : element.scrollWidth

  if (scrollSize <= clientSize) {
    return false
  }

  if (delta < 0) {
    return scrollOffset > 0
  }

  return scrollOffset + clientSize < scrollSize - 1
}

function hasScrollableTarget(
  target: EventTarget | null,
  axis: "x" | "y",
  delta: number
) {
  if (!(target instanceof Element)) {
    return false
  }

  let element: Element | null = target

  while (element && element !== document.body) {
    const style = window.getComputedStyle(element)
    const overflow = axis === "y" ? style.overflowY : style.overflowX

    if (
      /(auto|scroll|overlay)/.test(overflow) &&
      canScrollElementInDirection(element, axis, delta)
    ) {
      return true
    }

    element = element.parentElement
  }

  const scrollingElement = document.scrollingElement

  return scrollingElement
    ? canScrollElementInDirection(scrollingElement, axis, delta)
    : false
}

export function PreviewWheelForwarder() {
  React.useEffect(() => {
    if (window.parent === window) {
      return
    }

    const searchParams = new URLSearchParams(window.location.search)

    if (!searchParams.has(WHEEL_FORWARD_PARAM)) {
      return
    }

    function onWheel(event: WheelEvent) {
      const deltaX =
        event.deltaX !== 0 &&
        !hasScrollableTarget(event.target, "x", event.deltaX)
          ? event.deltaX
          : 0
      const deltaY =
        event.deltaY !== 0 &&
        !hasScrollableTarget(event.target, "y", event.deltaY)
          ? event.deltaY
          : 0

      if (deltaX === 0 && deltaY === 0) {
        return
      }

      window.parent.postMessage(
        {
          type: PREVIEW_WHEEL_MESSAGE,
          deltaMode: event.deltaMode,
          deltaX,
          deltaY,
        },
        window.location.origin
      )
    }

    window.addEventListener("wheel", onWheel, { passive: true })

    return () => {
      window.removeEventListener("wheel", onWheel)
    }
  }, [])

  return null
}
