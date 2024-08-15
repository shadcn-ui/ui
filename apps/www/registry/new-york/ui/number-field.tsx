import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { NumericFormat, type NumericFormatProps } from "react-number-format"

import { cn } from "@/lib/utils"

import { Button, ButtonProps } from "./button"

interface NumberFieldContextProps {
  value: string | number | null | undefined
  setValue: React.Dispatch<
    React.SetStateAction<string | number | null | undefined>
  >
  disableNumberField: boolean
}
const NumberFieldContext = React.createContext<
  NumberFieldContextProps | undefined
>(undefined)

interface NumberFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
}
const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  ({ className, children, disabled = false }, ref) => {
    const [value, setValue] = React.useState<
      string | number | null | undefined
    >(undefined)

    return (
      <NumberFieldContext.Provider
        value={{ value, setValue, disableNumberField: disabled }}
      >
        <div
          ref={ref}
          className={cn(
            "relative rounded-md border overflow-hidden w-fit",
            !disabled ? "focus-within:ring-1 focus-within:ring-ring" : "",
            className
          )}
        >
          {children}
        </div>
      </NumberFieldContext.Provider>
    )
  }
)

const NumberFieldInput = React.forwardRef<HTMLDivElement, NumericFormatProps>(
  ({ className, step = 1, ...props }, ref) => {
    const context = React.useContext(NumberFieldContext)

    React.useEffect(() => {
      if (!context) return
      context.setValue(props.value || props.defaultValue)
    }, [])

    return (
      <NumericFormat
        getInputRef={ref}
        className={cn(
          "h-9 w-full px-3 py-1 bg-transparent placeholder:text-muted-foreground text-sm rounded-md transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
          !context ? "border focus:ring-1 focus:ring-ring" : "",
          className
        )}
        disabled={
          context ? context.disableNumberField || props.disabled : false
        }
        value={context ? context.value : props.value}
        onValueChange={(inputValue, changeMeta) => {
          context && context.setValue(inputValue.value)
          props.onValueChange && props.onValueChange(inputValue, changeMeta)
        }}
        {...props}
      />
    )
  }
)

interface NumberFieldStepperProps extends ButtonProps {
  step?: number
}
const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldStepperProps
>(({ className, variant, size, asChild = false, step = 1, ...props }, ref) => {
  const context = React.useContext(NumberFieldContext)

  if (!context) {
    throw new Error(
      "NumberFieldIncrement must be used within a NumberField component"
    )
  }

  return (
    <Button
      ref={ref}
      className={cn(
        "border-r-0 border-t-0 w-full h-full text-muted-foreground hover:text-foreground p-0 rounded-none flex flex-col justify-center align-center",
        "absolute top-0 right-0 h-1/2 w-6",
        className
      )}
      variant="outline"
      onClick={() => context.setValue(Number(context.value || 0) + step)}
      disabled={context ? context.disableNumberField || props.disabled : false}
      {...props}
    >
      <ChevronUpIcon />
    </Button>
  )
})
NumberFieldIncrement.displayName = "NumberFieldIncrement"

const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldStepperProps
>(({ className, variant, size, asChild = false, step = 1, ...props }, ref) => {
  const context = React.useContext(NumberFieldContext)

  if (!context) {
    throw new Error(
      "NumberFieldDecrement must be used within a NumberField component"
    )
  }

  return (
    <Button
      ref={ref}
      className={cn(
        "border-r-0 border-b-0 w-full h-full text-muted-foreground hover:text-foreground p-0 rounded-none flex flex-col justify-center align-center",
        "absolute bottom-0 right-0 h-1/2 w-6",
        className
      )}
      variant="outline"
      onClick={() => context.setValue(Number(context.value || 0) - step)}
      disabled={context ? context.disableNumberField || props.disabled : false}
      {...props}
    >
      <ChevronDownIcon />
    </Button>
  )
})
NumberFieldDecrement.displayName = "NumberFieldDecrement"

export {
  NumberField,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
}
