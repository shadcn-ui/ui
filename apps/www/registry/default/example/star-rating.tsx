import React, { Dispatch, SetStateAction } from "react"
import { cva } from "class-variance-authority"
import { LucideIcon, LucideProps, StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarWrapperProps {
  value?: number
  setValue?: Dispatch<SetStateAction<number>>
  numStars?: number
  spacing?: number
  starSize?: number
  icon?: LucideIcon
  color?: string
  stroke?: string
  disabled?: boolean
}

const StarRating = ({
  numStars = 5,
  spacing = 1,
  starSize = 24,
  color = "#ffc201",
  stroke = "#ffc201",
  icon,
  setValue,
  value,
  disabled,
}: StarWrapperProps) => {
  const wrapperVariants = cva("flex", {
    variants: {
      spacing: {
        [spacing]: `gap-${spacing}`,
      },
    },
  })

  const IconComponent = icon

  return (
    <div className={cn(wrapperVariants({ spacing }))}>
      {Array.from({ length: numStars }, (_, i) => {
        const isRated = i < (value || 1)
        const iconProps: LucideProps = {
          fill: isRated ? color : "hsl(var(--muted))",
          stroke: isRated ? stroke : "hsl(var(--muted))",
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
          size: starSize,
        }
        return (
          <span
            key={i}
            onMouseEnter={() => !disabled && setValue && setValue(i + 1)}
            className={cn({
              "transition-transform duration-300 hover:scale-110": !disabled,
            })}
          >
            {IconComponent ? (
              <IconComponent {...iconProps} />
            ) : (
              <StarIcon {...iconProps} />
            )}
          </span>
        )
      })}
    </div>
  )
}

export default StarRating
