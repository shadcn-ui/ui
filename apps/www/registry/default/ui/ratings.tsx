"use client"

import React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingVariants = {
  default: {
    star: "text-foreground",
    emptyStar: "text-muted-foreground",
  },
  destructive: {
    star: "text-destructive",
    emptyStar: "text-destructive/70",
  },
  yellow: {
    star: "text-yellow-500",
    emptyStar: "text-yellow-200",
  },
}

interface RatingsProps extends React.HTMLAttributes<HTMLDivElement> {
  totalStars?: number
  size?: number
  fill?: boolean
  Icon?: React.ReactElement
  variant?: keyof typeof ratingVariants
  asInput?: boolean
  value: number
  onValueChange?: (value: number) => void
}

const Ratings = ({ ...props }: RatingsProps) => {
  const {
    totalStars = 5,
    size = 20,
    fill = true,
    Icon = <Star />,
    variant = "default",
    asInput = false,
    onValueChange,
    value,
  } = props

  const ratings = value

  const fullStars = Math.floor(ratings)
  const partialStar =
    ratings % 1 > 0 ? (
      <PartialStar
        fillPercentage={ratings % 1}
        size={size}
        className={cn(ratingVariants[variant].star)}
        Icon={Icon}
        asInput={asInput}
        onValueChange={() => onValueChange && onValueChange(fullStars + 1)}
      />
    ) : null

  return (
    <div className={cn("flex items-center gap-2")} {...props}>
      {[...Array(fullStars)].map((_, i) =>
        React.cloneElement(Icon, {
          key: i,
          size,
          className: cn(
            fill ? "fill-current" : "fill-transparent",
            ratingVariants[variant].star,
            asInput ? "cursor-pointer" : ""
          ),
          role: props.asInput && "input",
          onClick: () => onValueChange && onValueChange(i + 1),
        })
      )}
      {partialStar}
      {[...Array(totalStars - fullStars - (partialStar ? 1 : 0))].map((_, i) =>
        React.cloneElement(Icon, {
          key: i + fullStars + 1,
          size,
          className: cn(
            ratingVariants[variant].emptyStar,
            asInput ? "cursor-pointer" : ""
          ),
          role: props.asInput && "input",
          onClick: () =>
            onValueChange &&
            onValueChange(fullStars + i + 1 + (partialStar ? 1 : 0)),
        })
      )}
    </div>
  )
}

interface PartialStarProps {
  fillPercentage: number
  size: number
  className?: string
  Icon: React.ReactElement
  asInput?: boolean
  onValueChange?: () => void
}

const PartialStar = ({ ...props }: PartialStarProps) => {
  const { fillPercentage, size, className, Icon, asInput, onValueChange } =
    props

  return (
    <div
      role={asInput ? "input" : undefined}
      onClick={() => onValueChange && onValueChange()}
      className={cn("relative inline-block", asInput && "cursor-pointer")}
    >
      {React.cloneElement(Icon, {
        size,
        className: cn("fill-transparent", className),
      })}
      <div
        style={{
          position: "absolute",
          top: 0,
          overflow: "hidden",
          width: `${fillPercentage * 100}%`,
        }}
      >
        {React.cloneElement(Icon, {
          size,
          className: cn("fill-current", className),
        })}
      </div>
    </div>
  )
}

export default Ratings
