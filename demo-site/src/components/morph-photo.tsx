import { useId } from "react"

import { MORPH_QUATREFOIL_PATH } from "@/components/hero-morph-clip"
import { cn } from "@/lib/utils"

// A photo whose clip-path shape morphs (quatrefoil -> hexagon -> flower) while
// an ancestor `.group` is hovered, and freezes in place on leave. Each instance
// gets its own clip-path id so hovering one doesn't affect the others.
function MorphPhoto({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const clipId = "morph-" + useId().replace(/:/g, "")

  return (
    <div className={cn("relative", className)}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path
              d={MORPH_QUATREFOIL_PATH}
              className="[animation:photo-morph_5.5s_linear_-1.3s_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running] group-focus-visible:[animation-play-state:running] motion-reduce:[animation:none]"
            />
          </clipPath>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        className="size-full object-cover"
        style={{ clipPath: `url(#${clipId})` }}
      />
    </div>
  )
}

export { MorphPhoto }
