"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingVariants = cva("inline-flex items-center gap-1", {
  variants: {
    size: {
      sm: "[&_svg]:size-3",
      md: "[&_svg]:size-4",
      lg: "[&_svg]:size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type RatingProps = React.ComponentProps<"div"> &
  VariantProps<typeof ratingVariants> & {
    value?: number
    defaultValue?: number
    max?: number
    onValueChange?: (value: number) => void
    readOnly?: boolean
    disabled?: boolean
  }

function Rating({
  className,
  value,
  defaultValue = 0,
  max = 5,
  onValueChange,
  readOnly = false,
  disabled = false,
  size,
  ...props
}: RatingProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const displayValue = hoverValue ?? currentValue

  function setValue(nextValue: number) {
    if (readOnly || disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (readOnly || disabled) {
      return
    }

    let nextValue = currentValue || 0

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        nextValue = Math.max(1, currentValue - 1)
        break
      case "ArrowRight":
      case "ArrowUp":
        nextValue = Math.min(max, currentValue + 1)
        break
      case "Home":
        nextValue = 1
        break
      case "End":
        nextValue = max
        break
      default:
        return
    }

    event.preventDefault()
    setValue(nextValue)
  }

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled}
      data-slot="rating"
      className={cn(
        ratingVariants({ size, className }),
        disabled && "pointer-events-none opacity-50"
      )}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const itemValue = index + 1
        const isActive = displayValue >= itemValue
        const isChecked = currentValue === itemValue
        const isTabbable = isChecked || (currentValue === 0 && itemValue === 1)

        return (
          <button
            key={itemValue}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={isTabbable ? 0 : -1}
            data-slot="rating-item"
            data-state={isActive ? "on" : "off"}
            className={cn(
              "text-muted-foreground/40 hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-offset-background rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none",
              isActive && "text-primary"
            )}
            onClick={() => setValue(itemValue)}
            onMouseEnter={() =>
              !readOnly && !disabled && setHoverValue(itemValue)
            }
            onMouseLeave={() => setHoverValue(null)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          >
            <StarIcon className="fill-current" />
            <span className="sr-only">{`Rate ${itemValue} out of ${max}`}</span>
          </button>
        )
      })}
    </div>
  )
}

export { Rating }
