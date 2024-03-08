"use client"

import * as React from "react"
import { StarFilledIcon } from "@radix-ui/react-icons"
import { IconProps } from "@radix-ui/react-icons/dist/types"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

interface RatingItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  selectedValue: number
  Icon?: React.ComponentType<IconProps>
}

const RatingItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RatingItemProps
>(
  (
    { className, value, selectedValue, Icon = StarFilledIcon, ...props },
    ref
  ) => {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        value={value}
        className={cn(
          "aspect-square fill-transparent px-1.5 text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:stroke-primary",
          props["aria-readonly"] && "pointer-events-none",
          selectedValue >= Number(value) && "[&>svg]:text-primary",
          className
        )}
        {...props}
      >
        <Icon className="size-6 fill-none stroke-transparent stroke-1 text-transparent" />
      </RadioGroupPrimitive.Item>
    )
  }
)

RatingItem.displayName = RadioGroupPrimitive.Item.displayName

interface RatingGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  Icon?: React.ComponentType<IconProps>
  customLabel?: string
  ratingSteps?: number
  readonly?: boolean
}

const RatingGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RatingGroupProps
>(
  (
    {
      className,
      Icon,
      ratingSteps = 5,
      customLabel,
      readonly = false,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(
      Number(props.defaultValue) || 3
    )

    return (
      <RadioGroupPrimitive.Root
        className={cn(
          "flex items-center",
          props.disabled && "pointer-events-none",
          className
        )}
        {...props}
        ref={ref}
        aria-readonly={readonly}
        onValueChange={(value) => {
          if (readonly) return
          setSelectedValue(Number(value))
          props.onValueChange && props.onValueChange(value)
        }}
        tabIndex={readonly ? -1 : 0}
      >
        {Array.from({ length: ratingSteps }, (_, i) => i + 1).map((value) => (
          <RatingItem
            key={value}
            value={value.toString()}
            Icon={Icon}
            selectedValue={selectedValue}
            aria-readonly={readonly}
          />
        ))}
        <p className={cn("ml-2", !customLabel && "w-14")}>
          {customLabel ? customLabel : `(${selectedValue} / ${ratingSteps})`}
        </p>
      </RadioGroupPrimitive.Root>
    )
  }
)
RatingGroup.displayName = RadioGroupPrimitive.Root.displayName

export { RatingGroup, RatingItem }
