import * as React from "react"

import { cn } from "@/lib/utils"
import { Input, InputProps } from "@/registry/new-york/ui/input"

export interface InputWithIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position: "trailing" | "leading"
  icon: React.ReactNode
  iconProps?: React.HTMLAttributes<HTMLDivElement>
  inputProps?: InputProps
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  (
    {
      className,
      children,
      position,
      icon,
      iconProps = {},
      inputProps = {},
      ...props
    },
    ref
  ) => {
    const { className: classNameIconProps, ...restIconProps } = iconProps
    const { className: classNameInputProps, ...restInputProps } = inputProps
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        {position === "leading" ? (
          <>
            <Input
              className={cn("pl-10", classNameInputProps)}
              {...restInputProps}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
                classNameIconProps
              )}
              {...restIconProps}
            >
              {icon}
            </div>
          </>
        ) : (
          <>
            <Input
              className={cn("pr-10", classNameInputProps)}
              {...restInputProps}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
                classNameIconProps
              )}
              {...restIconProps}
            >
              {icon}
            </div>
          </>
        )}
      </div>
    )
  }
)
InputWithIcon.displayName = "InputWithIcon"

export { InputWithIcon }
