import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Segment = { text: string; className?: string }

// Types its text out once when scrolled into view, then persists. An invisible
// full-text copy reserves the final size so the layout never shifts while
// typing. Types across styled segments so coloured words keep their colour.
function TypewriterHeading({
  segments,
  className,
  speed = 70,
}: {
  segments: Segment[]
  className?: string
  speed?: number
}) {
  const total = segments.reduce((n, s) => n + s.text.length, 0)
  const fullText = segments.map((s) => s.text).join("")
  const ref = useRef<HTMLHeadingElement>(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  // Reduced motion: show the whole thing immediately.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(true)
      setCount(total)
    }
  }, [total])

  // Start typing when the heading scrolls into view (once).
  useEffect(() => {
    if (started) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  // Advance one character at a time.
  useEffect(() => {
    if (!started || count >= total) return
    const id = window.setTimeout(() => setCount((c) => c + 1), speed)
    return () => window.clearTimeout(id)
  }, [started, count, total, speed])

  const done = count >= total

  // Render each segment sliced to the revealed portion.
  let remaining = count
  const typed = segments.map((seg, i) => {
    const show = Math.max(0, Math.min(seg.text.length, remaining))
    remaining -= seg.text.length
    return (
      <span key={i} className={seg.className}>
        {seg.text.slice(0, show)}
      </span>
    )
  })

  return (
    <h2 ref={ref} aria-label={fullText} className={cn("relative", className)}>
      {/* Invisible full text reserves the final size (prevents layout shift) */}
      <span aria-hidden="true" className="invisible">
        {segments.map((seg, i) => (
          <span key={i} className={seg.className}>
            {seg.text}
          </span>
        ))}
      </span>
      {/* Typed text, overlaid */}
      <span aria-hidden="true" className="absolute inset-0">
        {typed}
        {started && !done && (
          <span className="ml-0.5 inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-current align-baseline [animation:caret-blink_1.1s_ease-in-out_infinite]" />
        )}
      </span>
    </h2>
  )
}

export { TypewriterHeading }
