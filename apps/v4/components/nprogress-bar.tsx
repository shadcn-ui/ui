"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

interface NProgressBarProps {
  color?: string
  height?: number
  delay?: number // ms
}

export default function NProgressBar({
  color = "#6366f1",
  height = 2,
  delay = 100,
}: NProgressBarProps) {
  const pathname = usePathname()
  const router = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    // Inject custom style for color/height
    let style = document.getElementById("nprogress-custom-style") as HTMLStyleElement | null
    if (!style) {
      style = document.createElement("style")
      style.id = "nprogress-custom-style"
      document.head.appendChild(style)
    }
    style.innerHTML = `
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: ${color} !important;
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: ${height}px !important;
        transition: all 0.2s ease;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
      #nprogress .spinner {
        display: none !important;
      }
    `
    // Only remove style on unmount, not on every color/height change
    return () => {
      // Only remove if component is unmounting (not just color/height change)
      if (document.getElementById("nprogress-custom-style")) {
        document.getElementById("nprogress-custom-style")?.remove()
      }
    }
  }, [color, height])

  useEffect(() => {
    // Start progress bar with delay
    if (router.current) clearTimeout(router.current)
    router.current = setTimeout(() => {
      NProgress.start()
    }, delay)
    return () => {
      if (router.current) clearTimeout(router.current)
      NProgress.done()
    }
  }, [pathname, delay])

  return null
} 