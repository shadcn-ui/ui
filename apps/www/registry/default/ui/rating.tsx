"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { LucideIcon, Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  selectedValue: number
  Icon?: LucideIcon
}

const RatingItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RatingItemProps
>(({ className, value, selectedValue, Icon = Star, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        "aspect-square fill-transparent px-1 text-primary ring-offset-background md:px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:stroke-primary",
        props["aria-readonly"] && "pointer-events-none",
        selectedValue >= Number(value) && "[&>svg]:fill-primary",
        className
      )}
      {...props}
    >
      <Icon className="size-6 fill-transparent stroke-transparent stroke-[1.5]" />
    </RadioGroupPrimitive.Item>
  )
})

RatingItem.displayName = RadioGroupPrimitive.Item.displayName

interface RatingGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  Icon?: LucideIcon
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
      <div className="flex gap-x-2 gap-y-1 items-start flex-col-reverse flex-wrap md:items-center md:flex-row">
        <RadioGroupPrimitive.Root
          className={cn(
            "flex items-center",
            props.disabled && "cursor-not-allowed opacity-50",
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
        </RadioGroupPrimitive.Root>
        <p>{customLabel ?? `(${selectedValue} / ${ratingSteps})`}</p>
      </div>
    )
  }
)
RatingGroup.displayName = RadioGroupPrimitive.Root.displayName

export { RatingGroup, RatingItem }
