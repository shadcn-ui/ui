"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { CardDescription } from "./card"
import { Label } from "./label"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>, {
    label?: string;
    description?: string;
    inline?: boolean
    showDivider?: boolean,
    groupItems?: RadioGroupItemProps[]
  } &
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, label, description, inline, showDivider, groupItems, ...props }, ref) => {
  const groupClassName = cn("grid gap-2", className, inline && "flex space-x-2 items-center")
  return (
    <div>
      {(label || description) && <div className="py-2">
        {label && <Label className="text-lg w-full font-semibold">{label}</Label>}
        {description && <CardDescription className="text-sm w-full font-light">{description}</CardDescription>}
      </div>}
      {showDivider && <hr />}
      {!groupItems ? <RadioGroupPrimitive.Root className={groupClassName} {...props} ref={ref} /> : null}
      {groupItems && <RadioGroupPrimitive.Root className={groupClassName} {...props} ref={ref}>
        {groupItems?.map((item, index) => {
          return (
            <RadioGroupItem {...item} key={index} />
          )
        })}
      </RadioGroupPrimitive.Root>}
    </div >
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const CoreRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  { fillColor?: string } &
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ fillColor, className, children, ...props }, ref) => {
  return (
    <span className="relative flex">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          fillColor ? `bg-${fillColor} border-none focus:ring-0 focus:ring-ring h-6 w-6` : "h-4 w-4"
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className={cn(`${fillColor ? `rounded-full text-${fillColor} absolute h-10 w-10` : "fill-current text-current h-2.5 w-2.5 "} `)} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    </span>
  )
})
CoreRadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName


type RadioGroupItemProps = {
  label?: string;
  description?: string;
  alignment?: "left" | "right";
  inline?: boolean;
  header?: string;
  headerDescription?: string;
  fillColor?: string;
  showDivider?: boolean;
} & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, children, label, description, alignment, inline, header, headerDescription, showDivider, fillColor, ...props }, ref): any => {
  return (
    <div className="space-y-2 w-full mx-auto">
      {header || headerDescription && <div>
        {header && <p className="text-md w-full font-semibold">{header}</p>}
        {headerDescription && <p className="text-md w-full font-light">{headerDescription}</p>}
      </div>}
      <div className={`flex items-center w-full text-sm leading-6 ${alignment === "right" && "justify-between"}`}>
        {alignment === "left" || !alignment ?
          <CoreRadioGroupItem className={className + " mr-2"} children={children} {...props} ref={ref} fillColor={fillColor} /> : null}
        {label && <Label htmlFor={props?.id} className={`${!inline ? "w-full whitespace-nowrap" : "mr-1"} text-sm font-medium leading-6`}>{label}</Label>}
        {inline && description && <CardDescription className="text-sm">{description}</CardDescription>}
        {alignment === "right" ? <CoreRadioGroupItem className={className} children={children} {...props} ref={ref} fillColor={fillColor} /> : null}
      </div>
      {!inline && description && <CardDescription className={`${alignment === "right" ? "" : "ml-6"} text-sm`}>{description}</CardDescription>}
      {showDivider && <div className="py-2"><hr /></div>}
    </div >
  )
})

export { RadioGroup, RadioGroupItem }
