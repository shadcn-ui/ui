import React, { Dispatch, SetStateAction } from "react"
import { LucideIcon, LucideProps, StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarWrapperProps {
  value?: number
  setValue?: Dispatch<SetStateAction<number>>
  numStars?: number
  icon?: LucideIcon
  disabled?: boolean
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>
  iconProps?: LucideProps
  showcase?: boolean
}

const StarRating = ({
  numStars = 5,
  icon,
  setValue,
  value,
  disabled,
  showcase,
  iconProps = {},
  wrapperProps = {},
}: StarWrapperProps) => {
  const { className: wrapperClassName, ...restWrapperProps } = wrapperProps
  const { className: iconClassName, ...restIconProps } = iconProps
  const IconComponent = icon

  return (
    <div className={cn("flex items-center gap-1", wrapperClassName)} {...restWrapperProps}>
      {Array.from({ length: numStars }, (_, i) => {
        const isRated = i < value!
        const styledIconProps: LucideProps = {
          onMouseEnter: () => !showcase && !disabled && setValue!(i + 1),
          className: cn("size-5 fill-primary stroke-primary",
            {
              "opacity-50 pointer-events-none": disabled,
              "transition-transform duration-300 hover:scale-110": !disabled && !showcase,
              'fill-muted stroke-muted': !isRated
            },
            iconClassName
          ),
          ...restIconProps
        }
        return (
          IconComponent ? (
            <IconComponent {...styledIconProps} />
          ) : (
            <StarIcon {...styledIconProps} />
          )
        )
      })}
    </div>
  )
}

export { StarRating }
