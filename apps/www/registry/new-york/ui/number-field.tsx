import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { NumericFormat, type NumericFormatProps } from "react-number-format"

import { cn } from "@/lib/utils"

import { Button, ButtonProps } from "./button"

interface NumberFieldContextProps {
  delta: number
  setDelta: React.Dispatch<React.SetStateAction<number>>
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
    const [delta, setDelta] = React.useState<number>(0)

    return (
      <NumberFieldContext.Provider
        value={{ delta, setDelta, disableNumberField: disabled }}
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

const convertToNumber = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value
  const parsed = parseFloat(`${value}`)
  return isNaN(parsed) ? undefined : parsed
}

interface NumberFieldInputProps
  extends Omit<NumericFormatProps, "onValueChange"> {
  onValueChange?: (value: number | undefined) => void
}
const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  NumberFieldInputProps
>(({ className, onValueChange, ...props }, ref) => {
  const context = React.useContext(NumberFieldContext)
  const [value, setValue] = React.useState(props.value)

  React.useEffect(() => {
    if (!context || context.delta === 0) return
    const newValue = (convertToNumber(value) || 0) + context.delta
    setValue(newValue)
    onValueChange && onValueChange(newValue)
    context.setDelta(0)
  }, [context?.delta])

  return (
    <NumericFormat
      getInputRef={ref}
      className={cn(
        "h-9 w-full px-3 py-1 bg-transparent placeholder:text-muted-foreground text-sm rounded-md transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        !context ? "border focus:ring-1 focus:ring-ring" : "",
        className
      )}
      disabled={context ? context.disableNumberField || props.disabled : false}
      value={value}
      onValueChange={(inputValue) => {
        setValue(inputValue.floatValue)
        onValueChange && onValueChange(inputValue.floatValue)
      }}
      {...props}
    />
  )
})

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
      onClick={() => context.setDelta(step)}
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
      onClick={() => context.setDelta(-step)}
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
