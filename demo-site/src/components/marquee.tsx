import * as React from "react"

import { cn } from "@/lib/utils"

// Scrolls its children horizontally in an infinite loop. The children are
// rendered twice; the track animates left by 50% so the second copy seamlessly
// takes the first copy's place. Spacing must live on the items (trailing
// margin), not a flex gap, or the seam is half-a-gap off.
function Marquee({
  children,
  className,
  reverse = false,
}: {
  children: React.ReactNode
  className?: string
  reverse?: boolean
}) {
  return (
    <div
      className={cn(
        "flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]"
        )}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Marquee }
