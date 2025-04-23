"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const RatingContext = React.createContext<{
  value: number
  onChange: (value: number) => void
  hoverValue: number
  onHover: (value: number) => void
  size: number
  color: string
  max: number
  showActive: boolean
  name?: string
}>({
  value: 0,
  onChange: () => {},
  hoverValue: 0,
  onHover: () => {},
  size: 20,
  color: "gold",
  max: 5,
  showActive: false,
  name: undefined,
})

export interface RatingProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onValueChange?: (value: number) => void
  size?: number
  color?: string
  max?: number
  className?: string
  showActive?: boolean
  name?: string
  disabled?: boolean
  required?: boolean
  form?: string
  children?: React.ReactNode
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      onValueChange,
      size = 20,
      color = "gold",
      max = 5,
      className,
      showActive = false,
      name,
      disabled = false,
      required = false,
      form,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [hoverValue, setHoverValue] = React.useState(0)

    const inputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const handleChange = React.useCallback(
      (newValue: number) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onChange?.(newValue)
        onValueChange?.(newValue)
      },
      [isControlled, onChange, onValueChange]
    )

    const contextValue = React.useMemo(
      () => ({
        value,
        onChange: handleChange,
        hoverValue,
        onHover: setHoverValue,
        size,
        color,
        max,
        showActive,
        name,
      }),
      [value, handleChange, hoverValue, size, color, max, showActive, name]
    )

    const hasChildren = React.Children.count(children) > 0

    return (
      <RatingContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-1 transition-colors",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onMouseLeave={() => !disabled && setHoverValue(0)}
          {...props}
        >
          {name && (
            <input
              ref={inputRef}
              type="number"
              name={name}
              value={value}
              min={0}
              max={max}
              required={required}
              disabled={disabled}
              form={form}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="sr-only"
              aria-hidden="true"
            />
          )}

          {hasChildren ? children : <RatingGroup disabled={disabled} />}
        </div>
      </RatingContext.Provider>
    )
  }
)
Rating.displayName = "Rating"

const useRating = () => {
  const context = React.useContext(RatingContext)
  if (!context) {
    throw new Error("useRating must be used within a Rating component")
  }
  return context
}

const RatingGroup: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { max } = useRating()

  return (
    <>
      {Array.from({ length: max }).map((_, i) => (
        <RatingItem key={i} value={i + 1} disabled={disabled}>
          <RatingIcon />
        </RatingItem>
      ))}
    </>
  )
}
export interface RatingItemProps {
  value: number
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

const RatingItem = React.forwardRef<HTMLDivElement, RatingItemProps>(
  ({ value, className, disabled, children, ...props }, ref) => {
    const {
      onChange,
      onHover,
      value: contextValue,
      hoverValue,
      showActive,
    } = useRating()

    const isActive = showActive
      ? hoverValue
        ? hoverValue === value
        : contextValue === value
      : hoverValue
        ? hoverValue >= value
        : contextValue >= value

    const handleClick = () => {
      if (!disabled) {
        onChange(value)
      }
    }

    const handleMouseEnter = () => {
      if (!disabled) {
        onHover(value)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center transition-transform",
          !disabled && "cursor-pointer hover:scale-110",
          isActive ? "data-[active=true]:scale-110" : "",
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        data-active={isActive}
        data-disabled={disabled}
        aria-disabled={disabled}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                isActive,
                disabled,
              })
            : child
        )}
      </div>
    )
  }
)
RatingItem.displayName = "RatingItem"

export interface RatingIconProps {
  isActive?: boolean
  icon?: React.ReactNode
  activeIcon?: React.ReactNode
  activeColor?: string
  inactiveColor?: string
  disabled?: boolean
  className?: string
}

const RatingIcon = React.forwardRef<HTMLDivElement, RatingIconProps>(
  (
    {
      isActive,
      icon,
      activeIcon,
      activeColor,
      inactiveColor = "transparent",
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const { color, size } = useRating()

    const fillColor = isActive ? activeColor || color : inactiveColor
    const strokeColor = activeColor || color

    const renderIcon = () => {
      if (isActive && activeIcon) {
        return activeIcon
      }

      if (icon) {
        return icon
      }

      return (
        <StarIcon
          size={size}
          color={strokeColor}
          fill={isActive ? fillColor : inactiveColor}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "transition-opacity",
          isActive
            ? "data-[active=true]:opacity-100"
            : "data-[active=false]:opacity-75",
          disabled && "opacity-50",
          className
        )}
        data-active={isActive}
        data-disabled={disabled}
        {...props}
      >
        {renderIcon()}
      </div>
    )
  }
)
RatingIcon.displayName = "RatingIcon"

export interface RatingLabelProps {
  className?: string
  children?: React.ReactNode
  isActive?: boolean
  disabled?: boolean
}

const RatingLabel = React.forwardRef<HTMLParagraphElement, RatingLabelProps>(
  ({ className, children, isActive, disabled, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "mt-1 text-xs transition-opacity",
          isActive
            ? "data-[active=true]:opacity-100"
            : "data-[active=false]:opacity-60",
          disabled && "opacity-50",
          className
        )}
        data-active={isActive}
        data-disabled={disabled}
        {...props}
      >
        {children}
      </p>
    )
  }
)
RatingLabel.displayName = "RatingLabel"

export { Rating, RatingItem, RatingIcon, RatingLabel }
