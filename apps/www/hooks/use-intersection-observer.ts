"use client"

import { useEffect } from "react"

export function useIntersectionObserver({
  config,
  htmlElements,
  onIntersect,
}: {
  config?: IntersectionObserverInit
  htmlElements: (HTMLElement | null)[]
  onIntersect: (entry: IntersectionObserverEntry) => void
}) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry)
        }
      })
    }, config)

    htmlElements.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [config, htmlElements, onIntersect])
}
