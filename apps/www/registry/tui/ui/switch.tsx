"use client"

import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { CardDescription } from "./card"
import { Label } from "./label"
import { useState } from 'react'
import { Icon, IconType } from "./icon"

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      variant: {
        default: "bg-transparent h-[24px] w-[44px]",
        short:
          "bg-transparent hover:bg-accent h-[14px] w-[34px]",
        icon:
          "bg-transparent hover:bg-accent h-[24px] w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const switchBallVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  {
    variants: {
      variant: {
        default: "bg-background h-5 w-5",
        short:
          "h-5 w-5 data-[state=checked]:translate-x-3 data-[state=unchecked]:-translate-x-1 shadow-sm border",
        icon:
          "bg-background h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)



const CoreSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  {
    variant?: "default" | "short" | "icon" | null | undefined,
    iconLeft?: IconType,
    iconRight?: IconType,
    iconLeftClassName?: string
    iconRightClassName?: string
  } &
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, variant = "default", iconLeft, iconRight, iconLeftClassName, iconRightClassName, ...props }, ref) => {
  const uniqueNumber = (Math.floor(Math.random() * 10000))?.toString()
  const [isChecked, setIsChecked] = useState<boolean>(false || props?.value ? true : false);

  React.useEffect(() => {
    const element: any = document.getElementById(uniqueNumber)
    if (element["data-state"] === "unchecked") {
      setIsChecked(false)
    } else {
      setIsChecked(true)
    }
  }, [document])

  React.useEffect(() => {
    setIsChecked(Boolean(props.value));
  }, [props.value]);

  return (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ variant, className }))}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(switchBallVariants({ variant, className }))}
        id={uniqueNumber}
      >
        {variant === "icon" ? (
          <div className="flex items-center h-full justify-center">
            <Icon
              name={iconLeft || "xmark-solid"}
              className={cn(
                "w-1/2 h-1/2 text-muted-accent",
                iconLeftClassName ?? "",
                isChecked && "hidden"
              )}
            />
            <Icon
              name={iconRight || "check-solid"}
              className={cn(
                "w-1/2 h-1/2 text-muted-accent",
                iconRightClassName ?? "",
                !isChecked && "hidden"
              )}
            />
          </div>
        ) : null}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

CoreSwitch.displayName = SwitchPrimitives.Root.displayName;

type SwitchModifiedTypes = {
  className?: string;
  variant?: "default" | "short" | "icon" | null | undefined;
  label?: string;
  description?: string;
  alignment?: "left" | "right" | "top" | "bottom";
  inline?: boolean;
  props?: any,
  iconLeft?: IconType,
  iconRight?: IconType,
  iconLeftClassName?: string,
  iconRightClassName?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchModifiedTypes &
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, variant, label, description, alignment, inline, iconLeft, iconRight, iconLeftClassName, iconRightClassName, ...props }, ref) => {
  return (
    <>
      {(label || description) && (alignment === undefined || alignment === "left" || alignment === "right") ?
        <div className='flex space-x-4 justify-center items-center pt-3 pb-6 flex-wrap'>
          {alignment === "left" &&
            <CoreSwitch
              aria-label="Default Toggle"
              iconLeft={iconLeft} iconLeftClassName={iconLeftClassName}
              iconRight={iconRight} iconRightClassName={iconRightClassName}
              {...props} className={className} variant={variant} ref={ref}
            />}
          <div className={`${inline ? "flex space-x-2 items-center" : ""}`}>
            <Label>{label}</Label>
            <CardDescription>{description}</CardDescription>
          </div>
          {(alignment === "right" || !alignment) && <CoreSwitch aria-label="Default Toggle" {...props} className={className} variant={variant} ref={ref} />}
        </div>
        : (label || description) && alignment === undefined || alignment === "top" || alignment === "bottom" ?
          <div className="w-full justify-center flex">
            <div>
              {alignment === "top" && <CoreSwitch aria-label="Default Toggle"
                iconLeft={iconLeft} iconLeftClassName={iconLeftClassName}
                iconRight={iconRight} iconRightClassName={iconRightClassName}
                {...props} className={className} variant={variant} ref={ref}
              />}
              <div className={`${inline ? "flex space-x-2 items-center my-2" : ""} w-full`}>
                <Label>{label}</Label>
                <CardDescription>{description}</CardDescription>
              </div>
              {alignment === "bottom" && <CoreSwitch aria-label="Default Toggle"
                iconLeft={iconLeft} iconLeftClassName={iconLeftClassName}
                iconRight={iconRight} iconRightClassName={iconRightClassName}
                {...props} className={className} variant={variant} ref={ref} />
              }
            </div>
          </div>
          :
          <CoreSwitch aria-label="Default Toggle"
            iconLeft={iconLeft} iconLeftClassName={iconLeftClassName}
            iconRight={iconRight} iconRightClassName={iconRightClassName}
            {...props} className={className} variant={variant} ref={ref}
          />
      }
    </>
  )
})

export { Switch }
