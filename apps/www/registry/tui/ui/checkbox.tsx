"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Icon } from "./icon"

const CheckboxCore = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 focus:ring-ring shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Icon name="check-solid" className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
CheckboxCore.displayName = CheckboxPrimitive.Root.displayName

export { CheckboxCore }

type checkBoxType = {
  description?: string,
  label?: string,
  alignment?: "top" | "left" | "right" | "bottom";
  checkBoxClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  inline?: boolean;
  showDivider?: boolean;
  className?: string;
} &
  React.ElementRef<typeof CheckboxPrimitive.Root>


export const Description = ({ description, dark = false, descriptionClassName }:
  { description: string, dark: boolean, descriptionClassName?: string }) => {
  return (
    <div className="flex">
      <p className={`text-sm flex-wrap ${dark ? "text-muted-accent" : "text-muted-foreground"}`}>{description}</p>
    </div>
  )
}


export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  {
    description?: string,
    label?: string,
    alignment?: "top" | "left" | "right" | "bottom";
    checkBoxClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    inline?: boolean;
    showDivider?: boolean;
    className?: string;
  } &
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ description, label, alignment, checkBoxClassName, labelClassName, inline, showDivider, descriptionClassName, ...props }, ref) => {
  const uniqueNumber = Math.floor(Math.random() * 600)?.toString()
  return (
    <div className={`${alignment !== "top" && alignment !== "bottom" && !showDivider ? "flex justify-start" : ""}`}>
      {alignment === "top" ? <CheckboxCore className={checkBoxClassName} {...props} id={uniqueNumber} /> : null}
      <div className={`flex w-full ${!description ? "" : "items-center"} ${inline && "items-center"}`}>

        {!alignment || alignment === "left" ? <CheckboxCore className={checkBoxClassName} {...props} id={uniqueNumber} /> : null}

        <div className={`w-full ${(label && description && !inline && (!alignment || alignment === "left")) ? "pt-4 ml-3" : label && !description && !showDivider ? "ml-2" : ""} ${inline && !showDivider && "flex ml-3 items-center"} ${inline && showDivider && "flex ml-3 my-3 items-center"}`}>
          {label && <Label className={`${labelClassName} ${inline ? "mr-1" : ""}`} htmlFor={uniqueNumber}>{label}</Label>}
          {description && <Description description={description} dark={!label} descriptionClassName={descriptionClassName} />}
        </div>

        {alignment === "right" ? <div className={`flex justify-end ${(description) ? "h-8" : "h-4"}`}>
          <CheckboxCore className={checkBoxClassName} {...props} id={props?.id ? props?.id : uniqueNumber} />
        </div> : null}

      </div>

      {alignment === "bottom" ? <CheckboxCore className={checkBoxClassName} {...props} id={uniqueNumber} /> : null}

      {showDivider && <div className='pt-3'><hr /></div>}
    </div>
  )
})